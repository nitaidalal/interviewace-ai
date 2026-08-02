import { motion } from "framer-motion";
import { MdOutlineStop } from "react-icons/md";
import CountdownTimer from "./CountdownTimer.jsx";
import Button from "../../../components/ui/Button.jsx";

const SessionHeader = ({
  questionIndex,
  totalQuestions,
  timeLimit,
  onTimeout,
  onAbandon,
  paused,
}) => {
  const progress = ((questionIndex - 1) / totalQuestions) * 100;

  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Question counter */}
      <div className="flex flex-col gap-1 min-w-[120px]">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Question {questionIndex} of {totalQuestions}
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
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Timer */}
      <CountdownTimer
        seconds={timeLimit}
        onTimeout={onTimeout}
        paused={paused}
      />

      {/* End button */}
      <Button
        variant="danger"
        size="sm"
        onClick={onAbandon}
        className="gap-1.5"
      >
        <MdOutlineStop size={14} />
        End
      </Button>
    </div>
  );
};

export default SessionHeader;
