import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import interviewService from "../services/interview.service.js";
import creditService from "../services/credit.service.js";

export const startInterview = asyncHandler(async (req, res) => {
  const result = await interviewService.startInterview(req.user.id, req.body);
  res
    .status(201)
    .json(new ApiResponse(201, result, "Interview started successfully"));
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const result = await interviewService.submitAnswer(
    req.params.id,
    req.user.id,
    req.body,
  );
  res
    .status(200)
    .json(new ApiResponse(200, result, "Answer submitted successfully"));
});

export const endInterview = asyncHandler(async (req, res) => {
  const result = await interviewService.endInterview(
    req.params.id,
    req.user.id,
  );
  res
    .status(200)
    .json(new ApiResponse(200, result, "Interview completed successfully"));
});

export const getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const result = await interviewService.getHistory(req.user.id, {
    page,
    limit,
  });
  res
    .status(200)
    .json(new ApiResponse(200, result, "History fetched successfully"));
});

export const getSessionById = asyncHandler(async (req, res) => {
  const session = await interviewService.getSessionById(
    req.params.id,
    req.user.id,
  );
  res
    .status(200)
    .json(new ApiResponse(200, { session }, "Session fetched successfully"));
});

export const abandonInterview = asyncHandler(async (req, res) => {
  const session = await interviewService.abandonSession(
    req.params.id,
    req.user.id,
  );
  res
    .status(200)
    .json(new ApiResponse(200, { session }, "Interview abandoned"));
});
