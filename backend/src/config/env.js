const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GROQ_API_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "RAZORPAY_WEBHOOK_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "ADMIN_SEED_EMAIL",
  "ADMIN_SEED_PASSWORD",
  "DEEPGRAM_API_KEY",
];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("🛑 Server startup aborted. Fix your .env file.");
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};
