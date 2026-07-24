import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { COOKIE_OPTIONS } from "../utils/constants.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user, token } = await authService.register({
    name,
    email,
    password,
  });

  res
    .status(201)
    .cookie("accessToken", token, COOKIE_OPTIONS)
    .json(new ApiResponse(201, { user, token }, "User registered successfully"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  res
    .status(200)
    .cookie("accessToken", token, COOKIE_OPTIONS)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

export const getMe = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});