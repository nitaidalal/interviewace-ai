import { z } from "zod";

export const startInterviewSchema = z.object({
  mode: z.enum(["hr", "technical"], {
    required_error: "Interview mode is required",
  }),

  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Difficulty is required",
  }),

  experience: z.object({
    years: z.number().min(0).max(50),
    level: z.enum(["fresher", "junior", "mid", "senior", "lead"]),
  }),

  // Technical fields — all optional, validated in service
  role: z
    .enum(["frontend", "backend", "fullstack", "dsa", "core_cs"])
    .optional()
    .nullable(),

  framework: z.string().optional().nullable(),
  stack: z.string().optional().nullable(),
  database: z.string().optional().nullable(),
  bundle: z.string().optional().nullable(),
  dsaLanguage: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional().default([]),
  addons: z.array(z.string()).optional().default([]),

  webcamEnabled: z.boolean().optional().default(false),

  // Resume — optional
  resumeText: z.string().max(10000).optional().nullable(),
});

export const submitAnswerSchema = z.object({
  answer: z.string().max(5000).default(""),
  timedOut: z.boolean().default(false),
  responseTimeSeconds: z.number().min(0).default(0),
  isCodingAnswer: z.boolean().default(false),
});
