import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "6months"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    currency: {
      type: String,
      default: "INR",
      required: true,
    },

    creditsGranted: {
      type: Number,
      required: true,
    },

    validityDays: {
      type: Number,
      required: true,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },

    razorpayPaymentId: {
      type: String,
    },

    receipt: {
      type: String,
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["created", "paid"],
      default: "created",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    subscriptionExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index(
  { razorpayPaymentId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

paymentSchema.index({
  user: 1,
  createdAt: -1,
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
