import "dotenv/config";
import mongoose from "mongoose";
import User from "../src/models/user.model.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const existing = await User.findOne({
      email: process.env.ADMIN_SEED_EMAIL,
    });

    if (existing) {
      if (existing.role === "admin") {
        console.log("ℹ️  Admin already exists. Skipping.");
      } else {
        existing.role = "admin";
        await existing.save();
        console.log("✅ Existing user promoted to admin.");
      }
    } else {
      await User.create({
        name: "Admin",
        email: process.env.ADMIN_SEED_EMAIL,
        passwordHash: process.env.ADMIN_SEED_PASSWORD,
        role: "admin",
      });
      console.log("✅ Admin user created successfully.");
      console.log(`   Email: ${process.env.ADMIN_SEED_EMAIL}`);
    }
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  }
};

seedAdmin();
