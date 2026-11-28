import Payment from "../models/payment.model.js";

const paymentRepository = {
  async create(data) {
    return Payment.create(data);
  },

  async findByOrderId(orderId, { session = null } = {}) {
    return Payment.findOne({
      razorpayOrderId: orderId,
    }).session(session);
  },

  async findByOrderIdAndUser(orderId, userId, { session = null } = {}) {
    return Payment.findOne({
      razorpayOrderId: orderId,
      user: userId,
    }).session(session);
  },

  async markPaid(orderId, data, { session }) {
    return Payment.findOneAndUpdate(
      {
        razorpayOrderId: orderId,
        status: "created",
      },
      {
        $set: {
          ...data,
          status: "paid",
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
        session,
      },
    );
  },

  async findByUser(userId, page = 1) {
    const limit = 10;
    const filter = { user: userId };
    const totalItems = await Payment.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);

    const payments = await Payment.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .lean();

    return {
      payments,
      pagination: {
        page: currentPage,
        limit,
        totalItems,
        totalPages,
        hasPreviousPage: currentPage > 1,
        hasNextPage: currentPage < totalPages,
      },
    };
  },
};

export default paymentRepository;
