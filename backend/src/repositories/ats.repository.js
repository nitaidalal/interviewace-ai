import ResumeAnalysis from "../models/resume-analysis.model.js";

const atsRepository = {
    async create(data){
        return ResumeAnalysis.create(data);
    },

    async findById(id,userId){
        return ResumeAnalysis.findOne({_id: id, user: userId});
    },

    async findHistoryByUser(userId, { page = 1, limit = 10 } = {}){
        const skip = (page - 1) * limit;
        const [analyses, total] = await Promise.all([
          ResumeAnalysis.find({ user: userId })
            .select("-atsReport -strengths -improvements -missingKeywords")
            .sort({ analyzedAt: -1 })
            .skip(skip)
            .limit(limit),
          ResumeAnalysis.countDocuments({ user: userId }),
        ]);
        return { analyses, total, page, limit };
    },

    async countByUser(userId) {
        return ResumeAnalysis.countDocuments({ user: userId })
      },
}

export default atsRepository;