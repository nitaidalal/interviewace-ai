import { motion } from "framer-motion";
import CountdownTimer from "./CountdownTimer.jsx";

const ProgressHeader = ({
  questionIndex,
  totalQuestions,
  timeLimit,
  onTimeout,
  paused,
  timerKey,
}) => {
  const progress = ((questionIndex - 1) / totalQuestions) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Left — question counter + progress bar */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-text-muted)" }}
          >
            Question {questionIndex} of {totalQuestions}
          </span>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-muted)" }}
          >
            {Math.round(progress)}% complete
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--color-border)" }}
        >
          <motion.div
            className="h-full rounded-full bg-brand-gradient"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Right — circular timer */}
      <CountdownTimer
        key={timerKey}
        seconds={timeLimit}
        onTimeout={onTimeout}
        paused={paused}
      />
    </div>
  );
};

export default ProgressHeader;
