import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .optional(),

  education: z
    .string()
    .max(100, "Education cannot exceed 100 characters")
    .trim()
    .optional(),

  experience: z
    .object({
      years: z
        .number({ invalid_type_error: "Years must be a number" })
        .min(0, "Years cannot be negative")
        .max(50, "Years cannot exceed 50"),
      level: z.enum(["fresher", "junior", "mid", "senior", "lead"]),
    })
    .optional(),

  preferredLanguage: z
    .string()
    .max(30, "Language cannot exceed 30 characters")
    .trim()
    .optional(),

  preferredStack: z
    .array(z.string().trim())
    .max(10, "Cannot add more than 10 stack items")
    .optional(),
});
