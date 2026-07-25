export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  INTERVIEW: "/dashboard/interview",
  PROGRAMMING: "/dashboard/programming",
  ATS: "/dashboard/ats",
  PROFILE: "/dashboard/profile",
  BILLING: "/dashboard/billing",
  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_QUESTIONS: "/admin/questions",
};

export const EXPERIENCE_LEVELS = [
  { label: "Fresher (0 years)", value: "fresher", minYears: 0, maxYears: 0 },
  { label: "Junior (1–2 years)", value: "junior", minYears: 1, maxYears: 2 },
  { label: "Mid-level (3–5 years)", value: "mid", minYears: 3, maxYears: 5 },
  { label: "Senior (6–8 years)", value: "senior", minYears: 6, maxYears: 8 },
  {
    label: "Lead / Architect (9+ years)",
    value: "lead",
    minYears: 9,
    maxYears: 80,
  },
];

export const CREDIT_COSTS = {
  INTERVIEW: 20,
  ATS_ANALYSIS: 10,
  CODING_SUBMISSION: 2,
};

export const THEME = {
  LIGHT: "light",
  DARK: "dark",
};