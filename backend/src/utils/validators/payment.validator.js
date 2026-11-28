import { z } from "zod";

// Validate selected subscription plan
export const createOrderSchema = z
  .object({
    billingCycle: z.enum(["monthly", "6months"]),
  })
  .strict();

// Validate Razorpay Checkout response
export const verifyPaymentSchema = z
  .object({
    razorpay_order_id: z
      .string()
      .max(100)
      .regex(/^order_[a-zA-Z0-9]+$/),

    razorpay_payment_id: z
      .string()
      .max(100)
      .regex(/^pay_[a-zA-Z0-9]+$/),

    razorpay_signature: z.string().regex(/^[a-fA-F0-9]{64}$/),
  })
  .strict();

// Validate order status check
export const reconcilePaymentSchema = z
  .object({
    orderId: z
      .string()
      .max(100)
      .regex(/^order_[a-zA-Z0-9]+$/),
  })
  .strict();
