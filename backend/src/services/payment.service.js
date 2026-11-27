import crypto from "node:crypto";
import mongoose from "mongoose";

import razorpay from "../config/razorpay.js";
import paymentRepository from "../repositories/payment.repository.js";
import userRepository from "../repositories/user.repository.js";
import creditService from "./credit.service.js";

import ApiError from "../utils/ApiError.js";
import { PAYMENT_PLANS } from "../utils/constants.js";

// ─── Helpers ────────────────────────────────────────────

// Compare HMAC signatures without ordinary string comparison
const signaturesMatch = (expected, received) => {
  if (typeof received !== "string" || !/^[a-fA-F0-9]{64}$/.test(received)) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(received, "hex"),
  );
};

// Wrap external Razorpay API failures
const callRazorpay = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error("Razorpay API error:", {
      status: error.statusCode,
      code: error.error?.code,
    });

    throw new ApiError(
      502,
      "Payment gateway is temporarily unavailable. Please retry.",
    );
  }
};

// Check captured payment against our stored order
const validateCapturedPayment = (order, providerPayment) => {
  if (
    providerPayment.order_id !== order.razorpayOrderId ||
    providerPayment.amount !== order.amount ||
    providerPayment.currency !== order.currency
  ) {
    throw new ApiError(400, "Payment details do not match the original order");
  }

  if (providerPayment.status !== "captured") {
    throw new ApiError(
      409,
      "Payment capture is pending. Check payment status again.",
    );
  }

  if (Number(providerPayment.amount_refunded || 0) > 0) {
    throw new ApiError(409, "This payment has been refunded. Contact support.");
  } 
};

// Common response after successful fulfilment
const getPaidResult = async (order) => {
  const user = await userRepository.findById(order.user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return {
    payment: order,
    user,
    credits: creditService.getCreditSummary(user),
  };
};

// ─── Payment Service ────────────────────────────────────

const paymentService = {
  // 1. Return available plans
  async getPlans() {
    return Object.entries(PAYMENT_PLANS).map(([billingCycle, plan]) => ({
      billingCycle,
      ...plan,
    }));
  },

  // 2. Create Razorpay order
  async createOrder(userId, billingCycle) {
    const plan = PAYMENT_PLANS[billingCycle];

    if (!plan) {
      throw new ApiError(400, "Invalid payment plan");
    }

    const user = await userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new ApiError(403, "User account is unavailable");
    }

    // Unique application-generated receipt
    const receipt = "ia_" + new mongoose.Types.ObjectId().toString(); 

    // Call Razorpay outside any database transaction
    const razorpayOrder = await callRazorpay(() =>
      razorpay.orders.create({
        amount: plan.amount,
        currency: plan.currency,
        receipt,
        partial_payment: false,

        notes: {
          userId: String(userId),
          billingCycle,
        },
      }),
    );

    // Store the original purchase details
    const order = await paymentRepository.create({
      user: userId,
      billingCycle,
      amount: plan.amount,
      currency: plan.currency,
      creditsGranted: plan.totalCredits,
      validityDays: plan.validityDays,
      razorpayOrderId: razorpayOrder.id,
      receipt,
    });

    return {
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.razorpayOrderId,
      amount: order.amount,
      currency: order.currency,
      billingCycle: order.billingCycle,
      planName: plan.name,
    };
  },

  // 3. Fulfil a captured payment exactly once
  async fulfillPayment(providerPayment) {
    if (!providerPayment?.order_id) {
      throw new ApiError(400, "Payment order ID is missing");
    }

    return mongoose.connection.transaction(async (session) => {
      const options = { session };

      const order = await paymentRepository.findByOrderId(
        providerPayment.order_id,
        options,
      );

      if (!order) {
        throw new ApiError(404, "Payment order not found");
      }

      validateCapturedPayment(order, providerPayment);

      // Duplicate verification or duplicate webhook
      if (order.status === "paid") {
        if (order.razorpayPaymentId !== providerPayment.id) {
          throw new ApiError(
            409,
            "Order has already been fulfilled using another payment",
          );
        }

        return order;
      }

      // Claim the unpaid order inside the transaction
      const paidOrder = await paymentRepository.markPaid(
        order.razorpayOrderId,
        {
          razorpayPaymentId: providerPayment.id,
          paidAt: new Date(),
        },
        options,
      );

      if (!paidOrder) {
        throw new ApiError(409, "Payment fulfilment conflict. Please retry.");
      }

      // Activate Pro using the same database session
      const updatedUser = await creditService.applyProSubscription(
        order.user,
        {
          billingCycle: order.billingCycle,
          razorpayPaymentId: providerPayment.id,
          razorpayOrderId: order.razorpayOrderId,
          creditsGranted: order.creditsGranted,
          validityDays: order.validityDays,
        },
        options,
      );

      paidOrder.subscriptionExpiresAt = updatedUser.subscription.expiresAt;

      await paidOrder.save({ session });

      return paidOrder;
    });
  },

  // 4. Verify Checkout response
  async verifyPayment(userId, body) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const order = await paymentRepository.findByOrderIdAndUser(
      razorpay_order_id,
      userId,
    );

    if (!order) {
      throw new ApiError(404, "Payment order not found");
    }

    // Use our stored order ID, not an untrusted amount
    // or billing cycle supplied by the frontend.
    const message = `${order.razorpayOrderId}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(message)
      .digest("hex");

    if (!signaturesMatch(expectedSignature, razorpay_signature)) {
      throw new ApiError(400, "Invalid payment signature");
    }

    // Obtain authoritative payment information
    const providerPayment = await callRazorpay(() =>
      razorpay.payments.fetch(razorpay_payment_id),
    );

    validateCapturedPayment(order, providerPayment);

    const paidOrder = await this.fulfillPayment(providerPayment);

    return getPaidResult(paidOrder);
  },

  // 5. Recover a payment if the browser callback fails
  async reconcilePayment(userId, orderId) {
    const order = await paymentRepository.findByOrderIdAndUser(orderId, userId);

    if (!order) {
      throw new ApiError(404, "Payment order not found");
    }

    if (order.status === "paid") {
      return getPaidResult(order);
    }

    //if the order is still unpaid, check Razorpay for the latest status
    const response = await callRazorpay(() =>
      razorpay.orders.fetchPayments(order.razorpayOrderId),
    );

    const capturedPayment = response.items.find(
      (payment) =>
        payment.status === "captured" &&
        payment.order_id === order.razorpayOrderId,
    );

    if (!capturedPayment) {
      return {
        pending: true,
        payment: order,
      };
    }

    const paidOrder = await this.fulfillPayment(capturedPayment);

    return getPaidResult(paidOrder);
  },
  
  // 6. Handle Razorpay server-to-server webhook 
  async handleWebhook(rawBody, signature) {
    if (!Buffer.isBuffer(rawBody)) {
      throw new ApiError(400, "Raw webhook body is required");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    if (!signaturesMatch(expectedSignature, signature)) {
      throw new ApiError(400, "Invalid webhook signature");
    }

    let event;

    try {
      event = JSON.parse(rawBody.toString("utf8"));
    } catch {
      throw new ApiError(400, "Invalid webhook payload");
    }

    // Only process captured payments
    if (event.event !== "payment.captured") {
      return { received: true }; 
    }

    const payment = event.payload?.payment?.entity;

    if (!payment?.id || !payment.order_id) {
      throw new ApiError(400, "Invalid payment event");
    }

    const order = await paymentRepository.findByOrderId(payment.order_id);

    // Ignore unrelated orders from the merchant account
    if (!order) {
      return { received: true };
    }

    // A webhook is a snapshot. Fetch current payment status.
    const providerPayment = await callRazorpay(() =>
      razorpay.payments.fetch(payment.id),
    );

    await this.fulfillPayment(providerPayment);

    return { received: true };
  },

  // 7. Retrieve payment history
  async getPaymentHistory(userId) {
    return paymentRepository.findByUser(userId);
  },
};

export default paymentService;
