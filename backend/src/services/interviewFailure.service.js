import mongoose from "mongoose";
import interviewRepository from "../repositories/interview.repository.js";
import creditService from "./credit.service.js";
import ApiError from "../utils/ApiError.js";

export const settleInterview = async (sessionId, userId, status) => {
  // Only the transaction that transitions an active session may refund it.
  // Await transaction completion before returning any refund confirmation.
  return mongoose.connection.transaction(async (session) => {
    const options = { session };
    const interview = await interviewRepository.transitionActive(sessionId, userId, status, options);
    if (!interview) {
      const existing = await interviewRepository.findByIdAndUser(sessionId, userId, options);
      if (!existing) throw new ApiError(404, "Interview session not found");
      return existing;
    }
    if (interview.creditsRefunded > 0) {
      await creditService.refundInterview(userId, options);
    }
    return interview;
  });
};

const interruptedError = (interview, statusCode = 503) => {
  const creditsRefunded = interview.creditsRefunded || 0;
  const error = new ApiError(statusCode,
    creditsRefunded > 0
      ? `Interview interrupted because the AI service is unavailable. ${creditsRefunded} credits have been refunded.`
      : "This interview was previously interrupted. No additional credits were refunded.",
    [{ code: "INTERVIEW_INTERRUPTED", creditsRefunded, sessionId: String(interview._id) }],
  );
  error.code = "INTERVIEW_INTERRUPTED";
  error.creditsRefunded = creditsRefunded;
  return error;
};

export const assertInterviewActive = async (interview) => {
  if (interview.status === "active") return;
  if (interview.status === "interrupted") {
    throw interruptedError(interview);
  }
  throw new ApiError(409, "This interview session is no longer active.",
    [{ code: "INTERVIEW_NOT_ACTIVE", status: interview.status }]);
};

export const handleAIInterviewFailure = async (sessionId, userId, error) => {
  const interview = await settleInterview(sessionId, userId, "interrupted");
  if (interview.status !== "interrupted") {
    await assertInterviewActive(interview);
  }
  const status = error.statusCode ?? error.status;
  throw interruptedError(interview, status === 429 ? 429 : 503);
};
