import jwt from "jsonwebtoken";

import authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRepository from "../repositories/user.repository.js";

export const protect = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const tokenFromHeader = bearerToken && bearerToken.split(" ")[1];
  const token = req.cookies?.accessToken || tokenFromHeader;

  if (!token) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  const user = await userRepository.findById(decoded.id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  req.user = user;
  next();
});