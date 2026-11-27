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

  async findByUser(userId) {
    return Payment.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  },
};

export default paymentRepository;
