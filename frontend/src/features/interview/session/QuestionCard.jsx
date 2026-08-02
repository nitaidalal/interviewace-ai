import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineCode } from "react-icons/md";
import Badge from "../../../components/ui/Badge.jsx";

const QuestionCard = ({ question, index, total, isCoding, codingLanguage }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.35 }}
        className="p-6 rounded-2xl"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Q label */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-primary)" }}
          >
            Question {index}
          </span>
          {isCoding && (
            <Badge variant="warning" className="flex items-center gap-1">
              <MdOutlineCode size={11} />
              Coding — {codingLanguage}
            </Badge>
          )}
        </div>

        {/* Question text */}
        <p
          className="text-base leading-relaxed font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {question}
        </p>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuestionCard;
