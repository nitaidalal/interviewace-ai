import cron from "node-cron";
import User from "../models/user.model.js";
import { PLAN_LIMITS } from "../utils/constants.js";

export const startCronJobs = () => {
  // Runs at midnight on the 1st of every month
  cron.schedule("0 0 1 * *", async () => {
    try {
      const result = await User.updateMany(
        { "subscription.plan": "free" },
        {
          $set: {
            "usage.totalCredits": PLAN_LIMITS.free.totalCredits,
            "usage.remainingCredits": PLAN_LIMITS.free.totalCredits,
            "usage.dailyCreditsUsed": 0,
            "usage.lastDailyReset": new Date(),
          },
        },
      );

      console.log(
        `✅ Monthly credit reset: ${result.modifiedCount} free users updated`, //
      );
    } catch (error) {
      console.error("❌ Monthly credit reset failed:", error.message);
    }
  });

  console.log("✅ Cron jobs started");
};
