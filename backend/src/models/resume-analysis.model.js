import mongoose from 'mongoose';

const sectionScoreSchema = new mongoose.Schema({
    score:{
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    feedback:{
        type: String,
        default: ''
    }
},{ _id: false });

const resumeAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  extractedText: {
    type: String,
    required: true,
    select: false, // excluded from queries by default
  },

  atsScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },

  atsReport: {
    structure: { type: sectionScoreSchema, default: () => ({}) },
    readability: { type: sectionScoreSchema, default: () => ({}) },
    grammar: { type: sectionScoreSchema, default: () => ({}) },
    professionalLanguage: { type: sectionScoreSchema, default: () => ({}) },
    skillsSection: { type: sectionScoreSchema, default: () => ({}) },
    projectsSection: { type: sectionScoreSchema, default: () => ({}) },
    experienceSection: { type: sectionScoreSchema, default: () => ({}) },
    educationSection: { type: sectionScoreSchema, default: () => ({}) },
    formatting: { type: sectionScoreSchema, default: () => ({}) },
    actionVerbs: { type: sectionScoreSchema, default: () => ({}) },
    bulletImpact: { type: sectionScoreSchema, default: () => ({}) },
    keywordOptimization: { type: sectionScoreSchema, default: () => ({}) },
    missingInfo: { type: sectionScoreSchema, default: () => ({}) },
    overallQuality: { type: sectionScoreSchema, default: () => ({}) },
  },

  strengths: { type: [String], default: [] },
  improvements: { type: [String], default: [] },
  missingKeywords: { type: [String], default: [] },

  analyzedAt: { type: Date, default: Date.now },
},{timestamps: true});

resumeAnalysisSchema.index({ user: 1, analyzedAt: -1 });
const ResumeAnalysis = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
export default ResumeAnalysis;
