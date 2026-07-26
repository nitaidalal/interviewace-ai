import { Router } from "express";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  removeAvatar,
  getCredits,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateProfileSchema } from "../utils/validators/user.validator.js";
import { uploadAvatar as uploadAvatarMiddleware } from "../utils/upload.js";

const router = Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", validate(updateProfileSchema), updateProfile);
router.get("/credits", getCredits);
router.post("/avatar", uploadAvatarMiddleware, uploadAvatar);
router.delete("/avatar", removeAvatar);

export default router;
