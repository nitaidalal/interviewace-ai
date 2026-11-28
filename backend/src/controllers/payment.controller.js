import asynchandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import paymentService from "../services/payment.service.js";

// GET /payments/plans
export const getPaymentPlans = asynchandler(async (req, res) => {
  const plans = await paymentService.getPlans();
  res
    .status(200)
    .json(
      new ApiResponse(200, { plans }, "Payment plans fetched successfully"),
    );
});

// POST /payments/create-order
export const createPaymentOrder = asynchandler(async (req, res) => {
  const { billingCycle } = req.body;
  const order = await paymentService.createOrder(req.user.id, billingCycle);
  res
    .status(201)
    .json(new ApiResponse(201, order, "Payment order created successfully"));
});

//POST /payments/verify
export const verifyPayment = asynchandler(async (req, res) => {
  const result = await paymentService.verifyPayment(req.user.id, req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Payment verified successfully"));
});

// POST /payments/reconcile
export const reconcilePayment = asynchandler(async (req, res) => {
  const result = await paymentService.reconcilePayment(
    req.user.id,
    req.body.orderId,
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.pending
          ? "Payment has not been captured yet"
          : "Payment verified successfully",
      ),
    );
});

// GET /payments/history
export const getPaymentHistory = asynchandler(async (req, res) => {
  const result = await paymentService.getPaymentHistory(
    req.user.id,
    req.query.page,
  );
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Payment history fetched successfully",
      ),
    );
});

// POST /payments/webhook
export const handleWebhook = asynchandler(async(req,res) => {
    const signature = req.get("x-razorpay-signature");
    const result = await paymentService.handleWebhook(req.body, signature);
    res.status(200).json(result);
})
