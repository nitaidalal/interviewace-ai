import { Router } from "express";
import {
  analyzeResume,
  getHistory,
  getAnalysisById,
} from "../controllers/ats.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { checkCredits } from "../middlewares/creditCheck.middleware.js";
import { uploadResume } from "../utils/upload.js";

const router = Router();

router.use(protect);

router.post(
  "/analyze",
  checkCredits("ATS_ANALYSIS"),
  uploadResume,
  analyzeResume,
);

router.get("/history", getHistory);
router.get("/:id", getAnalysisById);

export default router;
