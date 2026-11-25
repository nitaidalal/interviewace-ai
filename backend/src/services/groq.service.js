import { generateAI } from "../utils/generateAI.js";
import ApiError from "../utils/ApiError.js";

import {
  buildQuestionGenerationPrompt,
  getCodingConfig,
} from "../utils/prompts/interview.prompt.js";

import {
  buildFeedbackPrompt,
  buildEvaluationPrompt,
} from "../utils/prompts/evaluation.prompt.js";

const validScore = (value) =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value >= 0 &&
  value <= 10;

const groqService = {
  async generateQuestions({ settings, totalQuestions, isPro, resumeText }) {
    const codingConfig = getCodingConfig(settings, isPro);

    const prompt = buildQuestionGenerationPrompt({
      settings,
      totalQuestions,
      codingConfig,
      resumeText: resumeText || null,
      responseFormat: "object",
    });

    const result = await generateAI(prompt, {
      reasoningEffort: "low",
      maxTokens: 3000,
      temperature: 0.6,
      feature: "questions",
    });

    const questions = result?.questions;

    if (!Array.isArray(questions) || questions.length !== totalQuestions) {
      throw new ApiError(502, "AI returned an incorrect number of questions.");
    }

    const codingCount = codingConfig.hasCoding ? codingConfig.codingCount : 0;

    const regularCount = totalQuestions - codingCount;
    const seen = new Set();

    return questions.map((q, i) => {
      const shouldBeCoding = i >= regularCount;

      if (
        typeof q.content !== "string" ||
        !q.content.trim() ||
        q.isCodingQuestion !== shouldBeCoding ||
        (shouldBeCoding && q.codingLanguage !== codingConfig.codingLanguage)
      ) {
        throw new ApiError(502, "Invalid AI question.");
      }

      const normalized = q.content.trim().toLowerCase();

      if (seen.has(normalized)) {
        throw new ApiError(502, "Duplicate AI question.");
      }

      seen.add(normalized);

      return {
        index: i + 1,
        content: q.content,
        isCodingQuestion: shouldBeCoding,
        codingLanguage: shouldBeCoding ? codingConfig.codingLanguage : null,
        timeLimitSeconds: shouldBeCoding
          ? codingConfig.codingTime
          : settings.timePerQuestion,
      };
    });
  },

  async generateFeedback({
    question,
    candidateAnswer,
    stackContext,
    experience,
    timedOut,
    isCodingQuestion,
    expectedAnswer,
    keyConcepts,
  }) {
    // No AI call for an unanswered question.
    if (!candidateAnswer?.trim()) {
      return {
        shortFeedback: timedOut
          ? "Time ran out before an answer was submitted."
          : "No answer was submitted.",
        improvedAnswer: expectedAnswer || "",
        questionScore: 0,
      };
    }

    const prompt = buildFeedbackPrompt({
      question,
      candidateAnswer,
      stackContext,
      experience,
      timedOut,
      isCodingQuestion,
      expectedAnswer,
      keyConcepts,
    });

    const result = await generateAI(prompt, {
      reasoningEffort: "medium",
      maxTokens: 1500,
      temperature: 0.2,
      feature: "feedback",
    });

    if (
      typeof result.shortFeedback !== "string" ||
      typeof result.improvedAnswer !== "string" ||
      !validScore(result.questionScore)
    ) {
      throw new ApiError(502, "Invalid AI feedback.");
    }

    return {
      shortFeedback: result.shortFeedback,
      improvedAnswer: result.improvedAnswer,
      questionScore: result.questionScore,
    };
  },

  async generateEvaluation({ answers, settings, stackContext, userName }) {
    const prompt = buildEvaluationPrompt({
      answers,
      settings,
      stackContext,
      userName,
    });

    const result = await generateAI(prompt, {
      reasoningEffort: "medium",
      maxTokens: 2000,
      temperature: 0.2,
      feature: "final-evaluation",
    });

    const categories = [
      "communication",
      "technical",
      "confidence",
      "problemSolving",
    ];

    if (
      !categories.every((key) => validScore(result.categoryScores?.[key])) ||
      !["strengths", "weaknesses", "suggestions"].every(
        (key) =>
          Array.isArray(result[key]) &&
          result[key].every((item) => typeof item === "string"),
      )
    ) {
      throw new ApiError(502, "Invalid AI evaluation.");
    }

    return {
      categoryScores: result.categoryScores,
      strengths: result.strengths,
      weaknesses: result.weaknesses,
      suggestions: result.suggestions,
    };
  },
};

export default groqService;
