import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";

const getScoreColor = (score) => {
  if (score >= 80) return "#22C55E";
  if (score >= 60) return "#F59E0B";
  if (score >= 40) return "#F97316";
  return "#EF4444";
};

const getScoreLabel = (score) => {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Needs Work";
};

const ATSScoreRing = ({ score }) => {
  const [displayed, setDisplayed] = useState(0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);

  // Count-up animation
  useEffect(() => {
    if (!score) return;
    let current = 0;
    const step = score / 40;
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setDisplayed(score);
        clearInterval(interval);
      } else {
        setDisplayed(Math.round(current));
      }
    }, 30);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg width="144" height="144" className="-rotate-90">
          {/* Background */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            strokeWidth="10"
            fill="none"
            stroke="var(--color-border)"
          />
          {/* Progress */}
          <Motion.circle
            cx="72"
            cy="72"
            r={radius}
            strokeWidth="10"
            fill="none"
            stroke={color}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (score / 100) * circumference,
            }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Motion.span className="text-4xl font-bold" style={{ color }}>
            {displayed}
          </Motion.span>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-lg font-bold" style={{ color }}>
          {getScoreLabel(score)}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          AI-estimated ATS compatibility
        </p>
      </div>
    </div>
  );
};

export default ATSScoreRing;
