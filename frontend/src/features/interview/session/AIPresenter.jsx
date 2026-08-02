import { motion as Motion, AnimatePresence } from "framer-motion";
import { MdOutlineSmartToy } from "react-icons/md";

const WaveBar = ({ delay }) => (
  <Motion.div
    className="w-1 rounded-full"
    style={{ backgroundColor: "var(--color-primary)" }}
    animate={{ height: ["8px", "28px", "8px"] }}
    transition={{
      duration: 0.8,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

const STATE_LABELS = {
  speaking: "AI Speaking...",
  listening: "AI Listening...",
  thinking: "AI Thinking...",
  idle: "Ready",
};

const AIPresenter = ({ aiState = "idle" }) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar container */}
      <div className="relative flex items-center justify-center">
        {/* Wave bars behind avatar — speaking state */}
        <AnimatePresence>
          {aiState === "speaking" && (
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute flex items-center gap-1"
              style={{ gap: "3px" }}
            >
              {[0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0].map((delay, i) => (
                <WaveBar key={i} delay={delay} />
              ))}
            </Motion.div>
          )}
        </AnimatePresence>

        {/* Avatar circle */}
        <Motion.div
          animate={
            aiState === "thinking"
              ? { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            aiState === "thinking" ? { duration: 1.5, repeat: Infinity } : {}
          }
          className="relative z-10 w-40 h-40 rounded-full flex items-center
            justify-center  shadow-lg"
          style={{
            boxShadow:
              aiState === "speaking"
                ? "0 0 50px color-mix(in srgb, var(--color-primary) 60%, transparent)"
                : "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* <MdOutlineSmartToy size={36} className="text-white" /> */}
          <img src="/interviewAceAi-image.png" alt="ai-logo" />
        </Motion.div>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <Motion.div
          key={aiState}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5"
        >
          {/* Status dot */}
          <Motion.div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor:
                aiState === "speaking"
                  ? "var(--color-primary)"
                  : aiState === "listening"
                    ? "var(--color-success)"
                    : aiState === "thinking"
                      ? "var(--color-warning)"
                      : "var(--color-text-muted)",
            }}
            animate={aiState !== "idle" ? { scale: [1, 1.4, 1] } : { scale: 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {STATE_LABELS[aiState]}
          </span>
        </Motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AIPresenter;
