import { motion as Motion } from "framer-Motion";
import { HiCheck } from "react-icons/hi";
import { MdOutlineTimer } from "react-icons/md";

const difficulties = [
  {
    value: "easy",
    label: "Easy",
    color: "#22C55E",
    timePerQ: "60s per question",
    codingTime: "5 min for coding",
    description: "Fundamental concepts, beginner-friendly questions.",
    emoji: "🟢",
  },
  {
    value: "medium",
    label: "Medium",
    color: "#F59E0B",
    timePerQ: "90s per question",
    codingTime: "10 min for coding",
    description: "Intermediate depth, real-world scenarios.",
    emoji: "🟡",
  },
  {
    value: "hard",
    label: "Hard",
    color: "#EF4444",
    timePerQ: "120s per question",
    codingTime: "15 min for coding",
    description: "Advanced concepts, system design, edge cases.",
    emoji: "🔴",
  },
];

const DifficultySelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {difficulties.map((diff, i) => {
        const isSelected = selected === diff.value;
        return (
          <Motion.div
            key={diff.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(diff.value)}
            className="relative p-5 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              border: `2px solid ${isSelected ? diff.color : "var(--color-border)"}`,
              boxShadow: isSelected ? `0 0 20px ${diff.color}30` : "none",
            }}
          >
            {isSelected && (
              <Motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full
                  flex items-center justify-center"
                style={{ backgroundColor: diff.color }}
              >
                <HiCheck size={10} className="text-white" />
              </Motion.div>
            )}

            <div className="text-2xl mb-3">{diff.emoji}</div>

            <h3
              className="text-base font-bold mb-1"
              style={{ color: diff.color }}
            >
              {diff.label}
            </h3>

            <p
              className="text-xs leading-relaxed mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {diff.description}
            </p>

            <div className="flex flex-col gap-1.5">
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                <MdOutlineTimer size={13} />
                {diff.timePerQ}
              </div>
              <div
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                <MdOutlineTimer size={13} />
                {diff.codingTime}
              </div>
            </div>
          </Motion.div>
        );
      })}
    </div>
  );
};

export default DifficultySelector;
