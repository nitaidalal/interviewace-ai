import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import speechService from "../services/speech.service.js";

export const transcribeAudio = asyncHandler(async (req, res) => {
  const text = await speechService.transcribe(req.file);
  res
    .status(200)
    .json(new ApiResponse(200, { text }, "Audio transcribed successfully"));
});
