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

export const PREFERRED_STACKS = [
  "React",
  "Next.js",
  "Vue.js",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "FastAPI",
  "Django",
  "Spring Boot",
  "Laravel",
  "Golang",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "TypeScript",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "Docker",
  "AWS",
  "Redis",
];

export const PRICING = {
  pro: {
    monthly: {
      amount: 299,
      credits: 1500,
      validityDays: 30,
      label: "₹299/month",
      perMonth: "₹299/mo",
    },
    sixMonths: {
      amount: 999,
      credits: 9000,
      validityDays: 180,
      label: "₹999 for 6 months",
      perMonth: "₹166/mo effectively",
      savings: "₹795",
    },
  },
};

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

// export const SIDEBAR_LINKS = [
//   {
//     label: "Dashboard",
//     href: "/dashboard",
//     icon: "dashboard",
//   },
//   {
//     label: "AI Interview",
//     href: "/dashboard/interview",
//     icon: "interview",
//   },
//   {
//     label: "ATS Analyzer",
//     href: "/dashboard/ats",
//     icon: "ats",
//   },
//   {
//     label: "Practice",
//     href: "/dashboard/programming",
//     icon: "code",
//   },
//   {
//     label: "Profile",
//     href: "/dashboard/profile",
//     icon: "profile",
//   },
// ];