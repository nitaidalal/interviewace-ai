import { PLAN_LIMITS, QUESTIONS_PER_PLAN } from "../constants.js";

export const buildGreeting = ({
  userName,
  mode,
  role,
  stack,
  difficulty,
  totalQuestions,
  timePerQuestion,
}) => {
  const roleDisplay =
    mode === "hr"
      ? "HR / Behavioural"
      : role
        ? role.charAt(0).toUpperCase() + role.slice(1).replace(/_/g, " ")
        : "Technical";

  const stackDisplay = stack
    ? ` focused on ${stack.replace(/_/g, " + ").replace(/\b\w/g, (c) => c.toUpperCase())}`
    : "";

  const timeDisplay =
    timePerQuestion >= 60
      ? `${timePerQuestion} seconds`
      : `${timePerQuestion / 60} minutes`;

  return (
    `Welcome ${userName}! 👋 Today we'll be conducting a ` +
    `${roleDisplay} interview${stackDisplay}. ` +
    `This is a ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty session ` +
    `with ${totalQuestions} questions. ` +
    `You'll have ${timeDisplay} per question. ` +
    `Take a breath, stay confident, and let's begin! 🚀`
  );
};


const buildStackContext = (settings) => {
  const {
    mode,
    role,
    framework,
    stack,
    bundle,
    dsaLanguage,
    subjects,
    addons,
    database,
  } = settings;

  if (mode === "hr") return "HR and Behavioural interview";

  if (role === "frontend") {
    const fw = framework
      ? framework.charAt(0).toUpperCase() + framework.slice(1)
      : "Vanilla JavaScript";
    const extra = addons?.length ? ` with ${addons.join(", ")}` : "";
    return `Frontend Developer (${fw}${extra}, HTML, CSS, JavaScript)`;
  }

  if (role === "backend") {
    const st = stack?.replace(/_/g, " + ") ?? "Node.js";
    const db = database ? ` with ${database.toUpperCase()}` : "";
    return `Backend Developer (${st}${db})`;
  }

  if (role === "fullstack") {
    return `Full Stack Developer (${bundle?.toUpperCase() ?? "MERN"})`;
  }

  if (role === "dsa") {
    return `Data Structures & Algorithms in ${dsaLanguage ?? "JavaScript"}`;
  }

  if (role === "core_cs") {
    return `Core CS Subjects: ${subjects?.join(", ") ?? "OS, DBMS, CN, OOPs"}`;
  }

  return "Software Engineering";
};


const CODING_TIMES = {
  easy: 300, // 5 min
  medium: 600, // 10 min
  hard: 900, // 15 min
};

const CODING_LANGUAGES = {
  // Backend
  node_express: "JavaScript",
  node_nest: "JavaScript",
  node_fastify: "JavaScript",
  springboot: "Java",
  fastapi: "Python",
  django: "Python",

  // Fullstack
  mern: "JavaScript",
  mean: "JavaScript",
  pern: "JavaScript",
  next_node_pg: "JavaScript",
  python_fullstack: "Python",
  java_fullstack: "Java",

  // DSA
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",

  // Web dev (no framework = vanilla JS)
  web: "JavaScript",

  // Core CS
  core_cs: "JavaScript",
};

// Stacks with NO coding question
const NO_CODING_STACKS = [
  "react",
  "nextjs",
  "vue",
  "nuxtjs",
  "angular",
  "svelte",
  "laravel",
  "golang",
];

export const getCodingConfig = (settings, isPro) => {
  const { role, framework, stack, bundle, dsaLanguage, difficulty } = settings;

  // HR never gets coding
  if (settings.mode === "hr") {
    return { hasCoding: false, codingLanguage: null, codingTime: 0 };
  }

  // Check if stack supports coding
  const stackKey = framework || stack || bundle || dsaLanguage || role;
  if (NO_CODING_STACKS.includes(stackKey)) {
    return { hasCoding: false, codingLanguage: null, codingTime: 0 };
  }

  const codingLanguage = CODING_LANGUAGES[stackKey] ?? "JavaScript";
  const codingTime = CODING_TIMES[difficulty];

  return {
    hasCoding: true,
    codingLanguage,
    codingTime,
    codingCount: isPro ? 2 : 1,
  };
};


export const buildQuestionGenerationPrompt = ({
  settings,
  totalQuestions,
  codingConfig,
  resumeText,
}) => {
  const stackContext = buildStackContext(settings);
  const { difficulty, experience } = settings;
  const { hasCoding, codingLanguage, codingCount, codingTime } = codingConfig;

  const regularCount = totalQuestions - (hasCoding ? codingCount : 0);
  const codingMinutes = codingTime / 60;

  const timePerQ = {
    easy: 60,
    medium: 90,
    hard: 120,
  }[difficulty];

  const resumeContext = resumeText
    ? `\nCandidate Resume:\n${resumeText}\n
         Use the resume to personalize questions about their projects and experience.`
    : "";

  return `You are a senior technical interviewer conducting a ${stackContext} interview.
  
  Candidate Experience: ${experience.years} years (${experience.level})
  Difficulty: ${difficulty}
  ${resumeContext}
  
  Generate EXACTLY ${totalQuestions} interview questions as a JSON array.
  
  Requirements:
  - Questions ${1} to ${regularCount}: Regular interview questions
    * Each must be answerable within ${timePerQ} seconds verbally
    * Ask one clear focused question per entry
    * Vary question types: conceptual, scenario-based, experience-based
    * Calibrate depth for ${experience.level} level candidate
    * Difficulty must match: ${difficulty}
  
  ${
    hasCoding
      ? `
  - Question${codingCount > 1 ? `s ${regularCount + 1} and ${totalQuestions}` : ` ${totalQuestions}`}: Coding question${codingCount > 1 ? "s" : ""}
    * Language: ${codingLanguage}
    * Must be completable in ${codingMinutes} minutes
    * Write a single-file executable program
    * No framework-specific imports or syntax
    * Real interview-style problem (not competitive programming)
    * Must be directly relevant to the ${stackContext} stack
    * Do NOT ask time/space complexity or Big O notation
  `
      : ""
  }
  
  Return ONLY this JSON — no markdown, no explanation, no extra text:
  [
    {
      "index": 1,
      "content": "question text here",
      "isCodingQuestion": false,
      "codingLanguage": null
    },
    ${
      hasCoding
        ? `
    {
      "index": ${totalQuestions},
      "content": "coding problem description here",
      "isCodingQuestion": true,
      "codingLanguage": "${codingLanguage}"
    }`
        : ""
    }
  ]
  
  IMPORTANT:
  - Return valid JSON array only
  - Exactly ${totalQuestions} objects
  - No duplicate questions
  - No generic questions — all must be specific to ${stackContext}`;
};
