import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import atsService from "../services/ats.service.js";

export const analyzeResume = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const file = req.file;
  const analysis = await atsService.analyzeResume(userId, file);
  res
    .status(201)
    .json(new ApiResponse(201, { analysis }, "Resume analyzed successfully"));
});

export const getHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const result = await atsService.getHistory(userId, { page, limit });
  res
    .status(200)
    .json(new ApiResponse(200, result, "History fetched successfully"));
});

export const getAnalysisById = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const analysisId = req.params.id;
    const analysis = await atsService.getAnalysisById(analysisId, userId);
    res
    .status(200)
    .json(new ApiResponse(200, { analysis }, "Analysis fetched successfully"));
});