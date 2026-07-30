import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    content: { type: String, required: true },
    isCodingQuestion: { type: Boolean, default: false },
    codingLanguage: { type: String, default: null },
    timeLimitSeconds: { type: Number, required: true },
  },
  { _id: false }
)

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ['ai', 'candidate'], required: true },
    content: { type: String, required: true },
    messageType: {
      type: String,
      enum: ['greeting', 'question', 'answer', 'feedback'],
      required: true,
    },
    questionIndex: { type: Number, default: null },
    timedOut: { type: Boolean, default: false },
    responseTimeSeconds: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
)

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    questionContent: { type: String, required: true },
    candidateAnswer: { type: String, default: '' },
    shortFeedback: { type: String, default: '' },
    improvedAnswer: { type: String, default: '' },
    questionScore: { type: Number, default: 0 },
    timedOut: { type: Boolean, default: false },
    responseTimeSeconds: { type: Number, default: 0 },
    isCodingQuestion: { type: Boolean, default: false },
    codingLanguage: { type: String, default: null },
  },
  { _id: false }
)

const categoryScoresSchema = new mongoose.Schema(
  {
    communication: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    problemSolving: { type: Number, default: 0 },
  },
  { _id: false }
)

const evaluationSchema = new mongoose.Schema(
  {
    finalScore: { type: Number, default: 0 },
    categoryScores: { type: categoryScoresSchema, default: () => ({}) },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestions: { type: [String], default: [] },
    evaluatedAt: { type: Date, default: null },
  },
  { _id: false }
)

const settingsSchema = new mongoose.Schema(
  {
    // Common
    mode: { type: String, enum: ['hr', 'technical'], required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      required: true,
    },
    experience: {
      years: { type: Number, default: 0 },
      level: { type: String, default: 'fresher' },
    },
    totalQuestions: { type: Number, required: true },
    estimatedMinutes: { type: Number, required: true },
    timePerQuestion: { type: Number, required: true },

    // Technical specific
    role: { type: String, default: null },
    framework: { type: String, default: null },
    stack: { type: String, default: null },
    database: { type: String, default: null },
    bundle: { type: String, default: null },
    dsaLanguage: { type: String, default: null },
    subjects: { type: [String], default: [] },
    addons: { type: [String], default: [] },

    // Coding
    hasCodingQuestion: { type: Boolean, default: false },
    codingLanguage: { type: String, default: null },
    codingQuestionIndices: { type: [Number], default: [] },
    codingTimeLimitSeconds: { type: Number, default: 300 },

    // Resume
    resumeText: { type: String, default: null },
    resumeUsed: { type: Boolean, default: false },
  },
  { _id: false }
)

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: { type: settingsSchema, required: true },
    questions: { type: [questionSchema], default: [] },
    messages: { type: [messageSchema], default: [] },
    answers: { type: [answerSchema], default: [] },
    currentQuestionIndex: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'completed', 'interrupted', 'abandoned'],
      default: 'active',
    },
    webcamEnabled: { type: Boolean, default: false },
    evaluation: { type: evaluationSchema, default: () => ({}) },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    actualDuration: { type: Number, default: null },
  },
  { timestamps: true }
)

interviewSessionSchema.index({ user: 1, startedAt: -1 })
interviewSessionSchema.index({ user: 1, status: 1 })

const InterviewSession = mongoose.model('InterviewSession', interviewSessionSchema)

export default InterviewSession