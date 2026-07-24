import jwt from "jsonwebtoken";

import authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const tokenFromHeader =
    bearerToken && bearerToken.startsWith("Bearer ")
      ? bearerToken.slice(7)
      : null;

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

  const user = await authService.getMe(decoded.id);

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been deactivated");
  }

  req.user = user;
  next();
});