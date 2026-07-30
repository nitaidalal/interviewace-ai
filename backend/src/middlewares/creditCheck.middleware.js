import asyncHandler from "../utils/asyncHandler.js";
import creditService from "../services/credit.service.js";
import { CREDIT_COSTS } from "../utils/constants.js";

/**
 * Factory function — returns middleware for a specific feature.
 *
 * Usage:
 *   router.post('/start', protect, checkCredits('INTERVIEW'), controller)
 *   router.post('/analyze', protect, checkCredits('ATS_ANALYSIS'), controller)
 *   router.post('/submit', protect, checkCredits('CODING_SUBMISSION'), controller)
 */
export const checkCredits = (feature) =>
  asyncHandler(async (req, res, next) => {
    const creditCost = CREDIT_COSTS[feature];

    if (!creditCost) {
      throw new Error(
        `Unknown feature: ${feature}. Check CREDIT_COSTS in constants.js`,
      );
    }

    if(process.env.NODE_ENV==="development" && process.env.BYPASS_CREDITS === "true") {
      return next();
    }

    // Step 1 — reset daily credits if new calendar day
    req.user = await creditService.resetDailyIfNeeded(req.user);

    // Step 2 — downgrade if Pro subscription expired
    req.user = await creditService.checkSubscriptionExpiry(req.user);

    // Step 3 — check if user can afford this action
    await creditService.canAfford(req.user, creditCost);

    // Attach cost to req so controller can deduct after success
    req.creditCost = creditCost;

    next();
  });
