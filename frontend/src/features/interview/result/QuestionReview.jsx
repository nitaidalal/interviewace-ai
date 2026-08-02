import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineCode, MdOutlineLightbulb } from "react-icons/md";
import Badge from "../../../components/ui/Badge.jsx";

const QuestionReview = ({ answers }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!answers?.length) return null;

  const active = answers[activeTab];

  const getScoreVariant = (s) => {
    if (s >= 8) return "success";
    if (s >= 5) return "warning";
    return "danger";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Tabs */}
      <div
        className="flex gap-1 p-2 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {answers.map((a, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium
              transition-all duration-200 cursor-pointer"
            style={{
              backgroundColor:
                activeTab === i ? "var(--color-primary)" : "transparent",
              color: activeTab === i ? "white" : "var(--color-text-secondary)",
            }}
          >
            Q{a.questionIndex}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="p-5 flex flex-col gap-4"
        >
          {/* Question */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--color-primary)" }}
              >
                Question {active.questionIndex}
              </span>
              <div className="flex items-center gap-2">
                {active.isCodingQuestion && (
                  <Badge variant="warning" className="flex items-center gap-1">
                    <MdOutlineCode size={10} />
                    Coding
                  </Badge>
                )}
                <Badge variant={getScoreVariant(active.questionScore)}>
                  {active.questionScore}/10
                </Badge>
              </div>
            </div>
            <p
              className="text-sm font-medium leading-relaxed"
              style={{ color: "var(--color-text-primary)" }}
            >
              {active.questionContent}
            </p>
          </div>

          {/* Your answer */}
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide mb-2"
              style={{ color: "var(--color-text-muted)" }}
            >
              Your Answer
            </p>
            <div
              className="text-sm p-3 rounded-xl"
              style={{
                backgroundColor: "var(--color-surface-hover)",
                color: active.timedOut
                  ? "var(--color-text-muted)"
                  : "var(--color-text-primary)",
                fontFamily: active.isCodingQuestion ? "monospace" : "inherit",
                whiteSpace: active.isCodingQuestion ? "pre-wrap" : "normal",
              }}
            >
              {active.candidateAnswer || "(No answer submitted)"}
              {active.timedOut && (
                <span
                  className="ml-2 text-xs"
                  style={{ color: "var(--color-danger)" }}
                >
                  — Time ran out
                </span>
              )}
            </div>
          </div>

          {/* Improved answer */}
          {active.improvedAnswer && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MdOutlineLightbulb
                  size={14}
                  style={{ color: "var(--color-warning)" }}
                />
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: "var(--color-warning)" }}
                >
                  Ideal Answer
                </p>
              </div>
              <div
                className="text-sm p-3 rounded-xl leading-relaxed"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-warning) 8%, transparent)",
                  color: "var(--color-text-primary)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-warning) 20%, transparent)",
                }}
              >
                {active.improvedAnswer}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionReview;
