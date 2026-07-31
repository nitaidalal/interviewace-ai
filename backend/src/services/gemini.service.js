import { ai, GEMINI_MODEL } from "../config/gemini.js";
import {
  buildQuestionGenerationPrompt,
  getCodingConfig,
} from "../utils/prompts/interview.prompt.js";
import {
  buildFeedbackPrompt,
  buildEvaluationPrompt,
} from "../utils/prompts/evaluation.prompt.js";
import ApiError from "../utils/ApiError.js";


const parseJSON = (text) => {
  try {
    const clean = text
      .replace(/```json\n?/gi, "") 
      .replace(/```\n?/gi, "") 
      .trim();
    return JSON.parse(clean);
  } catch {
    throw new ApiError(500, "AI returned invalid response format");
  }
};


const withRetry = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 1500));
      return withRetry(fn, retries - 1);
    }
    throw err;
  }
};


const generate = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.log("Error generating content:", error);
  } 
};


const geminiService = {
  async generateQuestions({ settings, totalQuestions, isPro, resumeText }) {
    const codingConfig = getCodingConfig(settings, isPro);

    const prompt = buildQuestionGenerationPrompt({
      settings,
      totalQuestions,
      codingConfig,
      resumeText: resumeText || null,
    });

    const questions = await withRetry(async () => {
      const text = await generate(prompt);
      return parseJSON(text);
    });

    if (!Array.isArray(questions) || questions.length !== totalQuestions) {
      throw new ApiError(
        500,
        "AI did not return the correct number of questions",
      );
    }

    const { hasCoding, codingTime } = codingConfig;

    const timePerQuestion = {
      easy: 60,
      medium: 90,
      hard: 120,
    }[settings.difficulty];

    return questions.map((q) => ({
      index: q.index,
      content: q.content,
      isCodingQuestion: q.isCodingQuestion ?? false,
      codingLanguage: q.codingLanguage ?? null,
      timeLimitSeconds: q.isCodingQuestion ? codingTime : timePerQuestion,
    }));
  },

  async generateFeedback({
    question,
    candidateAnswer,
    stackContext,
    experience,
    timedOut,
    isCodingQuestion,
  }) {
    const prompt = buildFeedbackPrompt({
      question,
      candidateAnswer,
      stackContext,
      experience,
      timedOut,
      isCodingQuestion,
    });

    try {
      const result = await withRetry(async () => {
        const text = await generate(prompt);
        return parseJSON(text);
      });

      return {
        shortFeedback: result.shortFeedback ?? "Good attempt. Moving on.",
        improvedAnswer: result.improvedAnswer ?? "",
        questionScore: Math.min(10, Math.max(0, result.questionScore ?? 5)),
      };
    } catch {
      return {
        shortFeedback: "AI review unavailable for this answer.",
        improvedAnswer: "",
        questionScore: 0,
      };
    }
  },

  async generateEvaluation({ answers, settings, stackContext, userName }) {
    const prompt = buildEvaluationPrompt({
      answers,
      settings,
      stackContext,
      userName,
    });

    try {
      const result = await withRetry(async () => {
        const text = await generate(prompt);
        return parseJSON(text);
      });

      return {
        categoryScores: {
          communication: result.categoryScores?.communication ?? 0,
          technical: result.categoryScores?.technical ?? 0,
          confidence: result.categoryScores?.confidence ?? 0,
          problemSolving: result.categoryScores?.problemSolving ?? 0,
        },
        strengths: result.strengths ?? [],
        weaknesses: result.weaknesses ?? [],
        suggestions: result.suggestions ?? [],
      };
    } catch {
      return null;
    }
  },

  async healthCheck() {
    try {
      await generate("Say OK in one word");
      return true;
    } catch {
      return false;
    }
  },
};

export default geminiService;
