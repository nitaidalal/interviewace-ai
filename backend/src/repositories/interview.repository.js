  import InterviewSession from "../models/interview-session.model.js";

const interviewRepository = {
  async create(data) {
    return InterviewSession.create(data);
  },

  async findById(id) {
    return InterviewSession.findById(id);
  },

  async findByIdAndUser(id, userId) {
    return InterviewSession.findOne({ _id: id, user: userId });
  },

  async findActiveByUser(userId) {
    return InterviewSession.findOne({ user: userId, status: "active" });
  },

  async updateById(id, data) {
    return InterviewSession.findByIdAndUpdate(id, data, { new: true });
  },

  async pushMessage(id, message) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $push: { messages: message } },
      { new: true },
    );
  },

  async pushAnswer(id, answer) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $push: { answers: answer } },
      { new: true },
    );
  },

  async incrementQuestionIndex(id) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { $inc: { currentQuestionIndex: 1 } },
      { new: true },
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
    return InterviewSession.findByIdAndUpdate(
      id,
      {
        status: "completed",
        evaluation,
        endedAt,
        actualDuration,
      },
      { new: true },
    );
  },

  async markInterrupted(id, { endedAt, actualDuration }) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { status: "interrupted", endedAt, actualDuration },
      { new: true },
    );
  },

  async markAbandoned(id) {
    return InterviewSession.findByIdAndUpdate(
      id,
      { status: "abandoned", endedAt: new Date() },
      { new: true },
    );
  },
};

export default interviewRepository;
