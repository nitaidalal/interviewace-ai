import { motion as Motion} from "framer-motion";
import { MdOutlineSmartToy } from "react-icons/md";
import Badge from "../../../components/ui/Badge.jsx";

const FeedbackBubble = ({ feedback, score }) => {
  if (!feedback) return null;

  const getScoreVariant = (s) => {
    if (s >= 8) return "success";
    if (s >= 5) return "warning";
    return "danger";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-3"
    >
      {/* AI avatar small */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center
          shrink-0 bg-brand-gradient mt-0.5"
      >
        <MdOutlineSmartToy size={16} className="text-white" />
      </div>

      {/* Bubble */}
      <div
        className="flex-1 rounded-2xl rounded-tl-none px-4 py-3"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            AI Feedback
          </span>
          {score !== undefined && (
            <Badge variant={getScoreVariant(score)}>{score}/10</Badge>
          )}
        </div>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-primary)" }}
        >
          {feedback}
        </p>
      </div>
    </motion.div>
  );
};

export default FeedbackBubble;
