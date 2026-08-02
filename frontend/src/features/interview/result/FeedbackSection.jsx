import { motion } from "framer-motion";
import { HiCheck, HiX, HiLightBulb } from "react-icons/hi";

const FeedbackList = ({ title, items, icon: Icon, color, delay }) => {
  if (!items?.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-3"
    >
      <h4
        className="text-sm font-semibold flex items-center gap-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        <Icon size={16} style={{ color }} />
        {title}
      </h4>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.05 }}
            className="flex items-start gap-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: color }}
            />
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const FeedbackSection = ({ strengths, weaknesses, suggestions }) => {
  return (
    <div
      className="p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <FeedbackList
        title="Strengths"
        items={strengths}
        icon={HiCheck}
        color="var(--color-success)"
        delay={0.5}
      />
      <FeedbackList
        title="Weaknesses"
        items={weaknesses}
        icon={HiX}
        color="var(--color-danger)"
        delay={0.6}
      />
      <FeedbackList
        title="Suggestions"
        items={suggestions}
        icon={HiLightBulb}
        color="var(--color-warning)"
        delay={0.7}
      />
    </div>
  );
};

export default FeedbackSection;
