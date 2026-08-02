import { motion as Motion } from "framer-motion";
import { MdOutlinePeople, MdOutlineCode } from "react-icons/md";
import { HiCheck } from "react-icons/hi";

const modes = [
  {
    value: "hr",
    label: "HR Interview",
    description:
      "Behavioral, situational, communication, and personality questions.",
    icon: MdOutlinePeople,
    tags: ["Communication", "Teamwork", "Problem Solving"],
  },
  {
    value: "technical",
    label: "Technical Interview",
    description:
      "Role-specific technical questions based on your stack and experience.",
    icon: MdOutlineCode,
    tags: ["DSA", "System Design", "Coding"],
  },
];

const ModeSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {modes.map((mode, i) => {
        const isSelected = selected === mode.value;
        return (
          <Motion.div
            key={mode.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mode.value)}
            className="relative p-6 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              border: `2px solid ${
                isSelected ? "var(--color-primary)" : "var(--color-border)"
              }`,
              boxShadow: isSelected
                ? "0 0 20px color-mix(in srgb, var(--color-primary) 20%, transparent)"
                : "none",
            }}
          >
            {/* Selected check */}
            {isSelected && (
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full
                  flex items-center justify-center bg-brand-gradient"
              >
                <HiCheck size={12} className="text-white" />
              </Motion.div>
            )}

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
                mb-4 bg-brand-gradient"
            >
              <mode.icon size={24} className="text-white" />
            </div>

            {/* Content */}
            <h3
              className="text-base font-semibold mb-2"
              style={{ color: "var(--color-text-primary)" }}
            >
              {mode.label}
            </h3>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {mode.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {mode.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--color-surface-hover)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Motion.div>
        );
      })}
    </div>
  );
};

export default ModeSelector;
