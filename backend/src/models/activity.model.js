import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["interview", "resume", "programming"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      default: null,
    },
    language: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Primary query index — user's activities sorted by newest
activitySchema.index({ user: 1, createdAt: -1 });

// Filter by type index
activitySchema.index({ user: 1, type: 1, createdAt: -1 });

// Prevent duplicate activity records for same reference
activitySchema.index({ referenceId: 1, type: 1 }, { unique: true });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
