import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const usageSchema = new mongoose.Schema(
  {
    totalCredits: { type: Number, default: 100 },
    remainingCredits: { type: Number, default: 100 },
    dailyCreditsUsed: { type: Number, default: 0 },
    lastDailyReset: { type: Date, default: Date.now },
  },
  { _id: false }
)

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', '6months', null],
      default: null,
    },
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
  },
  { _id: false }
)

const experienceSchema = new mongoose.Schema(
  {
    years: { type: Number, default: 0, min: 0 ,max:80},
    level: {
      type: String,
      enum: ['fresher', 'junior', 'mid', 'senior', 'lead'],
      default: 'fresher',
    },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['candidate', 'admin'],
      default: 'candidate',
    },
    avatar: {
      type: String,
      default: null,
    },
    education: {
      type: String,
      trim: true,
      default: null,
    },
    experience: {
      type: experienceSchema,
      default: () => ({}),
    },
    preferredLanguage: {
      type: String,
      default: 'English',
    },
    preferredStack: {
      type: [String],
      default: [],
    },
    subscription: {
      type: subscriptionSchema,
      default: () => ({}),
    },
    usage: {
      type: usageSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// Strip password from all responses
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.password
  return obj
}

const User = mongoose.model('User', userSchema)

export default User