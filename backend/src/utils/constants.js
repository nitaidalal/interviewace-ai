// ─── Credit Costs ────────────────────────────────────────────────
export const CREDIT_COSTS = {
  INTERVIEW: 20,
  ATS_ANALYSIS: 10,
  CODING_SUBMISSION: 2,
}

// ─── Plan Limits ─────────────────────────────────────────────────
export const PLAN_LIMITS = {
  free: {
    totalCredits: 100,
    dailyLimit: 20,
    billingCycle: null,
    validityDays: null,        // never expires
  },
  pro: {
    monthly: {
      totalCredits: 1500,
      dailyLimit: 100,
      validityDays: 30,
    },
    sixMonths: {
      totalCredits: 9000,
      dailyLimit: 100,
      validityDays: 180,
    },
  },
}

// ─── Questions Per Interview ──────────────────────────────────────
export const QUESTIONS_PER_PLAN = {
  free: 5,
  pro: 10,
}

// ─── Interview Roles ──────────────────────────────────────────────
export const INTERVIEW_ROLES = {
  HR: 'hr',
  FRONTEND: 'frontend',
  BACKEND: 'backend',
  FULLSTACK: 'fullstack',
  DSA: 'dsa',
  CORE_CS: 'core_cs',
}

// ─── Interview Stacks ─────────────────────────────────────────────
export const FRONTEND_FRAMEWORKS = [
  { label: 'React', value: 'react' },
  { label: 'Next.js', value: 'nextjs' },
  { label: 'Vue.js', value: 'vue' },
  { label: 'Nuxt.js', value: 'nuxtjs' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
]

export const BACKEND_STACKS = [
  { label: 'Node.js + Express', value: 'node_express' },
  { label: 'Node.js + NestJS', value: 'node_nest' },
  { label: 'Node.js + Fastify', value: 'node_fastify' },
  { label: 'Spring Boot (Java)', value: 'springboot' },
  { label: 'FastAPI (Python)', value: 'fastapi' },
  { label: 'Django REST (Python)', value: 'django' },
  { label: 'Laravel (PHP)', value: 'laravel' },
  { label: 'Golang (Gin)', value: 'golang' },
]

export const BACKEND_DATABASES = {
  node_express: ['mongodb', 'mysql', 'postgresql'],
  node_nest: ['mongodb', 'mysql', 'postgresql'],
  node_fastify: ['mongodb', 'mysql', 'postgresql'],
  springboot: ['mysql', 'postgresql'],
  fastapi: ['postgresql', 'mysql'],
  django: ['postgresql', 'mysql'],
  laravel: ['mysql', 'postgresql'],
  golang: ['postgresql', 'mysql'],
}

export const FULLSTACK_BUNDLES = [
  { label: 'MERN (MongoDB, Express, React, Node)', value: 'mern' },
  { label: 'MEAN (MongoDB, Express, Angular, Node)', value: 'mean' },
  { label: 'PERN (PostgreSQL, Express, React, Node)', value: 'pern' },
  { label: 'Next.js + Node + PostgreSQL', value: 'next_node_pg' },
  { label: 'Python Full Stack (Django + React)', value: 'python_fullstack' },
  { label: 'Java Full Stack (Spring Boot + React)', value: 'java_fullstack' },
]

export const DSA_LANGUAGES = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
]

export const CORE_CS_SUBJECTS = [
  { label: 'Operating Systems', value: 'os' },
  { label: 'DBMS', value: 'dbms' },
  { label: 'Computer Networks', value: 'cn' },
  { label: 'Object Oriented Programming', value: 'oops' },
  { label: 'System Design (Basic)', value: 'system_design' },
]

// ─── Difficulty ───────────────────────────────────────────────────
export const DIFFICULTY_LEVELS = ['easy', 'medium', 'hard']

// ─── Programming ──────────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = ['javascript', 'python', 'sql']

// ─── Experience ───────────────────────────────────────────────────
export const EXPERIENCE_MAP = [
  { level: 'fresher', minYears: 0, maxYears: 0 },
  { level: 'junior', minYears: 1, maxYears: 2 },
  { level: 'mid', minYears: 3, maxYears: 5 },
  { level: 'senior', minYears: 6, maxYears: 8 },
  { level: 'lead', minYears: 9, maxYears: 80 },
]

// ─── Interview ────────────────────────────────────────────────────
export const ANSWER_TIME_LIMIT_SECONDS = 60

export const ESTIMATED_INTERVIEW_MINUTES = {
  free: 10,
  pro: 20,
}

// ─── Auth / Cookie ────────────────────────────────────────────────
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

// ─── Session Status ───────────────────────────────────────────────
export const SESSION_STATUS = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  INTERRUPTED: 'interrupted',
  ABANDONED: 'abandoned',
}

// ─── Question Status ──────────────────────────────────────────────
export const QUESTION_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
}