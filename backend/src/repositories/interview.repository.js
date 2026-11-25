import InterviewSession from "../models/interview-session.model.js";
import { CREDIT_COSTS } from "../utils/constants.js";

const interviewRepository = {
  async create(data, { session = null } = {}) {
    const interview = new InterviewSession(data);
    return interview.save({ session });
  },

  async findById(id) {
    return InterviewSession.findById(id);
  },

  async findByIdAndUser(id, userId, { session = null } = {}) {
    return InterviewSession.findOne({ _id: id, user: userId }).session(session);
  },

  async updateActiveAnswer(id, userId, questionIndex, data) {
    return InterviewSession.findOneAndUpdate(
      { _id: id, user: userId, status: "active", currentQuestionIndex: questionIndex,
        "answers.questionIndex": { $ne: questionIndex } },
      data,
      { returnDocument: "after" },
    );
  },

  async transitionActive(id, userId, status, { session }) {
    const endedAt = new Date();
    return InterviewSession.findOneAndUpdate(
      { _id: id, user: userId, status: "active" },
      [{
        $set: {
          status,
          endedAt,
          creditsRefunded: status === "interrupted"
            ? CREDIT_COSTS.INTERVIEW
            : { $cond: [{ $eq: [{ $size: "$answers" }, 0] }, CREDIT_COSTS.INTERVIEW, 0] },
          actualDuration: {
            $round: [{ $divide: [{ $subtract: [endedAt, "$startedAt"] }, 1000] }, 0],
          },
        },
      }],
      { returnDocument: "after", session, updatePipeline: true },
    );
  },

  async findActiveByUser(userId) {
    return InterviewSession.findOne({ user: userId, status: "active" });
  },

  async updateById(id, data) {
    return InterviewSession.findByIdAndUpdate(id, data, { returnDocument: "after" });
  },

  async pushMessage(id, message) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $push: { messages: message } },
      { returnDocument: "after" },
    );
  },

  async pushAnswer(id, answer) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $push: { answers: answer } },
      { returnDocument: "after" },
    );
  },

  async incrementQuestionIndex(id) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $inc: { currentQuestionIndex: 1 } },
      { returnDocument: "after" },
    );
  },

  async findHistoryByUser(userId, { page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const [sessions, total] = await Promise.all([
      InterviewSession.find({ user: userId })
        .select("-messages -questions -answers") 
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(limit),
      InterviewSession.countDocuments({ user: userId }),
    ]);
    return { sessions, total, page, limit };
  },

  async findFullById(id, userId) {
    return InterviewSession.findOne({ _id: id, user: userId });
  },

  async markCompleted(id, { evaluation, endedAt, actualDuration }) {
    return InterviewSession.findOneAndUpdate(
      { _id: id, status: "active" },
      {
        status: "completed",
        evaluation,
        endedAt,
        actualDuration,
      },
      { returnDocument: "after" },
    );
  },

};

export default interviewRepository;
