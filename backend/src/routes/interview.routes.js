import { Router } from "express";
import {
  startInterview,
  submitAnswer,
  endInterview,
  getHistory,
  getSessionById,
  abandonInterview,
} from "../controllers/interview.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { checkCredits } from "../middlewares/creditCheck.middleware.js";
import {
  startInterviewSchema,
  submitAnswerSchema,
} from "../utils/validators/interview.validator.js";

const router = Router();

router.use(protect);

router.post(
  "/start",
  checkCredits("INTERVIEW"),
  validate(startInterviewSchema),
  startInterview,
);

router.post("/:id/message", validate(submitAnswerSchema), submitAnswer);

router.post("/:id/end", endInterview);
router.post("/:id/abandon", abandonInterview);
router.get("/history", getHistory);
router.get("/:id", getSessionById);

export default router;
