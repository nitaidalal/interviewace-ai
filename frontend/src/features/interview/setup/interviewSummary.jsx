import { motion as Motion } from "framer-motion";
import {
  MdOutlineVideoCall,
  MdOutlineTimer,
  MdOutlineQuiz,
  MdOutlineWarning,
} from "react-icons/md";
import { RiCoinLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import Button from "../../../components/ui/Button.jsx";
import { CREDIT_COSTS } from "../../../utils/constants.js";

const SummaryRow = ({ icon: Icon, label, value, highlight }) => (
  <div
    className="flex items-center justify-between py-3"
    style={{ borderBottom: "1px solid var(--color-border)" }}
  >
    <div
      className="flex items-center gap-2 text-sm"
      style={{ color: "var(--color-text-secondary)" }}
    >
      <Icon size={16} style={{ color: "var(--color-primary)" }} />
      {label}
    </div>
    <span
      className="text-sm font-semibold"
      style={{
        color: highlight ? "var(--color-primary)" : "var(--color-text-primary)",
      }}
    >
      {value}
    </span>
  </div>
);

const InterviewSummary = ({ settings, onStart, loading, isPro }) => {
  const {
    mode,
    role,
    stack,
    framework,
    bundle,
    dsaLanguage,
    subjects,
    difficulty,
    experience,
    totalQuestions,
    estimatedMinutes,
    timePerQuestion,
  } = settings;

  const getStackDisplay = () => {
    if (mode === "hr") return "HR / Behavioural";
    if (role === "frontend")
      return framework ? `React → ${framework}` : "Vanilla JS";
    if (role === "backend") return stack?.replace(/_/g, " + ") ?? "Backend";
    if (role === "fullstack") return bundle?.toUpperCase() ?? "Full Stack";
    if (role === "dsa") return `DSA — ${dsaLanguage}`;
    if (role === "core_cs") return subjects?.join(", ") ?? "Core CS";
    return "—";
  };

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header */}
        <div className="p-5 bg-brand-gradient">
          <h3 className="text-white font-bold text-lg">Interview Summary</h3>
          <p className="text-white/80 text-sm mt-0.5">Review before starting</p>
        </div>

        {/* Details */}
        <div className="px-5">
          <SummaryRow
            icon={MdOutlineVideoCall}
            label="Type"
            value={getStackDisplay()}
          />
          <SummaryRow
            icon={MdOutlineQuiz}
            label="Difficulty"
            value={difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1)}
          />
          <SummaryRow
            icon={MdOutlineQuiz}
            label="Experience"
            value={`${experience?.years || 0} yrs — ${experience?.level || "Fresher"}`}
          />
          <SummaryRow
            icon={MdOutlineTimer}
            label="Questions"
            value={`${totalQuestions ?? (isPro ? 10 : 5)} questions`}
          />
          <SummaryRow
            icon={MdOutlineTimer}
            label="Time per question"
            value={`${timePerQuestion ?? 60}s`}
          />
          <SummaryRow
            icon={MdOutlineTimer}
            label="Estimated duration"
            value={`~${estimatedMinutes ?? 10} minutes`}
          />
          <SummaryRow
            icon={RiCoinLine}
            label="Cost"
            value={`${CREDIT_COSTS.INTERVIEW} credits`}
            highlight
          />
        </div>

        {/* Warnings */}
        <div className="px-5 py-4 flex flex-col gap-2">
          <div
            className="flex items-start gap-2 text-xs p-3 rounded-lg"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-warning) 10%, transparent)",
              color: "var(--color-warning)",
            }}
          >
            <MdOutlineVideoCall size={14} className="shrink-0 mt-0.5" />
            Webcam will be enabled during the interview
          </div>
          <div
            className="flex items-start gap-2 text-xs p-3 rounded-lg"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            <MdOutlineTimer size={14} className="shrink-0 mt-0.5" />
            Questions auto-submit when time runs out
          </div>
        </div>

        {/* Start button */}
        <div className="px-5 pb-5">
          <Button
            fullWidth
            size="lg"
            loading={loading}
            onClick={onStart}
            className="gap-2"
          >
            <HiSparkles size={16} />
            Start Interview
          </Button>
        </div>
      </div>
    </Motion.div>
  );
};

export default InterviewSummary;
