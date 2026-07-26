import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { COOKIE_OPTIONS } from "../utils/constants.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token,role } = await authService.register({
    name,
    email,
    password,
  });

  res
    .status(201)
    .cookie("accessToken", token, COOKIE_OPTIONS)
    .json(new ApiResponse(201, { user, token }, `Registration successful. Role: ${role}`));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  res
    .status(200)
    .cookie("accessToken", token, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("accessToken", COOKIE_OPTIONS)
    .json(new ApiResponse(200, null, "Logout successful"));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(
      new ApiResponse(200, { user: req.user }, "Current user fetched successfully"),
    );
});