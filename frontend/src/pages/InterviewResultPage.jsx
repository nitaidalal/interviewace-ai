import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ScoreHero from "../features/interview/result/ScoreHero.jsx";
import RadarChartCard from "../features/interview/result/RadarChartCard.jsx";
import QuestionReview from "../features/interview/result/QuestionReview.jsx";
import FeedbackSection from "../features/interview/result/FeedbackSection.jsx";
import ResultActions from "../features/interview/result/ResultActions.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import useInterview from "../hooks/useInterview.js";

const InterviewResultPage = () => {
  const { id } = useParams();
  const { fetchSession, sessionData, status } = useInterview();

  useEffect(() => {
    if (id) fetchSession(id);
  }, [id]);

  if (status === "loading" || !sessionData) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p style={{ color: "var(--color-text-secondary)" }}>
            Loading your results...
          </p>
        </div>
      </div>
    );
  }

  const { evaluation, answers, settings } = sessionData;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto flex flex-col gap-6"
    >
      {/* Page title */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Interview Complete
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {settings?.mode === "hr"
            ? "HR Interview"
            : `${settings?.role ?? "Technical"} Interview`}
          {" · "}
          {settings?.difficulty?.charAt(0).toUpperCase() +
            settings?.difficulty?.slice(1)}{" "}
          Difficulty
        </p>
      </div>

      {/* Score hero */}
      <ScoreHero finalScore={evaluation?.finalScore ?? 0} />

      {/* Radar chart */}
      <RadarChartCard categoryScores={evaluation?.categoryScores} />

      {/* Question by question review */}
      <div>
        <h3
          className="text-base font-semibold mb-3"
          style={{ color: "var(--color-text-primary)" }}
        >
          Question Review
        </h3>
        <QuestionReview answers={answers} />
      </div>

      {/* Strengths / Weaknesses / Suggestions */}
      <FeedbackSection
        strengths={evaluation?.strengths}
        weaknesses={evaluation?.weaknesses}
        suggestions={evaluation?.suggestions}
      />

      {/* Actions */}
      <ResultActions />
    </motion.div>
  );
};

export default InterviewResultPage;
