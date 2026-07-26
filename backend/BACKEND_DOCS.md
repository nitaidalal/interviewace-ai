# AceInterviewAI — Backend Progress

---

## Tech Stack

- Node.js + Express.js (ES Modules)
- MongoDB + Mongoose
- JWT (httpOnly cookies, 7-day expiry)
- Zod (validation)
- bcryptjs (password hashing)
- Cloudinary (avatar/image storage)
- Razorpay (payments)
- Google Gemini API (AI)
- Judge0 via RapidAPI (code execution)
- node-cron (scheduled jobs)
- Multer (file uploads)
- pdf-parse (resume extraction)
- Helmet + CORS + express-rate-limit (security)

---

## Architecture Rules

```
Request → Route → Middleware → Controller → Service → Repository → DB
```

- Controllers     → only req/res handling, no business logic
- Services        → all business logic, no DB queries
- Repositories    → all DB queries, no logic
- Middlewares     → auth, role, validation, credit checks
- Utils/Prompts   → all Gemini prompts centralized here
- ApiResponse     → standard response wrapper on every endpoint
- ApiError        → custom error class, caught by global error handler
- asyncHandler    → wraps every controller, no try/catch repetition

---

## Phase Order

```
Phase 1  ✅  Scaffold + Auth
Phase 2  ⏳  User Profile
Phase 3  ⏳  AI Interview
Phase 4  ⏳  ATS Resume Analyzer
Phase 5  ⏳  Programming Assessment
Phase 6  ⏳  Payments (Razorpay)
Phase 7  ⏳  Admin Panel
```

> Payments come after all core features are built.
> This way credit checks are plugged into already-working features
> and the full payment → credit deduction flow can be tested end to end.

---

## Phase 1 — Scaffold + Auth ✅

### Files Created

```
backend/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── creditCheck.middleware.js
│   │   │   ├── errorHandler.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   ├── role.middleware.js
│   │   │   └── validate.middleware.js
│   │   └── routes/
│   │       └── v1/
│   │           ├── auth.routes.js
│   │           └── index.js
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── db.js
│   │   ├── env.js
│   │   └── razorpay.js
│   ├── models/
│   │   └── User.js
│   ├── repositories/
│   │   └── user.repository.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── credit.service.js
│   │   └── cron.service.js
│   ├── utils/
│   │   ├── validators/
│   │   │   └── auth.validator.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── constants.js
│   ├── app.js
│   └── server.js
├── seeds/
│   └── adminSeed.js
├── .env.example
├── nodemon.json
└── package.json
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/auth/register | ❌ | Register new user |
| POST | /api/v1/auth/login | ❌ | Login user |
| POST | /api/v1/auth/logout | ❌ | Logout user |
| GET | /api/v1/auth/me | ✅ | Get current user |

### Key Decisions Made

- JWT stored in httpOnly cookie (not localStorage)
- 7-day token expiry
- bcrypt rounds: 12
- Auto-promote to admin if email matches ADMIN_SEED_EMAIL env var
- Rate limiter: 100 req/15min global, 10 req/15min on auth routes
- Zod v4 used — `result.error.issues` (not `.errors`)
- validate middleware supports `source` param: body / params / query
- Password never returned in any response (toJSON override on User model)

### User Schema — Key Fields

```js
// Subscription
subscription: {
  plan: 'free' | 'pro',
  billingCycle: 'monthly' | '6months' | null,
  isActive: Boolean,
  startsAt: Date,
  expiresAt: Date | null,        // null = never expires (free)
  razorpayPaymentId: String | null,
  razorpayOrderId: String | null,
}

// Usage (credit wallet)
usage: {
  totalCredits: Number,          // free: 100, pro monthly: 1500, pro 6mo: 9000
  remainingCredits: Number,
  dailyCreditsUsed: Number,
  lastDailyReset: Date,
}
```

### Credit System

| Plan | Total Credits | Daily Limit |
|------|--------------|-------------|
| Free | 100 | 20 |
| Pro Monthly | 1500 | 100 |
| Pro 6 Months | 9000 | 100 |

| Feature | Credit Cost |
|---------|------------|
| AI Interview | 20 |
| ATS Analysis | 10 |
| Coding Submission | 2 |

### Services Built

**auth.service.js**
- register() — creates user, auto-promotes admin by env email
- login() — validates credentials, returns JWT
- getMe() — fetches user by ID

**credit.service.js**
- resetDailyIfNeeded() — resets dailyCreditsUsed if new calendar day
- checkSubscriptionExpiry() — downgrades expired Pro to free
- canAfford() — throws ApiError if insufficient total or daily credits
- deduct() — deducts credits after successful feature use
- refund() — refunds credits if feature fails mid-way
- applyProSubscription() — activates Pro after Razorpay payment
- getCreditSummary() — returns clean credit info for frontend

**cron.service.js**
- Runs midnight on 1st of every month
- Resets free users: totalCredits=100, remainingCredits=100, dailyCreditsUsed=0

### Middlewares Built

**auth.middleware.js** — protect()
- Reads JWT from httpOnly cookie
- Attaches user to req.user
- Throws 401 if missing/invalid/expired

**role.middleware.js** — restrictTo(...roles)
- Checks req.user.role against allowed roles
- Throws 403 if not permitted

**validate.middleware.js** — validate(schema, source)
- Validates req[source] against Zod schema
- Returns 422 with field-level errors
- source defaults to 'body', supports 'params' and 'query'

**rateLimiter.middleware.js**
- globalLimiter: 100 req / 15 min
- authLimiter: 10 req / 15 min (applied to register + login)

**errorHandler.middleware.js**
- Catches all errors passed to next()
- Handles: Mongoose duplicate key, ValidationError, CastError
- Returns stack trace in development only

**creditCheck.middleware.js** — checkCredits(feature)
- Factory middleware for credit-consuming routes
- Runs: resetDailyIfNeeded → checkSubscriptionExpiry → canAfford
- Attaches req.creditCost for controller to deduct after success
- Usage: router.post('/start', protect, checkCredits('INTERVIEW'), controller)

---

## Phase 2 — User Profile ⏳

### Planned Files

```
backend/src/
├── api/
│   ├── controllers/
│   │   └── user.controller.js
│   └── routes/v1/
│       └── user.routes.js
├── services/
│   └── user.service.js
├── utils/
│   ├── validators/
│   │   └── user.validator.js
│   └── upload.js               ← multer config (memory storage)
```

### Planned Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/users/profile | ✅ | Get current user profile |
| PUT | /api/v1/users/profile | ✅ | Update profile |
| POST | /api/v1/users/avatar | ✅ | Upload avatar to Cloudinary |
| DELETE | /api/v1/users/avatar | ✅ | Remove avatar |
| GET | /api/v1/users/credits | ✅ | Get credit summary |

---

## Phase 3 — AI Interview ⏳

### Planned Endpoints

| Method | Endpoint | Auth | Credits | Description |
|--------|----------|------|---------|-------------|
| POST | /api/v1/interviews/start | ✅ | 20 | Start new session |
| POST | /api/v1/interviews/:id/message | ✅ | — | Send answer, get next question |
| POST | /api/v1/interviews/:id/end | ✅ | — | End session, trigger evaluation |
| GET | /api/v1/interviews/history | ✅ | — | Get all past interviews |
| GET | /api/v1/interviews/:id | ✅ | — | Get single interview detail |

### Planned Models

```
InterviewSession {
  user, mode: 'hr' | 'technical',
  settings: {
    role, stack, database, addons,
    bundle, subjects, language,
    difficulty, experience: { years, level },
    totalQuestions, estimatedMinutes
  },
  messages: [{
    role: 'ai' | 'candidate',
    content, timedOut, responseTimeSeconds, timestamp
  }],
  status: 'active' | 'completed' | 'interrupted' | 'abandoned',
  webcamEnabled,
  evaluation: {
    overallScore, communication, technical,
    confidence, problemSolving,
    strengths, weaknesses, suggestions
  },
  startedAt, endedAt, actualDuration
}
```

### Key Rules
- Free users: 5 questions per interview
- Pro users: 10 questions per interview
- Questions generated one by one (adaptive, conversational)
- 60 seconds per answer (enforced on frontend, flagged in backend)
- Gemini failure → save session as 'interrupted', refund 20 credits

---

## Phase 4 — ATS Resume Analyzer ⏳

### Planned Endpoints

| Method | Endpoint | Auth | Credits | Description |
|--------|----------|------|---------|-------------|
| POST | /api/v1/ats/analyze | ✅ | 10 | Upload + analyze resume |
| GET | /api/v1/ats/history | ✅ | — | Get all ATS analyses |
| GET | /api/v1/ats/:id | ✅ | — | Get single ATS report |

### Planned Models

```
ResumeAnalysis {
  user, extractedText, atsScore,
  atsReport: {
    structure, readability, grammar,
    professionalLanguage, skillsSection,
    projectsSection, experienceSection,
    educationSection, formatting,
    actionVerbs, bulletImpact,
    keywordOptimization, missingInfo,
    overallQuality, suggestions
  },
  analyzedAt
}
```

---

## Phase 5 — Programming Assessment ⏳

### Planned Endpoints

| Method | Endpoint | Auth | Credits | Description |
|--------|----------|------|---------|-------------|
| GET | /api/v1/programming/questions | ✅ | — | List published questions |
| GET | /api/v1/programming/questions/:id | ✅ | — | Get single question |
| POST | /api/v1/programming/run | ✅ | — | Run code via Judge0 (not saved) |
| POST | /api/v1/programming/submit | ✅ | 2 | Submit + Gemini review |
| GET | /api/v1/programming/submissions/me | ✅ | — | My submission history |

### Planned Models

```
ProgrammingQuestion {
  title, language, difficulty, topic,
  description, sampleInput, sampleOutput,
  referenceSolution, tags, estimatedMinutes,
  status: 'draft' | 'published' | 'archived',
  showReferenceSolutionAfterSubmit,
  createdBy
}

ProgrammingSubmission {
  user, question, language, submittedCode,
  judgeResult: { stdout, stderr, status, executionTime, memoryUsed },
  aiReview: { score, feedback, strengths, improvements, reviewedAt, failed },
  submittedAt
}
```

### Key Rules
- Run button → Judge0 only, not saved, unlimited, free
- Submit button → Gemini review only (no Judge0 at submit), saved, costs 2 credits
- Empty submission → score 0, no Gemini call, no credit deduction
- Gemini unavailable → show reference solution, save aiReview.failed: true

---

## Phase 6 — Payments (Razorpay) ⏳

### Planned Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/v1/payments/plans | ❌ | Get available plans + pricing |
| POST | /api/v1/payments/create-order | ✅ | Create Razorpay order |
| POST | /api/v1/payments/verify | ✅ | Verify payment + activate plan |
| POST | /api/v1/payments/webhook | ❌ | Razorpay webhook (HMAC verified) |
| GET | /api/v1/payments/history | ✅ | User payment history |
| POST | /api/v1/payments/cancel | ✅ | Cancel subscription |

### Planned Models

```
Payment {
  user, razorpayOrderId, razorpayPaymentId,
  razorpaySignature, plan, billingCycle,
  amount, currency,
  status: 'created' | 'paid' | 'failed' | 'refunded',
  paidAt, createdAt
}
```

### Key Rules
- Payment verification via HMAC SHA256 server-side only
- Razorpay secret never sent to frontend
- Webhook idempotency — check if payment already processed before updating DB
- On successful payment → call credit.service.applyProSubscription()
- Webhook handles: payment.captured, subscription.charged, payment.failed

---

## Phase 7 — Admin Panel ⏳

### Planned Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | /api/v1/admin/users | ✅ | admin | List all users |
| DELETE | /api/v1/admin/users/:id | ✅ | admin | Delete user |
| GET | /api/v1/admin/interviews | ✅ | admin | List all interviews |
| GET | /api/v1/admin/analytics | ✅ | admin | Platform analytics |
| POST | /api/v1/admin/questions | ✅ | admin | Create question manually |
| PUT | /api/v1/admin/questions/:id | ✅ | admin | Edit question |
| DELETE | /api/v1/admin/questions/:id | ✅ | admin | Archive question |
| POST | /api/v1/admin/questions/generate | ✅ | admin | AI generate question (saves as draft) |
| PATCH | /api/v1/admin/questions/:id/publish | ✅ | admin | Publish draft question |

---

## Database Collections Summary

| Collection | Phase | Status |
|------------|-------|--------|
| Users | Phase 1 | ✅ Done |
| InterviewSessions | Phase 3 | ⏳ Pending |
| ResumeAnalysis | Phase 4 | ⏳ Pending |
| ProgrammingQuestions | Phase 5 | ⏳ Pending |
| ProgrammingSubmissions | Phase 5 | ⏳ Pending |
| Payments | Phase 6 | ⏳ Pending |

---

## Environment Variables

```env
PORT
NODE_ENV
MONGODB_URI
JWT_SECRET
JWT_EXPIRES_IN
GEMINI_API_KEY
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
JUDGE0_API_KEY
JUDGE0_BASE_URL
ADMIN_SEED_EMAIL
ADMIN_SEED_PASSWORD
CLIENT_URL
```

---

## Scripts

```bash
npm run dev          # nodemon dev server
npm run start        # production
npm run seed:admin   # seed admin user
```