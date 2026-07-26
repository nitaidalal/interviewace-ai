import userRepository from "../repositories/user.repository.js";
import creditService from "./credit.service.js";
import ApiError from "../utils/ApiError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
} from "../utils/cloudinaryHelper.js";
import { EXPERIENCE_MAP } from "../utils/constants.js";

/**
 * Maps years of experience to a level string
 */
const mapYearsToLevel = (years) => {
  if (years === 0) return "fresher";
  const match = EXPERIENCE_MAP.find(
    (e) => years >= e.minYears && years <= e.maxYears,
  );
  return match?.level ?? "fresher";
};

const userService = {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  },

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (data.experience?.years !== undefined) {
      data.experience.level = mapYearsToLevel(data.experience.years);
    }

    const updated = await userRepository.updateById(userId, data);
    return updated;
  },

  async uploadAvatar(userId, file) {
    if (!file) throw new ApiError(400, "No image file provided");

    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (user.avatar) {
      const oldPublicId = extractPublicId(user.avatar);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId).catch(() => {
          console.warn("⚠️  Failed to delete old avatar from Cloudinary");
        });
      }
    }

    const result = await uploadToCloudinary(
      file.buffer,
      "aceinterviewai/avatars",
      `user_${userId}`,
    );

    const updated = await userRepository.updateAvatar(
      userId,
      result.secure_url,
    );
    return updated;
  },

  async removeAvatar(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    if (!user.avatar) throw new ApiError(400, "No avatar to remove");

    const publicId = extractPublicId(user.avatar);
    if (publicId) {
      await deleteFromCloudinary(publicId).catch(() => {
        console.warn("⚠️  Failed to delete avatar from Cloudinary");
      });
    }

    const updated = await userRepository.removeAvatar(userId);
    return updated;
  },

  async getCredits(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Check expiry and reset daily if needed before returning
    const refreshed = await creditService.checkSubscriptionExpiry(user);
    const final = await creditService.resetDailyIfNeeded(refreshed);

    return creditService.getCreditSummary(final);
  },
};

export default userService;
