import interviewRepository from "../repositories/interview.repository.js";
import geminiService from "./gemini.service.js";
import creditService from "./credit.service.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import activityService from "./activity.service.js";
import {
  buildGreeting,
  getCodingConfig,
} from "../utils/prompts/interview.prompt.js";
import { QUESTIONS_PER_PLAN } from "../utils/constants.js";

// ─── Helpers ──────────────────────────────────────────────────────

const getStackContext = (settings) => {
  const {
    mode,
    role,
    framework,
    stack,
    bundle,
    dsaLanguage,
    subjects,
    database,
  } = settings;

  if (mode === "hr") return "HR and Behavioural";

  const map = {
    frontend: framework
      ? `Frontend (${framework})`
      : "Frontend (HTML, CSS, JavaScript)",
    backend: stack
      ? `Backend (${stack.replace(/_/g, " + ")}${database ? " + " + database : ""})`
      : "Backend Development",
    fullstack: `Full Stack (${bundle?.toUpperCase() ?? "MERN"})`,
    dsa: `DSA in ${dsaLanguage ?? "JavaScript"}`,
    core_cs: `Core CS (${subjects?.join(", ") ?? "OS, DBMS, CN, OOPs"})`,
  }; 

  return map[role] ?? "Software Engineering";
};

const calculateFinalScore = (answers) => {
  if (!answers.length) return 0;
  const total = answers.reduce((sum, a) => sum + (a.questionScore || 0), 0);
  return Math.round((total / answers.length) * 10) / 10;
};

const getTimeLimitPerQuestion = (difficulty) =>
  ({
    easy: 60,
    medium: 90,
    hard: 120,
  })[difficulty] ?? 60;

const getCodingTimeLimitSeconds = (difficulty) =>
  ({
    easy: 300,
    medium: 600,
    hard: 900,
  })[difficulty] ?? 300;

  const buildInterviewTitle = (settings) => {
    if (settings.mode === "hr") return "HR / Behavioural Interview";

    const roleMap = {
      frontend: "Frontend Developer",
      backend: "Backend Developer",
      fullstack: "Full Stack Developer",
      dsa: "DSA Interview",
      core_cs: "Core CS Interview",
    };

    const role = roleMap[settings.role] ?? "Technical Interview";

    const stack =
      settings.framework ||
      settings.stack?.replace(/_/g, " + ") ||
      settings.bundle?.toUpperCase() ||
      settings.dsaLanguage ||
      "";

    return stack ? `${role} — ${stack}` : role;
  };

// ─── Interview Service ────────────────────────────────────────────

const interviewService = {
  async startInterview(userId, body) {
    // 1. Get user
    const user = await userRepository.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const isPro = user.subscription?.plan === "pro";

    // 2. Validate mode requirements
    if (body.mode === "technical" && !body.role) {
      throw new ApiError(400, "Role is required for technical interviews");
    }

    // 3. Check Gemini health before deducting credits
    const geminiOk = await geminiService.healthCheck();
    if (!geminiOk) {
      throw new ApiError(
        503,
        "AI service is temporarily unavailable. Please try again.",
      );
    }

    // 4. Determine question count based on plan
    const totalQuestions = isPro
      ? QUESTIONS_PER_PLAN.pro
      : QUESTIONS_PER_PLAN.free;

    const timePerQuestion = getTimeLimitPerQuestion(body.difficulty);
    const estimatedMinutes = isPro ? 20 : 10;

    // 5. Build settings object
    const settings = {
      mode: body.mode,
      difficulty: body.difficulty,
      experience: body.experience,
      totalQuestions,
      estimatedMinutes,
      timePerQuestion,
      role: body.role ?? null,
      framework: body.framework ?? null,
      stack: body.stack ?? null,
      database: body.database ?? null,
      bundle: body.bundle ?? null,
      dsaLanguage: body.dsaLanguage ?? null,
      subjects: body.subjects ?? [],
      addons: body.addons ?? [],
      resumeText: body.resumeText ?? null,
      resumeUsed: !!body.resumeText,
      codingTimeLimitSeconds: getCodingTimeLimitSeconds(body.difficulty),
    };

    // 6. Get coding config
    const codingConfig = getCodingConfig(settings, isPro);
    settings.hasCodingQuestion = codingConfig.hasCoding;
    settings.codingLanguage = codingConfig.codingLanguage ?? null;
    settings.codingQuestionIndices = codingConfig.hasCoding
      ? isPro
        ? [totalQuestions - 1, totalQuestions]
        : [totalQuestions]
      : [];

    // 7. Generate all questions via Gemini
    let questions;
    try {
      questions = await geminiService.generateQuestions({
        settings,
        totalQuestions,
        isPro,
        resumeText: body.resumeText,
      });
    } catch (err) {
      throw new ApiError(
        503,
        "Failed to generate interview questions. Please try again.",
      );
    }

    // 8. Deduct credits
    await creditService.deduct(userId, 20);

    // 9. Build greeting message
    const stackContext = getStackContext(settings);
    const greetingContent = buildGreeting({
      userName: user.name.split(" ")[0],
      mode: body.mode,
      role: body.role,
      stack: stackContext,
      difficulty: body.difficulty,
      totalQuestions,
      timePerQuestion,
    });

    const greetingMessage = {
      role: "ai",
      content: greetingContent,
      messageType: "greeting",
      questionIndex: null,
      timestamp: new Date(),
    };

    // 10. Build first question message
    const firstQuestion = questions[0];
    const firstQuestionMessage = {
      role: "ai",
      content: firstQuestion.content,
      messageType: "question",
      questionIndex: 1,
      timestamp: new Date(),
    };

    // 11. Create session
    const session = await interviewRepository.create({
      user: userId,
      settings,
      questions,
      messages: [greetingMessage, firstQuestionMessage],
      currentQuestionIndex: 1,
      webcamEnabled: body.webcamEnabled ?? false,
    });

    return {
      sessionId: session._id,
      greeting: greetingContent,
      firstQuestion: firstQuestion.content,
      firstQuestionIndex: 1,
      totalQuestions,
      timeLimit: firstQuestion.timeLimitSeconds,
      isCodingQuestion: firstQuestion.isCodingQuestion,
      codingLanguage: firstQuestion.codingLanguage,
      settings,
    };
  },

  async submitAnswer(sessionId, userId, body) {
    // 1. Find active session
    const session = await interviewRepository.findByIdAndUser(
      sessionId,
      userId,
    );
    if (!session) throw new ApiError(404, "Interview session not found");
    if (session.status !== "active") {
      throw new ApiError(400, "This interview session is no longer active");
    }

    const { answer, timedOut, responseTimeSeconds, isCodingAnswer } = body;
    const currentIndex = session.currentQuestionIndex;
    const currentQuestion = session.questions.find(
      (q) => q.index === currentIndex,
    );

    if (!currentQuestion)
      throw new ApiError(400, "Question not found in session");

    const user = await userRepository.findById(userId);
    const stackContext = getStackContext(session.settings);

    // 2. Generate feedback for this answer
    const feedback = await geminiService.generateFeedback({
      question: currentQuestion.content,
      candidateAnswer: answer,
      stackContext,
      experience: session.settings.experience,
      timedOut,
      isCodingQuestion: currentQuestion.isCodingQuestion,
    });

    // 3. Build answer object
    const answerObj = {
      questionIndex: currentIndex,
      questionContent: currentQuestion.content,
      candidateAnswer: answer || "",
      shortFeedback: feedback.shortFeedback,
      improvedAnswer: feedback.improvedAnswer,
      questionScore: feedback.questionScore,
      timedOut,
      responseTimeSeconds,
      isCodingQuestion: currentQuestion.isCodingQuestion,
      codingLanguage: currentQuestion.codingLanguage,
    };

    // 4. Build candidate answer message
    const candidateMessage = {
      role: "candidate",
      content: timedOut ? answer || "(No answer — time ran out)" : answer,
      messageType: "answer",
      questionIndex: currentIndex,
      timedOut,
      responseTimeSeconds,
      timestamp: new Date(),
    };

    // 5. Build AI feedback message
    const feedbackMessage = {
      role: "ai",
      content: feedback.shortFeedback,
      messageType: "feedback",
      questionIndex: currentIndex,
      timestamp: new Date(),
    };

    // 6. Determine if interview is complete
    const isLastQuestion = currentIndex >= session.settings.totalQuestions;
    const nextQuestionIndex = currentIndex + 1;
    const nextQuestion = !isLastQuestion
      ? session.questions.find((q) => q.index === nextQuestionIndex)
      : null;

    // 7. Build next question message if not last
    const updates = {
      $push: {
        messages: { $each: [candidateMessage, feedbackMessage] },
        answers: answerObj,
      },
    };

    if (!isLastQuestion && nextQuestion) {
      updates.$push.messages.$each.push({
        role: "ai",
        content: nextQuestion.content,
        messageType: "question",
        questionIndex: nextQuestionIndex,
        timestamp: new Date(),
      });
      updates.$set = { currentQuestionIndex: nextQuestionIndex };
    }

    await interviewRepository.updateById(sessionId, updates);

    // 8. Return response
    return {
      feedback: feedback.shortFeedback,
      questionScore: feedback.questionScore,
      isLastQuestion,
      nextQuestion: nextQuestion
        ? {
            content: nextQuestion.content,
            index: nextQuestionIndex,
            timeLimit: nextQuestion.timeLimitSeconds,
            isCodingQuestion: nextQuestion.isCodingQuestion,
            codingLanguage: nextQuestion.codingLanguage,
          }
        : null,
    };
  },

  async endInterview(sessionId, userId) {
    const session = await interviewRepository.findByIdAndUser(
      sessionId,
      userId,
    );
    if (!session) throw new ApiError(404, "Interview session not found");

    if (session.status === "completed") {
      return { alreadyCompleted: true, evaluation: session.evaluation };
    }

    const user = await userRepository.findById(userId);
    const stackContext = getStackContext(session.settings);
    const endedAt = new Date();
    const actualDuration = Math.round(
      (endedAt - new Date(session.startedAt)) / 1000,
    );

    // Calculate final score from individual question scores
    const finalScore = calculateFinalScore(session.answers);

    // Generate final evaluation
    const evalResult = await geminiService.generateEvaluation({
      answers: session.answers,
      settings: session.settings,
      stackContext,
      userName: user.name,
    });

    if (!evalResult) {
      // Gemini failed — save as interrupted, refund credits
      await creditService.refund(userId, 20);
      await interviewRepository.markInterrupted(sessionId, {
        endedAt,
        actualDuration,
      });
      throw new ApiError(
        503,
        "AI evaluation failed. Your credits have been refunded. Please try again.",
      );
    }

    const evaluation = {
      finalScore,
      categoryScores: evalResult.categoryScores,
      strengths: evalResult.strengths,
      weaknesses: evalResult.weaknesses,
      suggestions: evalResult.suggestions,
      evaluatedAt: new Date(),
    };

    const completed = await interviewRepository.markCompleted(sessionId, {
      evaluation,
      endedAt,
      actualDuration,
    });

    const interviewTitle = buildInterviewTitle(session.settings);
    activityService
      .createInterviewActivity({
        userId,
        interviewId: sessionId,
        title: interviewTitle,
        score: Math.round(finalScore * 10),
      })
      .catch((err) => {
        console.warn("⚠️  Failed to create interview activity:", err.message);
      });

    return { evaluation: completed.evaluation, sessionId };
  },

  async getHistory(userId, { page, limit }) {
    return interviewRepository.findHistoryByUser(userId, { page, limit });
  },

  async getSessionById(sessionId, userId) {
    const session = await interviewRepository.findFullById(sessionId, userId);
    if (!session) throw new ApiError(404, "Interview session not found");
    return session;
  },

  async abandonSession(sessionId, userId) {
    const session = await interviewRepository.findByIdAndUser(
      sessionId,
      userId,
    );
    if (!session) throw new ApiError(404, "Interview session not found");
    if (session.status !== "active") return session;

    // Partial refund — they used some questions
    const questionsAnswered = session.answers.length;
    const totalQuestions = session.settings.totalQuestions;
    if (questionsAnswered === 0) {
      await creditService.refund(userId, 20);
    }

    return interviewRepository.markAbandoned(sessionId);
  },
};

export default interviewService;
