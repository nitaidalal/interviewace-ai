import {motion as Motion } from "framer-motion";
import { MdOutlineDescription, MdOutlineArrowForward } from "react-icons/md";

const getScoreColor = (score) => {
  if (score >= 80) return "var(--color-success)";
  if (score >= 60) return "var(--color-warning)";
  if (score >= 40) return "var(--color-primary)";
  return "var(--color-danger)";
};

const ATSHistoryList = ({ history, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-2xl animate-pulse"
            style={{ backgroundColor: "var(--color-surface)" }}
          />
        ))}
      </div>
    );
  }

  if (!history?.length) {
    return (
      <div
        className="py-10 text-center rounded-2xl"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <MdOutlineDescription
          size={36}
          className="mx-auto mb-3"
          style={{ color: "var(--color-text-muted)" }}
        />
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          No previous analyses
        </p>
        <p
          className="text-xs mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          Upload your resume to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {history.map((item, i) => {
        const color = getScoreColor(item.atsScore);
        return (
          <Motion.div
            key={item._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(item._id)}
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer
              transition-all duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Score badge */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center
                shrink-0 text-white font-bold text-sm"
              style={{ backgroundColor: color }}
            >
              {item.atsScore}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                Resume Analysis
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--color-text-muted)" }}
              >
                {new Date(item.analyzedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <MdOutlineArrowForward
              size={18}
              style={{ color: "var(--color-text-muted)" }}
            />
          </Motion.div>
        );
      })}
    </div>
  );
};

export default ATSHistoryList;
