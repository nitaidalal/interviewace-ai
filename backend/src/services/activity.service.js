import activityRepository from "../repositories/activity.repository.js";
import ApiError from "../utils/ApiError.js";

const VALID_TYPES = ["all", "interview", "resume", "programming"];
const MAX_LIMIT = 50;

const validateParams = (page, limit, type) => {
    const p = parseInt(page) || 1;
    if (p < 1) throw new ApiError(400, "Page must be a positive integer");
    const l = Math.min(parseInt(limit) || 10 , MAX_LIMIT);
    const t = VALID_TYPES.includes(type) ? type : "all";
    return { page: p, limit: l, type: t };
}


const activityService = {
  async getActivitiesByUser(userId, rawParams) {
    const { page, limit, type } = validateParams(rawParams);
    const result = await activityRepository.findByUser(userId, {
      page,
      limit,
      type,
    });

    const items = result.items.map((item) => ({
      id: item._id,
      type: item.type,
      referenceId: item.referenceId,
      title: item.title,
      score: item.score,
      language: item.language ?? null,
      createdAt: item.createdAt,
    }));

    return { items, pagination: result.pagination };
  },

  async createInterviewActivity(userId, interviewId, title, score) {
    const exists = await activityRepository.existsByReference(
      referenceId,
      "interview",
    );
    if (exists)
      throw new ApiError(400, "Activity already exists for this interview");

    await activityRepository.create({
      user: userId,
      type: "interview",
      referenceId: interviewId,
      title,
      score,
    });
  },

  async createResumeActivity(userId, resumeId, score) {
    const exists = await activityRepository.existsByReference(
      resumeId,
      "resume",
    );
    if (exists)
      throw new ApiError(400, "Activity already exists for this resume");

    await activityRepository.create({
      user: userId,
      type: "resume",
      referenceId: resumeId,
      title: "Resume ATS Analysis",
      score,
    });
  },
  async createProgrammingActivity({
    userId,
    submissionId,
    title,
    score,
    language,
  }) {
    const exists = await activityRepository.existsByReference(
      submissionId,
      "programming",
    );
    if (exists) return;
    await activityRepository.create({
      user: userId,
      type: "programming",
      referenceId: submissionId,
      title,
      score,
      language: language ?? null,
    });
  },
};

export default activityService;