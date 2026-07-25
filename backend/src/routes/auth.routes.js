import { Router } from "express";

import { getMe, login, register,logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { registerSchema, loginSchema } from "../utils/validators/auth.validator.js";
const router = Router();

router.post("/register", authLimiter, validate(registerSchema), register);

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", logout);

router.get("/me", protect, getMe);

export default router;