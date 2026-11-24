import Activity from "../models/activity.model.js";

const activityRepository = {
  async create(data) {
    return Activity.create(data);
  },

  async findByUser(userId, { page = 1, limit = 10, type } = {}) {
    const skip = (page - 1) * limit;
    const filter = { user: userId };
    if (type && type !== "all") filter.type = type;

    const [items, totalItems] = await Promise.all([
      Activity.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Activity.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalItems / limit);
    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  },

  async existsByReference(referenceId, type) {
    return Activity.exists({ referenceId, type });
  },
};

export default activityRepository;