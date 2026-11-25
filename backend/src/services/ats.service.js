import { PDFParse } from "pdf-parse";
import ApiError  from '../utils/ApiError.js';
import { generateAI } from '../utils/generateAI.js';
import atsRepository from '../repositories/ats.repository.js';
import creditService from './credit.service.js';
import { buildATSPrompt } from '../utils/prompts/ats.prompt.js';
import {CREDIT_COSTS} from '../utils/constants.js';
import activityService from "./activity.service.js";

const atsService = {
    async analyzeResume(userId, file) {
      if (!file) {
        throw new ApiError(400, "No file provided.");
      }
      if (file.mimetype !== "application/pdf") {
        throw new ApiError(
          400,
          "Invalid file type. Only PDF files are accepted.",
        );
      }
      // 1. Extract text from PDF buffer
      let extractedText;
      try {
        const parser = new PDFParse({ data: file.buffer });
        const result = await parser.getText();
        extractedText = result.text?.trim();
        await parser.destroy();
      } catch (error) {
        throw new ApiError(400, "Error extracting text from PDF");
      }

      if (!extractedText || extractedText.length < 50) {
        throw new ApiError(
          400,
          "The PDF appears to be empty or contains only images. Please upload a text-based PDF.",
        );
      }

      let trucatedText = extractedText.slice(0, 8000);


      // 2. Call Groq for analysis
      const prompt = buildATSPrompt(trucatedText);
      const result = await generateAI(prompt, {
        reasoningEffort: "low",
        maxTokens: 3000,
        temperature: 0.3,
        feature: "ats-analysis",
      });


      // 3. Validate result shape
      if (
        !result ||
        typeof result.overallScore !== "number" ||
        !Number.isFinite(result.overallScore) ||
        !result.sections ||
        typeof result.sections !== "object" ||
        Array.isArray(result.sections)
      ) {
        throw new ApiError(
          500,
          "AI returned an incomplete analysis. Please try again.",
        );
      }

      // 4. Deduct credits
      await creditService.deduct(userId, CREDIT_COSTS.ATS_ANALYSIS);

      // 5. Save to DB
      const analysis = await atsRepository.create({
        user: userId,
        resumeText: trucatedText,
        extractedText: extractedText,
        atsScore: Math.min(100, Math.max(0, result.overallScore)),
        atsReport: result.sections,
        strengths: result.strengths ?? [],
        improvements: result.improvements ?? [],
        missingKeywords: result.missingKeywords ?? [],
      });

      activityService
        .createResumeActivity({
          userId,
          resumeId: analysis._id,
          score: analysis.atsScore,
        })
        .catch((err) => {
          console.warn("⚠️  Failed to create resume activity:", err.message);
        });
      return analysis;
    },
    async getHistory(userId, { page = 1, limit = 10 }) {
      return atsRepository.findHistoryByUser(userId, { page, limit });
    },

    async getAnalysisById(id, userId) {
      const analysis = await atsRepository.findById(id, userId);
        if (!analysis) {
            throw new ApiError(404, "Analysis not found");
        }
        return analysis;
    }
}

export default atsService;
