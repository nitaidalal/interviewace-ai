import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import interviewRoutes from "./interview.routes.js";
import atsRoutes from "./ats.routes.js";
import activityRoutes from "./activity.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/interviews", interviewRoutes);
router.use("/ats", atsRoutes);
router.use("/activities", activityRoutes);

export default router;