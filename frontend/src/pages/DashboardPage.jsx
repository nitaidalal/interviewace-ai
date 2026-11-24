import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
  MdOutlineVideoCall,
  MdOutlineDescription,
  MdOutlineArrowForward,
  MdOutlineTrendingUp,
  MdOutlineHistory,
  MdOutlineCheckCircle,
  MdOutlineCalendarToday,
} from "react-icons/md";
import { getHistory } from "../api/interviewApi.js";
import { getATSHistory } from "../api/atsApi.js";
import { CREDIT_COSTS, ROUTES } from "../utils/constants.js";

const dateLabel = (value) => new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const interviewTitle = (s) => s.settings?.mode === "hr" ? "HR interview" : `${s.settings?.role || "Technical"} interview`;
const MotionLink = Motion.create(Link);

function DashboardPage() {
  const reducedMotion = useReducedMotion();
  const entrance = (delay = 0) => ({
    initial: reducedMotion ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reducedMotion ? 0 : 0.4, delay: reducedMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] },
  });
  const user = useSelector((state) => state.auth.user);
  const [data, setData] = useState({ interviews: null, resumes: null });
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([getHistory(1, 10), getATSHistory(1, 10)]).then(([interviews, resumes]) => {
      if (cancelled) return;
      setData({
        interviews: interviews.status === "fulfilled" ? interviews.value.data.data : null,
        resumes: resumes.status === "fulfilled" ? resumes.value.data.data : null,
      });
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [attempt, user?._id]);

  const sessions = data.interviews?.sessions ?? [];
  const analyses = data.resumes?.analyses ?? [];
  const scored = sessions.filter((s) => s.status === "completed" && Number.isFinite(s.evaluation?.finalScore));
  const average = scored.length ? (scored.reduce((sum, s) => sum + s.evaluation.finalScore, 0) / scored.length).toFixed(1) : null;
  const latestResume = analyses[0];
  const latestInterview = scored[0];
  const unavailable = (filter !== "resumes" && !data.interviews) || (filter !== "interviews" && !data.resumes);
  const activities = [
    ...sessions.map((s) => ({ id: `interview-${s._id}`, type: "interviews", title: interviewTitle(s), date: s.startedAt, status: s.status, score: s.status === "completed" && Number.isFinite(s.evaluation?.finalScore) ? `${s.evaluation.finalScore}/10` : null, href: s.status === "completed" ? `/dashboard/interview/${s._id}/result` : ROUTES.INTERVIEW_HISTORY })),
    ...analyses.map((a) => ({ id: `resume-${a._id}`, type: "resumes", title: "Resume analysis", date: a.analyzedAt, status: "analyzed", score: `${a.atsScore}/100`, href: `${ROUTES.ATS}?analysis=${a._id}` })),
  ].filter((item) => filter === "all" || item.type === filter).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const stats = [
    { label: "Interviews", value: data.interviews?.total, note: "Total practice sessions", icon: MdOutlineVideoCall },
    { label: "Average interview score", value: average, suffix: "/10", note: "Completed sessions in your latest 10", icon: MdOutlineTrendingUp },
    { label: "Resume analyses", value: data.resumes?.total, note: "Total resumes analyzed", icon: MdOutlineDescription },
    { label: "Latest ATS score", value: latestResume?.atsScore, suffix: "/100", note: latestResume ? `Analyzed on ${dateLabel(latestResume.analyzedAt)}` : "No resume analyzed yet", icon: MdOutlineCheckCircle },
  ];

  return (
    <div className="flex flex-col gap-6 pb-8 pt-2 text-text-primary">
      <Motion.header {...entrance()} className="flex items-end justify-between gap-5 pb-1">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Preparation dashboard
          </p>
          <h1 className="text-[28px] font-bold tracking-tight sm:text-4xl">
            Welcome back, {user?.name?.trim().split(/\s+/)[0] || "there"}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
            Practice interviews, review feedback, and check your resume.
          </p>
        </div>
        <span className="hidden shrink-0 items-center gap-2 rounded-xl border border-border/80 bg-surface px-3.5 py-3 text-xs text-text-secondary shadow-sm xl:inline-flex">
          <MdOutlineCalendarToday className="text-text-muted" size={15} />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short", day: "numeric", month: "long",
          })}
        </span>
      </Motion.header>

      <section aria-labelledby="dash-start-title">
        <h2 id="dash-start-title" className="mb-3 text-sm font-semibold text-text-secondary">
          What would you like to work on?
        </h2>
        <div className="grid grid-cols-1 gap-4 min-[701px]:grid-cols-2">
          <MotionLink
            {...entrance(0.05)}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            whileTap={reducedMotion ? undefined : { scale: 0.99 }}
            to={ROUTES.INTERVIEW}
            className="group relative flex min-h-[232px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 !text-text-primary shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:p-6"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full opacity-60 blur-3xl"
              style={{ background: "color-mix(in srgb, var(--color-primary) 14%, transparent)" }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                <MdOutlineVideoCall size={25} />
              </span>
              <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">Technical & HR</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Mock interview</h3>
            <p className="mt-2 max-w-md flex-1 text-sm leading-relaxed text-text-secondary">
              Practice questions for your role and get detailed feedback on
              your answers when you finish.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-[background-color,transform] group-hover:bg-primary-hover motion-safe:group-hover:translate-x-0.5">
                Start interview <MdOutlineArrowForward className="transition-transform motion-safe:group-hover:translate-x-1" />
              </span>
              <span className="text-xs text-text-muted">{CREDIT_COSTS.INTERVIEW} credits / session</span>
            </div>
          </MotionLink>
          <MotionLink
            {...entrance(0.1)}
            whileHover={reducedMotion ? undefined : { y: -4 }}
            whileTap={reducedMotion ? undefined : { scale: 0.99 }}
            to={ROUTES.ATS}
            className="group relative flex min-h-[232px] flex-col overflow-hidden rounded-2xl border border-border bg-surface p-5 !text-text-primary shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:p-6"
          >
            <div
              className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full opacity-60 blur-3xl"
              style={{ background: "color-mix(in srgb, var(--color-accent) 12%, transparent)" }}
              aria-hidden="true"
            />
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
                <MdOutlineDescription size={25} />
              </span>
              <span className="rounded-full border border-primary/15 bg-primary/5 px-2.5 py-1 text-[11px] font-medium text-primary">ATS review</span>
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-tight">Resume analysis</h3>
            <p className="mt-2 max-w-md flex-1 text-sm leading-relaxed text-text-secondary">
              Check your ATS score, find missing keywords, and review
              suggestions for your content and formatting.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/80 pt-4">
              <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/20 transition-[background-color,transform] group-hover:bg-primary-hover motion-safe:group-hover:translate-x-0.5">
                Analyze resume <MdOutlineArrowForward className="transition-transform motion-safe:group-hover:translate-x-1" />
              </span>
              <span className="text-xs text-text-muted">{CREDIT_COSTS.ATS_ANALYSIS} credits / analysis</span>
            </div>
          </MotionLink>
        </div>
      </section>

      {!loading && (!data.interviews || !data.resumes) && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-warning/25 bg-warning/10 p-4 text-sm text-text-secondary" role="alert">
          <span>
            Could not load {!data.interviews && !data.resumes ? "your activity" : !data.interviews ? "interview history" : "resume history"}.
          </span>
          <button
            className="cursor-pointer rounded font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            onClick={() => { setLoading(true); setAttempt((v) => v + 1); }}
          >
            Try again
          </button>
        </div>
      )}

      <section aria-label="Preparation overview" className="grid grid-cols-1 gap-3 min-[461px]:grid-cols-2 min-[1101px]:grid-cols-4" aria-busy={loading}>
        {stats.map((stat, index) => (
          <Motion.div
            {...entrance(0.16 + index * 0.05)}
            className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-4 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md sm:p-5"
            key={stat.label}
          >
            <div
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-gradient transition-transform duration-300 group-hover:scale-x-100"
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-2 text-xs font-medium text-text-secondary">
              <span className="leading-5">{stat.label}</span>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-surface-hover text-primary">
                <stat.icon className="text-base" />
              </span>
            </div>
            {loading ? (
              <div className="my-3 h-9 w-20 rounded-lg bg-surface-hover motion-safe:animate-pulse" />
            ) : (
              <Motion.div
                key={String(stat.value ?? "empty")}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.25 }}
                className="mb-2 mt-3 text-[32px] font-semibold leading-none tracking-tight tabular-nums"
              >
                {stat.value ?? "—"}
                {stat.value != null && stat.suffix && (
                  <span className="ml-1 text-sm font-normal tracking-normal text-text-muted">{stat.suffix}</span>
                )}
              </Motion.div>
            )}
            <p className="text-xs leading-relaxed text-text-muted">{stat.note}</p>
            {stat.label === "Latest ATS score" && latestResume && (
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-hover"
                aria-label={`ATS score ${latestResume.atsScore} out of 100`}
              >
                <div
                  className="h-full rounded-full bg-brand-gradient"
                  style={{ width: `${Math.min(100, Math.max(0, latestResume.atsScore))}%` }}
                />
              </div>
            )}
          </Motion.div>
        ))}
      </section>
      <div className="grid grid-cols-1 items-start gap-4 min-[1101px]:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <Motion.section {...entrance(0.32)} className="min-w-0 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm" aria-labelledby="dash-activity-title">
          <div className="flex items-center justify-between gap-3 p-5">
            <div>
              <h2 id="dash-activity-title" className="text-base font-semibold">Recent activity</h2>
              <p className="mt-1 text-xs text-text-muted">Your latest interviews and resume reports.</p>
            </div>
            <MdOutlineHistory size={22} className="shrink-0 text-text-muted" />
          </div>
          <div className="flex flex-wrap gap-1 border-b border-border px-4 pb-4" role="group" aria-label="Filter recent activity">
            {[["all", "All activity"], ["interviews", "Interviews"], ["resumes", "Resume analyses"]].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
                className="relative isolate cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary aria-pressed:text-primary"
              >
                {filter === value && (
                  <Motion.span
                    layoutId="dashboard-activity-filter"
                    className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                    transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
                    aria-hidden="true"
                  />
                )}
                {label}
              </button>
            ))}
          </div>
          <div aria-live="polite" aria-busy={loading}>
            {loading ? (
              <div className="grid gap-4 p-5" role="status" aria-label="Loading activity">
                {[0, 1, 2].map((i) => (
                  <div className="h-11 rounded-lg bg-surface-hover motion-safe:animate-pulse" key={i} />
                ))}
              </div>
            ) : activities.length ? (
              activities.map((item) => (
                <Link
                  to={item.href}
                  key={item.id}
                  className="group flex items-center gap-3 border-b border-border px-4 py-4 !text-text-primary transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:px-5"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-hover text-xl text-text-secondary">
                    {item.type === "interviews" ? <MdOutlineVideoCall /> : <MdOutlineDescription />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium">{item.title}</h3>
                    <p className="mt-1 flex flex-wrap gap-2 text-xs text-text-muted">
                      {dateLabel(item.date)}<span aria-hidden="true">·</span>
                      <span className="capitalize">{item.status}</span>
                    </p>
                  </div>
                  {item.score && <strong className="whitespace-nowrap rounded-md border border-border bg-surface-hover px-2 py-1 text-xs font-semibold tabular-nums">{item.score}</strong>}
                  <MdOutlineArrowForward className="shrink-0 text-text-muted transition-transform motion-safe:group-hover:translate-x-1" />
                </Link>
              ))
            ) : (
              <div className="px-5 py-10 text-center">
                <MdOutlineHistory size={30} className="mx-auto mb-3 text-text-muted" />
                <h3 className="text-sm font-semibold">
                  {unavailable ? "Activity is unavailable" : "No activity yet"}
                </h3>
                <p className="mx-auto mb-4 mt-2 max-w-xs text-xs leading-relaxed text-text-secondary">
                  {unavailable ? "Use the retry button above to load your history." : "Completed interviews and resume reports will appear here."}
                </p>
                {!unavailable && (
                  <Link
                    to={filter === "resumes" ? ROUTES.ATS : ROUTES.INTERVIEW}
                    className="inline-flex items-center gap-2 rounded text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    {filter === "resumes" ? "Analyze a resume" : "Start an interview"}
                    <MdOutlineArrowForward />
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="flex flex-wrap justify-between gap-3 p-4 sm:px-5">
            <Link to={ROUTES.INTERVIEW_HISTORY} className="inline-flex items-center gap-2 rounded text-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Interview history <MdOutlineArrowForward />
            </Link>
            <Link to={`${ROUTES.ATS}?history=1`} className="inline-flex items-center gap-2 rounded text-xs focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              Resume history <MdOutlineArrowForward />
            </Link>
          </div>
        </Motion.section>
        <Motion.aside {...entrance(0.38)} className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Next steps</h2>
            <span className="rounded-full border border-border bg-surface-hover px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Recommended
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {latestInterview
              ? "Review your last interview before starting another session."
              : latestResume
                ? "Practice explaining the skills and projects on your resume."
                : "Upload your resume or choose an interview to get started."}
          </p>
          <ul className="my-5 space-y-2 text-sm">
            <li className="flex gap-3 rounded-xl border border-border/70 px-3 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
              <div>
                <h3 className="text-sm font-medium">Check your resume</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">Review formatting, keywords, and missing information.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border border-border/70 px-3 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
              <div>
                <h3 className="text-sm font-medium">Practice an interview</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">Choose a role and difficulty that match your preparation.</p>
              </div>
            </li>
            <li className="flex gap-3 rounded-xl border border-border/70 px-3 py-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
              <div>
                <h3 className="text-sm font-medium">Review your feedback</h3>
                <p className="mt-1 text-xs leading-relaxed text-text-muted">Look through your answers and note what to improve.</p>
              </div>
            </li>
          </ul>
          <Link
            className="flex items-center justify-between gap-3 rounded border-t border-border pt-4 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            to={latestInterview ? `/dashboard/interview/${latestInterview._id}/result` : latestResume ? ROUTES.INTERVIEW : ROUTES.ATS}
          >
            {latestInterview ? "Review latest interview" : latestResume ? "Start an interview" : "Analyze your resume"}
            <MdOutlineArrowForward className="shrink-0" />
          </Link>
        </Motion.aside>
      </div>
    </div>
  );
}

export default DashboardPage;
