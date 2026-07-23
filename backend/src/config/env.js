const requiredEnvVars = [
  "MONGODB_URI",
  "JWT_SECRET",
  "GEMINI_API_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "JUDGE0_API_KEY",
  "ADMIN_SEED_EMAIL",
  "ADMIN_SEED_PASSWORD",
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
