import { Router } from "express";
import { transcribeAudio } from "../controllers/speech.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { speechLimiter } from "../middlewares/rateLimiter.middleware.js";
import { uploadAudio } from "../utils/upload.js";

const router = Router();

router.use(protect);
router.post("/transcribe", speechLimiter, uploadAudio, transcribeAudio);

export default router;
