import { motion as Motion } from "framer-motion";
import { EXPERIENCE_LEVELS } from "../../../utils/constants.js";

const mapYearsToLevel = (years) => {
  const y = parseInt(years) || 0;
  if (y <= 0) return EXPERIENCE_LEVELS[0];
  return (
    EXPERIENCE_LEVELS.find((e) => y >= e.minYears && y <= e.maxYears) ||
    EXPERIENCE_LEVELS[EXPERIENCE_LEVELS.length - 1]
  );
};

const ExperienceSelector = ({ years, onChange }) => {
  const level = mapYearsToLevel(years);

  const handleChange = (e) => {
    const val = Math.max(0, parseInt(e.target.value) || 0);
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto">
      <div className="text-center">
        <p
          className="text-sm mb-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          This helps the AI calibrate question difficulty to your level.
        </p>
      </div>

      {/* Input */}
      <div className="flex flex-col gap-2">
        <label
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          Years of Experience
        </label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={years}
            onChange={handleChange}
            min={0}
            max={50}
            onKeyDown={(e) => {
              if (["-", "e", "+"].includes(e.key)) e.preventDefault();
            }}
            className="input-base w-32 text-lg font-semibold text-center"
            placeholder="0"
          />
          <Motion.div
            key={level.value}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap text-center"
            style={{
              background:
                "linear-gradient(to right, var(--color-primary), var(--color-accent))",
              color: "white",
            }}
          >
            {level.label}
          </Motion.div>
        </div>
      </div>

      {/* Level descriptions */}
      <div className="flex flex-col gap-2">
        {EXPERIENCE_LEVELS.map((lvl) => (
          <div
            key={lvl.value}
            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              backgroundColor:
                level.value === lvl.value
                  ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                  : "transparent",
              border: `1px solid ${
                level.value === lvl.value
                  ? "var(--color-primary)"
                  : "transparent"
              }`,
            }}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0"
              style={{
                backgroundColor:
                  level.value === lvl.value
                    ? "var(--color-primary)"
                    : "var(--color-border)",
              }}
            />
            <span
              className="text-sm font-medium"
              style={{
                color:
                  level.value === lvl.value
                    ? "var(--color-primary)"
                    : "var(--color-text-muted)",
              }}
            >
              {lvl.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export { mapYearsToLevel };
export default ExperienceSelector;
