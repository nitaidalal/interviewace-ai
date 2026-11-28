import { motion, AnimatePresence } from "framer-motion";

const WaveBar = ({ delay, large }) => (
  <motion.div
    className="rounded-full"
    style={{
      backgroundColor: "var(--color-primary)",
      width: large ? "4px" : "3px",
    }}
    animate={{
      height: large ? ["12px", "48px", "12px"] : ["8px", "28px", "8px"],
    }}
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

const AIPresenter = ({ aiState = "idle", large = false }) => {
  const avatarSize = large ? "w-32 h-32" : "w-20 h-20";
  const waveCount = large ? 11 : 9;

  if (large) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="/interviewAceAi-image.png"
          alt="AI Interviewer"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/60 px-2 py-1 text-sm font-medium text-white">
          <motion.span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: aiState === "speaking"
              ? "var(--color-primary)"
              : aiState === "listening"
                ? "var(--color-success)"
                : aiState === "thinking"
                  ? "var(--color-warning)"
                  : "var(--color-text-muted)" }}
            animate={aiState !== "idle" ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          {STATE_LABELS[aiState]}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="relative flex items-center justify-center w-full">
        {/* Wave bars */}
        <AnimatePresence>
          {aiState === "speaking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute flex items-end justify-center w-full"
              style={{
                gap: large ? "4px" : "3px",
                height: large ? "80px" : "50px",
              }}
            >
              {Array.from({ length: waveCount }, (_, i) => {
                const mid = Math.floor(waveCount / 2);
                const dist = Math.abs(i - mid);
                const delay = dist * 0.08;
                return <WaveBar key={i} delay={delay} large={large} />;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Avatar circle */}
        <motion.div
          animate={
            aiState === "thinking"
              ? { scale: [1, 1.06, 1], opacity: [1, 0.7, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={
            aiState === "thinking" ? { duration: 1.5, repeat: Infinity } : {}
          }
          className={`relative z-10 ${avatarSize} rounded-full flex items-center
            justify-center`}
          style={{
            boxShadow:
              aiState === "speaking"
                ? "0 0 40px color-mix(in srgb, var(--color-primary) 50%, transparent)"
                : "0 4px 24px rgba(0,0,0,0.25)",
          }}
        >
          <img
            src="/interviewAceAi-image.png"
            alt="AI Interviewer"
          />
        </motion.div>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={aiState}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5"
        >
          <motion.div
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
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {STATE_LABELS[aiState]}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AIPresenter;
