import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ScoreHero = ({ finalScore }) => {
  const [displayed, setDisplayed] = useState(0);

  // Count-up animation
  useEffect(() => {
    if (!finalScore) return;
    let current = 0;
    const step = finalScore / 30;
    const interval = setInterval(() => {
      current += step;
      if (current >= finalScore) {
        setDisplayed(finalScore);
        clearInterval(interval);
      } else {
        setDisplayed(parseFloat(current.toFixed(1)));
      }
    }, 40);
    return () => clearInterval(interval);
  }, [finalScore]);

  const getScoreColor = (s) => {
    if (s >= 8) return "#22C55E";
    if (s >= 6) return "#F59E0B";
    if (s >= 4) return "#F97316";
    return "#EF4444";
  };

  const getScoreLabel = (s) => {
    if (s >= 8) return "Excellent 🎉";
    if (s >= 6) return "Good Job 👍";
    if (s >= 4) return "Keep Practicing 💪";
    return "Needs Improvement 📚";
  };

  const color = getScoreColor(finalScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      {/* Score ring */}
      <div className="relative w-36 h-36">
        <svg width="144" height="144" className="-rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            strokeWidth="8"
            fill="none"
            stroke="var(--color-border)"
          />
          <motion.circle
            cx="72"
            cy="72"
            r="60"
            strokeWidth="8"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 60}
            initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 60 * (1 - finalScore / 10),
            }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span className="text-4xl font-bold" style={{ color }}>
            {displayed}
          </motion.span>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            out of 10
          </span>
        </div>
      </div>

      <div className="text-center">
        <h2
          className="text-xl font-bold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {getScoreLabel(finalScore)}
        </h2>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Your final interview score
        </p>
      </div>
    </motion.div>
  );
};

export default ScoreHero;
