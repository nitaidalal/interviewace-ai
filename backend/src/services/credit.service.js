import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import { CREDIT_COSTS, PLAN_LIMITS } from "../utils/constants.js";

// ─── Helpers ──────────────────────────────────────────────────────

const getDailyLimit = (user) => {
  const { plan, billingCycle } = user.subscription;

  if (plan === "free") return PLAN_LIMITS.free.dailyLimit;

  if (billingCycle === "monthly") return PLAN_LIMITS.pro.monthly.dailyLimit;
  if (billingCycle === "6months") return PLAN_LIMITS.pro.sixMonths.dailyLimit;

  // fallback — should never hit this
  return PLAN_LIMITS.free.dailyLimit;
};

const istDateFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const isNewDay = (lastResetDate) => {
  const today = istDateFormatter.format(new Date());
  const lastReset = istDateFormatter.format(new Date(lastResetDate));
  return today !== lastReset;
};

// ─── Credit Service ───────────────────────────────────────────────

const creditService = {
  /**
   * Resets daily credits if the calendar date has changed.
   * Called as middleware before any credit-consuming action.
   */
  async resetDailyIfNeeded(user, { session = null } = {}) {
    if (!isNewDay(user.usage.lastDailyReset)) return user;

    const updated = await userRepository.updateMatching(
      {
        _id: user._id,
        "usage.lastDailyReset": user.usage.lastDailyReset,
      },
      {
        $set: {
          "usage.dailyCreditsUsed": 0,
          "usage.lastDailyReset": new Date(),
        },
      },
      { session },
    );

    if (updated) return updated;

    // Another request may already have reset the counter.
    const latest = await userRepository.findById(user._id, { session });

    if (!latest) {
      throw new ApiError(404, "User not found");
    }

    return latest;
  },

  /**
   * Checks if Pro subscription has expired.
   * If expired → downgrades user to free plan with fresh free credits.
   */
  async checkSubscriptionExpiry(user, { session = null } = {}) {
    if (user.subscription.plan !== "pro") return user;
    if (!user.subscription.expiresAt) return user;

    const now = new Date();
    const expiry = new Date(user.subscription.expiresAt);

    if (now <= expiry) return user;

    // Pro expired — downgrade to free
    const updated = await userRepository.updateMatching(
      {
        _id: user._id,
        "subscription.plan": "pro",
        "subscription.expiresAt": user.subscription.expiresAt,
      },
      {
        $set: {
          "subscription.plan": "free",
          "subscription.billingCycle": null,
          "subscription.isActive": false,
          "subscription.expiresAt": null,
          "usage.totalCredits": PLAN_LIMITS.free.totalCredits,
          "usage.remainingCredits": PLAN_LIMITS.free.totalCredits,
          "usage.dailyCreditsUsed": 0,
          "usage.lastDailyReset": now,
        },
      },
      { session },
    );

    if (!updated) {
      // A payment may have renewed Pro since this user was read.
      const latest = await userRepository.findById(user._id, { session });

      if (!latest) {
        throw new ApiError(404, "User not found");
      }

      return latest;
    }

    console.log(
      `⚠️  Pro subscription expired for user ${user._id}. Downgraded to free.`,
    );

    return updated;
  },

  /**
   * Checks if user can afford the credit cost.
   * Throws ApiError if insufficient total or daily credits.
   */
  async canAfford(user, creditCost) {
    const dailyLimit = getDailyLimit(user);

    // Check total remaining credits
    if (user.usage.remainingCredits < creditCost) {
      throw new ApiError(
        402,
        "Insufficient credits. Please upgrade your plan.",
        [
          {
            code: "INSUFFICIENT_CREDITS",
            remaining: user.usage.remainingCredits,
            required: creditCost,
          },
        ],
      );
    }

    // Check daily limit
    if (user.usage.dailyCreditsUsed + creditCost > dailyLimit) {
      throw new ApiError(
        429,
        "Daily credit limit reached. Try again tomorrow.",
        [
          {
            code: "DAILY_LIMIT_REACHED",
            dailyLimit,
            used: user.usage.dailyCreditsUsed,
            required: creditCost,
          },
        ],
      );
    }
  },

  /**
   * Deducts credits after a successful feature use.
   */
  async deduct(userId, creditCost, { session = null } = {}) {
    const updated = await userRepository.updateById(
      userId,
      {
        $inc: {
          "usage.remainingCredits": -creditCost,
          "usage.dailyCreditsUsed": creditCost,
        },
      },
      { session },
    );

    if (!updated) {
      throw new ApiError(404, "User not found");
    }

    return updated;
  },

  async deductInterviewCredits(userId, { session, expectedPlan }) {
    if (!session?.inTransaction()) {
      throw new Error(
        "Interview credit deduction requires an active MongoDB transaction",
      );
    }

    let user = await userRepository.findById(userId, { session });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user = await this.resetDailyIfNeeded(user, { session });
    user = await this.checkSubscriptionExpiry(user, { session });

    if (user.subscription.plan !== expectedPlan) {
      return false;
    }

    const bypassCredits =
      process.env.NODE_ENV === "development" &&
      process.env.BYPASS_CREDITS === "true";

    if (!bypassCredits) {
      await this.canAfford(user, CREDIT_COSTS.INTERVIEW);
    }

    await this.deduct(userId, CREDIT_COSTS.INTERVIEW, { session });
    return true;
  },

  /**
   * Refunds credits if a feature fails mid-way.
   */
  async refund(userId, creditCost) {
    return userRepository.updateById(userId, {
      $inc: {
        "usage.remainingCredits": creditCost,
        "usage.dailyCreditsUsed": -creditCost,
      },
    });
  },

  async refundInterview(userId, { session }) {
    if (!session?.inTransaction()) {
      throw new Error(
        "Interview refunds require an active MongoDB transaction",
      );
    }
    const refunded = await userRepository.updateById(
      userId,
      [
        {
          $set: {
            "usage.remainingCredits": {
              $add: ["$usage.remainingCredits", CREDIT_COSTS.INTERVIEW],
            },
            "usage.dailyCreditsUsed": {
              $max: [
                0,
                {
                  $subtract: [
                    "$usage.dailyCreditsUsed",
                    CREDIT_COSTS.INTERVIEW,
                  ],
                },
              ],
            },
          },
        },
      ],
      { session, updatePipeline: true },
    );
    if (!refunded) {
      throw new ApiError(
        404,
        "User not found while refunding interview credits",
      );
    }
    return CREDIT_COSTS.INTERVIEW;
  },

  /**
   * Applies a Pro subscription after successful Razorpay payment.
   */
  async applyProSubscription(
    userId,
    {
      billingCycle,
      razorpayPaymentId,
      razorpayOrderId,
      creditsGranted,
      validityDays,
    },
    { session } = {},
  ) {
    // Payment activation must happen inside a transaction
    if (!session?.inTransaction()) {
      throw new Error("Pro activation requires an active MongoDB transaction");
    }

    const user = await userRepository.findById(userId, { session });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const now = new Date();

    const hasActivePro =
      user.subscription.plan === "pro" &&
      user.subscription.isActive &&
      user.subscription.expiresAt &&
      new Date(user.subscription.expiresAt) > now;

    // An active Pro user receives an extension.
    // A Free or expired user starts a fresh subscription.
    const baseDate = hasActivePro ? new Date(user.subscription.expiresAt) : now;

    const expiresAt = new Date(
      baseDate.getTime() + validityDays * 24 * 60 * 60 * 1000,
    );

    const totalCredits = hasActivePro
      ? user.usage.totalCredits + creditsGranted
      : creditsGranted;

    const remainingCredits = hasActivePro
      ? user.usage.remainingCredits + creditsGranted
      : creditsGranted;

    const shouldResetDailyUsage = isNewDay(user.usage.lastDailyReset);

    const updated = await userRepository.updateById(
      userId,
      {
        "subscription.plan": "pro",
        "subscription.billingCycle": billingCycle,
        "subscription.isActive": true,

        "subscription.startsAt": hasActivePro
          ? user.subscription.startsAt
          : now,

        "subscription.expiresAt": expiresAt,

        "subscription.razorpayPaymentId": razorpayPaymentId,

        "subscription.razorpayOrderId": razorpayOrderId,

        "usage.totalCredits": totalCredits,

        "usage.remainingCredits": remainingCredits,

        "usage.dailyCreditsUsed": shouldResetDailyUsage
          ? 0
          : user.usage.dailyCreditsUsed,

        "usage.lastDailyReset": shouldResetDailyUsage
          ? now
          : user.usage.lastDailyReset,
      },
      { session },
    );

    if (!updated) {
      throw new ApiError(404, "User not found while activating Pro");
    }

    return updated;
  },

  /**
   * Returns a clean credit summary for the frontend.
   */
  getCreditSummary(user) {
    const dailyLimit = getDailyLimit(user);

    return {
      plan: user.subscription.plan,
      billingCycle: user.subscription.billingCycle,
      isActive: user.subscription.isActive,
      expiresAt: user.subscription.expiresAt,
      totalCredits: user.usage.totalCredits,
      remainingCredits: user.usage.remainingCredits,
      dailyCreditsUsed: user.usage.dailyCreditsUsed,
      dailyLimit,
      dailyRemaining: Math.max(0, dailyLimit - user.usage.dailyCreditsUsed),
      costs: CREDIT_COSTS,
    };
  },
};

export default creditService;
