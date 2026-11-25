import "dotenv/config";
import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 0,
  timeout: 60000,
});

export const GROQ_MODEL = "openai/gpt-oss-120b";
