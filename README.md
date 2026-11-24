<div align="center">

# 🎯 AceInterviewAI

### *Practice interviews with an AI that never gets tired, never judges, and never says "we'll get back to you."*

![Status](https://img.shields.io/badge/status-in%20active%20development-orange)
![Stack](https://img.shields.io/badge/stack-MERN-success)
![AI](https://img.shields.io/badge/AI-Gemini%202.5%20Flash-blue)
![Speech](https://img.shields.io/badge/STT-Deepgram%20Nova--3-purple)
![Theme](https://img.shields.io/badge/theme-light%20%2B%20dark-black)
![Vibes](https://img.shields.io/badge/vibes-immaculate-ff69b4)

**An AI-powered mock interview platform with a voice-speaking interviewer, live webcam,
per-answer feedback, resume ATS analysis, language quizzes, and a credit wallet.**

[Features](#-features) · [How It Works](#-how-an-interview-actually-works) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API](#-api-reference) · [Roadmap](#-roadmap)

</div>

---

## 📖 Table of Contents

1. [What Is This?](#-what-is-this)
2. [Why Does This Exist?](#-why-does-this-exist)
3. [Features](#-features)
4. [How an Interview Actually Works](#-how-an-interview-actually-works)
5. [The Credit Wallet](#-the-credit-wallet)
6. [Tech Stack](#-tech-stack)
7. [Architecture](#-architecture)
8. [Project Structure](#-project-structure)
9. [Database Collections](#-database-collections)
10. [API Reference](#-api-reference)
11. [Getting Started](#-getting-started)
12. [Environment Variables](#-environment-variables)
13. [Design Decisions & Plot Twists](#-design-decisions--plot-twists)
14. [Security](#-security)
15. [Project Status](#-project-status)
16. [Roadmap](#-roadmap)
17. [Troubleshooting](#-troubleshooting)
18. [FAQ Nobody Asked](#-faq-nobody-asked)
19. [Author](#-author)

---

## 🤔 What Is This?

**AceInterviewAI** is a full-stack web app where you can practice software engineering
interviews against an AI interviewer.

You pick an interview type (HR or Technical), a role, a tech stack, your experience level and a
difficulty. The AI then:

1. 👋 **Greets you** by name and tells you what you're in for
2. 🗣️ **Speaks each question out loud**, like a real interviewer
3. ⏱️ **Starts a countdown** the moment it finishes speaking
4. 🎙️ **Listens to your answer** (type it or record it)
5. 💬 **Gives instant feedback** on every single answer, plus a better version of your answer
6. 📊 **Scores your overall performance** with a radar chart at the end

Around that core there's a **resume ATS analyzer**, a **unified history page**, a
**credit-based plan system**, and a **programming quiz** that is being built.

---

## 💡 Why Does This Exist?

Because interview prep today looks like this:

| Option | Problem |
|---|---|
| Reading question lists | Nobody ever asks you the question *in that order* |
| LeetCode / HackerRank | Great for algorithms. Useless for "tell me about a time..." |
| Mock interviews with friends | Your friend is busy. Also you both laugh. |
| Paid mock interview services | Your wallet cries |
| YouTube videos | You watch. You don't answer. |

AceInterviewAI fills the gap: **a realistic, adaptive, spoken, timed interview**, available
at 3 AM, with feedback after every answer.

> ⚠️ This is **not** a LeetCode clone. There are no hidden test cases and no competitive
> programming. It simulates an *interview*, not a contest.

---

## ✨ Features

### 🎤 AI Mock Interview
- **Two modes:** HR / Behavioural and Technical
- **Technical roles:** Frontend, Backend, Full Stack, DSA, Core CS
- **One stack per role** so you never get a nonsense mix like "FastAPI + Node"
- **Experience-aware:** a fresher and a senior get very different questions
- **Three difficulties** with different time limits
- **All questions generated up front** in a single AI call, so there's no waiting between questions
- **Spoken questions** using the browser's speech synthesis
- **Voice answers** recorded in the browser and transcribed by Deepgram
- **Typed answers** if you'd rather not talk to your laptop
- **Auto-submit on timeout**, plus an AI line when your time is up
- **Instant feedback** after every answer, with a score out of 10 and an improved answer
- **Coding questions** (for stacks that support them) with an in-browser Monaco editor and an *Expand Editor* mode
- **Live webcam panel** with a recording indicator
- **Navigation protection:** refresh, back button and sidebar clicks mid-interview ask for confirmation

### 📊 Result Page
- A big, animated **final score** (the average of all your question scores)
- A **radar chart** across Communication, Technical, Confidence and Problem Solving
- **Per-question review tabs** showing your answer, your score and the ideal answer
- **Strengths, weaknesses and suggestions** written from your actual answers

### 📄 Resume ATS Analyzer
- Upload a PDF resume and get an **AI-estimated ATS compatibility score** (0 to 100)
- **14 criteria scored out of 10**, each with specific feedback
- Top **strengths**, **improvements** and **missing keywords**
- Past analyses are saved and can be reopened
- A clear disclaimer: this is **not** an official ATS score

### 🕘 Unified History
- **One sidebar item** instead of three separate history pages
- Tabs: **All · Interviews · Resumes · Programming**
- **Server-side pagination**, newest first
- Each item opens the right existing result page

### 🧠 Programming Quiz *(in progress)*
- **Language-specific** MCQs for JavaScript, C++ and Python
- Structure: **Language → Difficulty → Test → exactly 10 questions**
- One attempt per test, with scores tracked per test
- Content comes from the database. Nothing is hardcoded in React.

### 💳 Credits & Plans
- A **wallet-style credit system** instead of "3 interviews per month" rules
- Daily limits, monthly resets for the free plan, and refunds when the AI fails on you
- Razorpay payments are planned

### 🎨 UI / UX
- Modern SaaS look, **orange-based theme**
- **Light and dark mode** via a `data-theme` attribute on `<html>`
- Smooth **Framer Motion** animations everywhere
- A zero-layout-shift interview screen: feedback *replaces* the answer box instead of pushing it down
- Responsive layout

---

## 🎬 How an Interview Actually Works

```text
                    ┌────────────────────────┐
                    │   7-step setup form    │
                    │ mode → role → stack →  │
                    │ experience → difficulty│
                    │ → resume (optional) →  │
                    │ summary                │
                    └───────────┬────────────┘
                                │  POST /interviews/start
                                ▼
          ┌─────────────────────────────────────────────┐
          │ Backend: check credits → ONE Gemini call    │
          │ generates ALL questions → build greeting    │
          │ from a template (no AI) → save session      │
          └───────────────────────┬─────────────────────┘
                                  ▼
        ┌──────────────────────────────────────────────────┐
        │                 LIVE SESSION                     │
        │                                                  │
        │   AI speaks greeting ─► AI speaks question       │
        │          │                                       │
        │          ▼                                       │
        │   ⏱ timer starts (60 / 90 / 120 s)               │
        │          │                                       │
        │   you type  OR  record your voice ─► Deepgram    │
        │          │                                       │
        │          ▼                                       │
        │   submit (or auto-submit on timeout)             │
        │          │                                       │
        │          ▼                                       │
        │   Gemini: feedback + improved answer + score     │
        │          │                                       │
        │   AI SPEAKS the feedback ─► next question        │
        │          │                                       │
        │          └──────────── repeat ───────────────┐   │
        └──────────────────────────────────────────────┼───┘
                                                       ▼
                         ┌─────────────────────────────────┐
                         │ Final Gemini call: category     │
                         │ scores, strengths, weaknesses,  │
                         │ suggestions                     │
                         └───────────────┬─────────────────┘
                                         ▼
                         ┌─────────────────────────────────┐
                         │ Result page + History entry     │
                         └─────────────────────────────────┘
```

### ⏱️ Timing Rules

| Difficulty | Per question | Coding question |
|---|---|---|
| 🟢 Easy | 60 seconds | 5 minutes |
| 🟡 Medium | 90 seconds | 10 minutes |
| 🔴 Hard | 120 seconds | 15 minutes |

The timer only starts **after the AI finishes speaking the question**, and it pauses while the
AI speaks feedback. If your time runs out, whatever you have is submitted automatically.

### 🔢 Question Counts

| Plan | Questions | Coding questions |
|---|---|---|
| Free | 5 | 1 (last question) |
| Pro | 10 | 2 (last two questions) |

Stacks that can't be coded in a single file (React, Next.js, Vue, Angular, Svelte, Laravel,
Golang) get conceptual questions instead of coding questions.

### 🤖 AI Calls Per Interview

| Call | When | Count |
|---|---|---|
| Generate all questions | At start | 1 |
| Feedback + improved answer + score | After each answer | N |
| Final evaluation | At the end | 1 |
| Greeting | Never (it's a template) | 0 |

Free interview: **7 AI calls**. Pro interview: **12 AI calls**.
The greeting is deliberately *not* an AI call. "Welcome Rahul!" does not need a language model.

---

## 💰 The Credit Wallet

Instead of separate quotas per feature, every user has **one wallet**.

| Plan | Credits | Daily limit | Price |
|---|---|---|---|
| 🆓 Free | 100 / month | 20 per day | ₹0 |
| 💎 Pro Monthly | 1,500 | 100 per day | ₹299 / month |
| 💎 Pro 6 Months | 9,000 | 100 per day | ₹999 (save ₹795) |

| Action | Cost |
|---|---|
| AI Interview | 20 credits |
| ATS Resume Analysis | 10 credits |
| Programming Quiz attempt | configurable (planned) |

### Wallet rules
- Daily usage **resets every calendar day**.
- Free credits **reset on the 1st of every month** (a `node-cron` job).
- If a Pro plan **expires**, the user is downgraded to Free automatically.
- If an interview is **abandoned before any answer**, or the final **evaluation fails**,
  the credits are **refunded**.
- Every credit-consuming route goes through one middleware: `checkCredits('INTERVIEW')`.

---

## 🧰 Tech Stack

### Frontend
| Tool | Used for |
|---|---|
| **React + Vite** | UI and fast builds |
| **TailwindCSS v4** | Styling, with CSS variable design tokens |
| **Redux Toolkit** | Global state (auth user, theme) |
| **React Router DOM** | Routing, lazy loading, `useBlocker` navigation guard |
| **Axios** | API calls (one shared instance) |
| **Framer Motion** | Animations |
| **Recharts** | Radar chart on the result page |
| **Monaco Editor** | Code editor for coding questions |
| **react-hot-toast** | Notifications (top-right) |
| **react-icons** | Icons |

### Backend
| Tool | Used for |
|---|---|
| **Node.js + Express** | REST API (ES Modules) |
| **MongoDB + Mongoose** | Database |
| **JWT (httpOnly cookies)** | Authentication |
| **bcryptjs** | Password hashing |
| **Zod (v4)** | Request validation and AI response validation |
| **Multer** | File uploads (in memory, nothing hits the disk) |
| **pdf-parse** | Extracting text from PDF resumes |
| **node-cron** | Monthly free-credit reset |
| **Helmet, CORS, express-rate-limit, Morgan** | Security and logging |
| **Cloudinary** | Profile picture storage |

### AI & Speech
| Tool | Used for |
|---|---|
| **Google Gemini 2.5 Flash** (`@google/genai`) | Questions, feedback, evaluation, ATS analysis |
| **Structured output + Zod** | AI responses are schema-checked, not "parsed and hoped for the best" |
| **Browser Speech Synthesis** | The AI *speaking* to you |
| **MediaRecorder + Deepgram Nova-3** (`@deepgram/sdk`) | Your voice turned into text |

### Planned
Razorpay (payments) · Vercel (frontend) · Render (backend) · MongoDB Atlas (database)

---

## 🏗️ Architecture

### Backend: strict layers

```text
Request
  → Route          (endpoints + middleware chain)
  → Controller     (req / res only, zero logic)
  → Service        (ALL business logic)
  → Repository     (ALL database queries)
  → Model          (Mongoose schema)
```

| Layer | Allowed | Not allowed |
|---|---|---|
| Controller | read the request, call a service, send a response | business logic, DB queries |
| Service | rules, orchestration, calling AI and other services | touching `req` / `res` |
| Repository | database queries | business decisions |

### Other backend conventions
- Every response uses **one shape**:
  ```json
  { "success": true, "message": "Interview started successfully", "data": { } }
  ```
- Errors are thrown as `ApiError` and caught by **one global error handler**.
- Controllers are wrapped in `asyncHandler`, so there's **no try/catch repetition**.
- All AI prompts live in `utils/prompts/` and all AI schemas in `utils/schemas/`.
- Environment variables are **validated at startup**. The server refuses to boot with a missing key.
- Routes are **versioned** under `/api/v1`.

### Frontend: feature-first

```text
pages/      → thin, one per route
features/   → feature components (interview, ats, history, profile, home)
hooks/      → all logic (useInterview, useRecorder, useATS, ...)
api/        → every Axios call lives here, never inside components
```

- **No business logic inside components.** If it has an `await`, it belongs in a hook.
- **Redux holds only global state** (auth, theme). API data lives in hooks.
- **No hardcoded colors.** Every color is a CSS variable defined in `index.css`.

### Layouts

| Layout | Used for | Sidebar |
|---|---|---|
| `PublicLayout` | Home, login, register | ❌ (navbar) |
| `AppLayout` | Dashboard, profile, history | ✅ |
| `FocusLayout` | Interview setup / session / result, ATS | ❌ (distraction-free) |

---

## 📁 Project Structure

```text
aceinterviewai/
├── backend/
│   ├── seeds/
│   │   └── adminSeed.js
│   └── src/
│       ├── api/
│       │   ├── controllers/        auth, user, interview, ats, history, speech
│       │   ├── middlewares/        auth, role, validate, creditCheck,
│       │   │                       rateLimiter, errorHandler
│       │   └── routes/v1/          one file per module + index.js
│       ├── config/                 db, env, cloudinary, gemini, deepgram
│       ├── models/                 User, InterviewSession, ResumeAnalysis, Activity
│       ├── repositories/           one per model
│       ├── services/               auth, user, credit, cron, interview,
│       │                           gemini, ats, history, speech
│       ├── utils/
│       │   ├── prompts/            interview, evaluation, ats
│       │   ├── schemas/            Zod schemas for AI output
│       │   ├── validators/         Zod schemas for requests
│       │   └── ApiError, ApiResponse, asyncHandler, constants, upload
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── api/                    axiosInstance + one file per module
        ├── app/                    Redux store + slices (auth, theme)
        ├── components/
        │   ├── layout/             Public / App / Focus layouts, Sidebar, Navbar
        │   └── ui/                 Button, Input, Badge, Card, Spinner, ...
        ├── features/
        │   ├── home/               Hero, Features, HowItWorks, Pricing, Footer
        │   ├── profile/            header, form, avatar upload, credits widget
        │   ├── interview/
        │   │   ├── setup/          stepper + 7 step components
        │   │   ├── session/        left panel, right panel, answer zone, timer, ...
        │   │   └── result/         score hero, radar, review, feedback
        │   ├── ats/                dropzone, score ring, section cards, insights
        │   └── history/            filters, item, pagination
        ├── hooks/                  useInterview, useRecorder, useVoice,
        │                           useWebcam, useATS, useHistory, useProfile, ...
        ├── pages/
        ├── routes/                 AppRoutes + ProtectedRoute
        ├── utils/                  constants, errorParser
        ├── App.jsx · main.jsx · index.css
```

---

## 🗄️ Database Collections

| Collection | Purpose | Status |
|---|---|---|
| **Users** | Account, role, profile, subscription, credit wallet | ✅ |
| **InterviewSessions** | Settings, generated questions, messages, answers, evaluation | ✅ |
| **ResumeAnalysis** | ATS reports (extracted text is hidden from queries by default) | ✅ |
| **Activity** | A lightweight index that powers the unified History page | ✅ |
| **QuizTest** | Quiz tests with 10 embedded questions each | 🚧 |
| **TestAttempt** | One attempt per user per test | 🚧 |
| **Payments** | Razorpay payment records | ⏳ |

### Why an `Activity` collection?
History combines three different modules and needs real server-side pagination. Instead of
merging collections (messy) or fetching everything and paginating in the browser (wasteful),
each successful action writes a tiny record: `{ user, type, referenceId, title, score }`.
The History page paginates that one collection, and clicking an item opens the original result.
A unique index on `(referenceId, type)` prevents duplicates.

---

## 🔌 API Reference

**Base URL:** `http://localhost:5000/api/v1`
Authentication uses an **httpOnly cookie**, so send requests with credentials.

### 🔐 Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | – | Create account |
| POST | `/auth/login` | – | Log in |
| POST | `/auth/logout` | – | Clear the cookie |
| GET | `/auth/me` | ✅ | Current user |

### 👤 Users
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/users/profile` | ✅ | Get profile |
| PUT | `/users/profile` | ✅ | Update profile |
| POST | `/users/avatar` | ✅ | Upload avatar (Cloudinary) |
| DELETE | `/users/avatar` | ✅ | Remove avatar |
| GET | `/users/credits` | ✅ | Credit summary |

### 🎤 Interviews
| Method | Endpoint | Auth | Credits | Description |
|---|---|---|---|---|
| POST | `/interviews/start` | ✅ | 20 | Generate questions and start |
| POST | `/interviews/:id/message` | ✅ | – | Submit an answer, get feedback |
| POST | `/interviews/:id/end` | ✅ | – | Finish and evaluate |
| POST | `/interviews/:id/abandon` | ✅ | – | Quit (refund if nothing answered) |
| GET | `/interviews/history` | ✅ | – | Paginated sessions |
| GET | `/interviews/:id` | ✅ | – | Full session |

### 📄 ATS
| Method | Endpoint | Auth | Credits | Description |
|---|---|---|---|---|
| POST | `/ats/analyze` | ✅ | 10 | Upload a PDF, get a report |
| GET | `/ats/history` | ✅ | – | Past analyses |
| GET | `/ats/:id` | ✅ | – | One full report |

### 🕘 History
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/history?page=1&limit=10&type=all` | ✅ | Unified activity list (`type`: all, interview, resume, programming) |

### 🎙️ Speech
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/speech/transcribe` | ✅ | Multipart `audio` file in, `{ text }` out |

### 🧠 Quiz *(planned)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/quiz/languages` | Languages and test counts |
| GET | `/quiz/:language` | Tests grouped by difficulty |
| GET | `/quiz/test/:testId` | Test without answers |
| POST | `/quiz/test/:testId/submit` | Submit answers and score on the server |
| GET | `/quiz/attempts/:id` | Result with explanations |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 20+** (the Deepgram SDK needs 18 or newer)
- A **MongoDB** database (Atlas free tier works)
- API keys for **Gemini**, **Deepgram** and **Cloudinary**
- A modern browser (Chrome, Edge or Firefox) with a camera and microphone

### 1️⃣ Clone
```bash
git clone https://github.com/your-username/aceinterviewai.git
cd aceinterviewai
```

### 2️⃣ Backend
```bash
cd backend
npm install
cp .env.example .env     # then fill in your keys
npm run seed:admin       # optional: creates the admin user
npm run dev              # http://localhost:5000
```
Check it's alive: `http://localhost:5000/health`

### 3️⃣ Frontend
```bash
cd frontend
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api/v1
npm run dev              # http://localhost:5173
```

### 4️⃣ Try it
1. Register an account
2. Go to **AI Interview** and walk through the setup
3. Allow camera and microphone access
4. Answer by typing, or tap the mic and talk
5. Open **History** and revisit your result

### 📜 Scripts

| Where | Command | What it does |
|---|---|---|
| backend | `npm run dev` | Dev server with nodemon |
| backend | `npm start` | Production server |
| backend | `npm run seed:admin` | Create or promote the admin user |
| frontend | `npm run dev` | Vite dev server |
| frontend | `npm run build` | Production build |

---

## 🔑 Environment Variables

### `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/aceinterviewai

# Auth
JWT_SECRET=a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=7d

# AI
GEMINI_API_KEY=your_gemini_key

# Speech to text
DEEPGRAM_API_KEY=your_deepgram_key

# Image storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Admin seed
ADMIN_SEED_EMAIL=admin@aceinterviewai.com
ADMIN_SEED_PASSWORD=change_me_please

# Payments (when Phase 6 lands)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

> 🔒 Never commit `.env`. API keys live on the backend only. The browser never sees a
> Gemini or Deepgram key.

---

## 🎭 Design Decisions & Plot Twists

A project this size accumulates opinions. Here are the interesting ones.

### 1. "Generate all questions at once" beat "generate one by one"
We debated adaptive questions (each one depends on your last answer) versus generating
everything up front. Both cost about the same number of AI calls, but up-front generation means
**zero waiting between questions** and is friendlier to free API quotas. Feedback after each
answer still makes it feel conversational.

### 2. The greeting is not an AI call
"Welcome Rahul! Today we'll be conducting a Backend interview..." is a string template. It is
instant, free, and never hallucinates your name.

### 3. We deleted the coding-execution system before building it
The original plan had a Judge0 code runner, a code editor, test cases and AI code review.
Then we asked what the platform is *for*. It's an **interview simulator**, not a judge. So
**Programming Practice became Programming Quiz**: language-specific MCQs with deterministic
scoring, no compilers, no sandboxes, no extra failure points.

### 4. Pre-bundled stacks, not free-for-all dropdowns
"Node + Express" is one thing in the job market. Letting users pick "FastAPI + Node + Spring
Boot" produces interviews no human would ever sit. So each role gets **one** stack.

### 5. Structured AI output, validated with Zod
Early versions asked the model to "return only JSON" and then stripped markdown fences with
regex, which is optimistic engineering. Now every AI call has a **schema**, and the result is
validated again with Zod before it touches the database.

### 6. Feedback *replaces* the answer box
Appending feedback below the textarea shifted the whole page on every answer. The answer zone
now has a fixed minimum height and **swaps content** instead: typing area, then feedback card.
Zero layout shift.

### 7. Browser speech recognition was replaced
The browser's built-in recognizer stopped on long, pausing answers and only worked in one
browser family. Answers are now **recorded and sent to Deepgram** through our backend. The bonus:
`MediaRecorder` works in more browsers, and the user can **edit the transcript before submitting**.

### 8. Credits, not quotas
"3 interviews, 1 ATS, 5 submissions per month" means three counters to maintain and annoyed
users who run out of the wrong one. One wallet means one number, one middleware, one refund path.

### 9. Focus mode
Interview screens use a layout with **no sidebar**. Combined with a navigation blocker and a
`beforeunload` warning, you can't accidentally click away from a live interview.

### 10. Honest ATS scoring
The ATS score is labelled **"AI-estimated"** in the UI, on purpose. It's guidance to improve
your resume, not an official verdict.

---

## 🛡️ Security

- 🍪 **JWT in httpOnly cookies**, so JavaScript can't read the token
- 🔑 **bcrypt** password hashing (12 rounds), and the hash is never returned in any response
- ✅ **Zod validation** on request bodies, params and queries
- 🚦 **Rate limiting** globally, on auth routes, and on the speech endpoint
- 🪖 **Helmet** security headers and **CORS** locked to `CLIENT_URL`
- 👮 **Role-based access** (candidate / admin) through middleware
- 📎 **Uploads stay in memory** and are type-checked and size-limited (PDFs 10MB, audio 5MB)
- 🙈 **Resume text is excluded from queries by default** (`select: false`)
- 🔐 **Secrets** are read from the environment and validated at startup
- 🧾 **History is scoped to the logged-in user**. The user ID comes from the token, never from the request.

---

## 📈 Project Status

| Phase | Module | Status |
|---|---|---|
| 1 | Scaffold + authentication | ✅ Done |
| 2 | Profile, credits, home page, layouts | ✅ Done |
| 3 | AI mock interview (backend + frontend) | ✅ Done |
| 4 | ATS resume analyzer + unified history | ✅ Done |
| — | Deepgram speech-to-text | ✅ Done |
| 5 | Programming Quiz | 🚧 In progress |
| 6 | Razorpay payments | ⏳ Planned |
| 7 | Admin panel (users, quiz management) | ⏳ Planned |
| 8 | Analytics dashboard | ⏳ Planned |
| 9 | Deployment + polish | ⏳ Planned |

---

## 🗺️ Roadmap

**Soon**
- [ ] Programming Quiz: tests, attempts, result review
- [ ] Razorpay checkout, webhook verification, billing page
- [ ] Admin panel: user management, quiz creation with a "10 questions to publish" rule

**Later**
- [ ] Analytics dashboard (score trend, weak and strong topics)
- [ ] Resume-based and mixed interview modes (questions from your own projects)
- [ ] Reuse the resume from your profile in the interview setup
- [ ] Deployment: Vercel + Render + MongoDB Atlas
- [ ] Mobile responsiveness pass and loading skeletons everywhere

**Dreaming**
- [ ] A real AI interviewer avatar
- [ ] Webcam-based attention checks
- [ ] Question banks with randomised quiz tests
- [ ] Premium AI voice for Pro users
- [ ] More quiz languages (Java, TypeScript, Go)

---

## 🩺 Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| Server exits immediately on start | A required env variable is missing | Read the startup error. It lists exactly which ones. |
| Logged out right after login | Cookie / CORS mismatch | Make sure `CLIENT_URL` matches the frontend origin and Axios uses `withCredentials` |
| Mic button does nothing | Browser blocked the microphone | Allow mic access for the site |
| "Couldn't hear anything" | Silent or very short recording | Speak closer to the mic, or type the answer |
| Interview won't start | Gemini quota hit or key invalid | Check `GEMINI_API_KEY` and your quota. Credits are only deducted after questions generate. |
| ATS says the PDF is empty | Image-based (scanned) PDF | Upload a text-based PDF |
| Webcam panel is dark | Camera permission denied | Allow camera access, or continue without it |
| "Insufficient credits" | Wallet or daily limit reached | Check the credits widget on your profile |

---

## ❓ FAQ Nobody Asked

**Is this a LeetCode replacement?**
No. LeetCode asks if you can solve the problem. This asks if you can *talk* about it under pressure.

**Why does the AI speak with a slightly robotic voice?**
The speaking part uses your browser's built-in voices, which are free and instant. Better
voices are on the dream list.

**Will it replace my interviewer?**
It will replace your fear of the first question. The real interviewer is still on their own.

**Why is the greeting not generated by AI?**
Because `"Welcome " + name` has been solved since the 1970s.

**What if I score 0 on a question?**
Then you've found a topic to study, which is the whole point.

**Why so many tests per difficulty in the quiz?**
So finishing Test 1 doesn't mean you've "done Easy". Each test is a curated set of exactly 10
questions, and you won't be served the same one twice.

**Why does the README have jokes?**
Because it was requested to be long and unnecessary. Mission accomplished.

---

## 🙋 Author

Built by **Nitai** as a full-stack, AI-powered portfolio project.

- GitHub: [your-username](https://github.com/your-username)
- LinkedIn: [your-profile](https://linkedin.com/in/your-profile)

If this project helped you, drop a ⭐. It makes the AI interviewer feel appreciated.

---

<div align="center">

**Practice more. Panic less. Ace the interview.** 🎯

*Made with React, Node, a lot of tea, and an unreasonable number of Framer Motion animations.*

</div>