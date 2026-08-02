import { motion as Motion } from "framer-motion";

const TECHNICAL_STEPS = [
  { id: 1, label: "Mode" },
  { id: 2, label: "Role" },
  { id: 3, label: "Stack" },
  { id: 4, label: "Experience" },
  { id: 5, label: "Difficulty" },
  { id: 6, label: "Resume" },
  { id: 7, label: "Summary" },
];

const HR_STEPS = [
  { id: 1, label: "Mode" },
  { id: 2, label: "Experience" },
  { id: 3, label: "Difficulty" },
  { id: 4, label: "Resume" },
  { id: 5, label: "Summary" },
];

const SetupStepper = ({ currentStep, mode }) => {
  // Skip Role and Stack steps for HR mode
  const visibleSteps = mode === "hr" ? HR_STEPS : TECHNICAL_STEPS;

  return (
    <div className="flex items-center justify-center gap-0 mb-10 flex-wrap">
      {visibleSteps.map((step, i) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center gap-1">
              <Motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: "spring", stiffness: 400 }}
                className="w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-bold transition-all duration-300"
                style={{
                  background:
                    isCompleted || isActive
                      ? "linear-gradient(to right, var(--color-primary), var(--color-accent))"
                      : "var(--color-surface-hover)",
                  color:
                    isCompleted || isActive
                      ? "white"
                      : "var(--color-text-muted)",
                  border: isActive
                    ? "2px solid var(--color-primary)"
                    : "2px solid transparent",
                }}
              >
                {isCompleted ? "✓" : step.id}
              </Motion.div>
              <span
                className="text-xs font-medium hidden sm:block"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : isCompleted
                      ? "var(--color-text-secondary)"
                      : "var(--color-text-muted)",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector */}
            {i < visibleSteps.length - 1 && (
              <div
                className="w-8 sm:w-12 h-0.5 mx-1 mb-5 transition-all duration-500"
                style={{
                  backgroundColor:
                    step.id < currentStep
                      ? "var(--color-primary)"
                      : "var(--color-border)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SetupStepper;
