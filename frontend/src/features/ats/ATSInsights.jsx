import {motion as  Motion } from "framer-motion";
import { HiCheck, HiArrowUp } from "react-icons/hi";
import { MdOutlineLabel } from "react-icons/md";

const InsightList = ({ title, items, icon: Icon, color, delay }) => {
  if (!items?.length) return null;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex flex-col gap-3 p-5 rounded-2xl"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
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
          <Motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + i * 0.06 }}
            className="flex items-start gap-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
              style={{ backgroundColor: color }}
            />
            {item}
          </Motion.li>
        ))}
      </ul>
    </Motion.div>
  );
};

const ATSInsights = ({ strengths, improvements, missingKeywords }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightList
          title="Strengths"
          items={strengths}
          icon={HiCheck}
          color="var(--color-success)"
          delay={0.2}
        />
        <InsightList
          title="Improvements"
          items={improvements}
          icon={HiArrowUp}
          color="var(--color-warning)"
          delay={0.3}
        />
      </div>

      {/* Missing Keywords */}
      {missingKeywords?.length > 0 && (
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h4
            className="text-sm font-semibold flex items-center gap-2 mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            <MdOutlineLabel
              size={16}
              style={{ color: "var(--color-primary)" }}
            />
            Missing Keywords to Add
          </h4>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw, i) => (
              <Motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                  border:
                    "1px solid color-mix(in srgb, var(--color-primary) 25%, transparent)",
                }}
              >
                {kw}
              </Motion.span>
            ))}
          </div>
        </Motion.div>
      )}
    </div>
  );
};

export default ATSInsights;
