import { Router } from "express";

import {
  getPaymentPlans,
  createPaymentOrder,
  verifyPayment,
  reconcilePayment,
  getPaymentHistory,
} from "../controllers/payment.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";

import {
  createOrderSchema,
  verifyPaymentSchema,
  reconcilePaymentSchema,
} from "../utils/validators/payment.validator.js";

import ApiError from "../utils/ApiError.js";

const router = Router();

router.use(protect);

// Restrict browser payment mutations to allowed origins
const requireTrustedOrigin = (req, res, next) => {
  const origin = req.get("origin");

  const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((value) => value.trim());

  if (origin && !allowedOrigins.includes(origin)) {
    throw new ApiError(403, "Untrusted request origin");
  }

  if (!req.is("application/json")) {
    throw new ApiError(415, "JSON request body is required");
  }

  next();
};

router.get("/plans", getPaymentPlans);

router.post(
  "/create-order",
  requireTrustedOrigin,
  validate(createOrderSchema),
  createPaymentOrder,
);

router.post(
  "/verify",
  requireTrustedOrigin,
  validate(verifyPaymentSchema),
  verifyPayment,
);

router.post(
  "/reconcile",
  requireTrustedOrigin,
  validate(reconcilePaymentSchema),
  reconcilePayment,
);

router.get("/history", getPaymentHistory);

export default router;
