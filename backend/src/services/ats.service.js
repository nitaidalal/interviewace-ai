import { PDFParse } from "pdf-parse";
import ApiError  from '../utils/ApiError.js';
import { ai, GEMINI_MODEL } from '../config/gemini.js';
import atsRepository from '../repositories/ats.repository.js';
import creditService from './credit.service.js';
import { buildATSPrompt } from '../utils/prompts/ats.prompt.js';
import {CREDIT_COSTS} from '../utils/constants.js';

const parseJSON = (text) => {
    try {
        const clean = text.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();
        return JSON.parse(clean);
    } catch (error) {
        throw new ApiError(500, "Invalid JSON in response");
    }
}


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


      // 2. Call Gemini for analysis
      const prompt = buildATSPrompt(trucatedText);
      let result;
      try {
        const response = await ai.models.generateContent({
          model: GEMINI_MODEL,
          contents: prompt,
        });
        result = parseJSON(response.text);
      } catch (error) {
        console.error("ATS Gemini error:", {
          name: error.name,
          message: error.message,
          stack: error.stack,
          code: error.code,
          status: error.status,
          response: error.response,
        });
        if (error instanceof ApiError) throw error;
        throw new ApiError(
          503,
          "AI analysis is temporarily unavailable. Please try again.",
        );
      }


      // 3. Validate result shape
      if (!result.overallScore || !result.sections) {
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