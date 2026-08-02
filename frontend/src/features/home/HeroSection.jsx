import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { HiArrowRight, HiPlay } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import Button from "../../components/ui/Button.jsx";
import { ROUTES } from "../../utils/constants.js";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const heroHighlights = [
  "Adaptive interview questions",
  "Instant feedback loops",
  "Realistic coding environment",
];

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen flex items-center pt-16 px-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 8%, transparent), transparent 70%)",
        }}
      />

      <div className="max-w-7xl  mx-auto relative z-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="text-center lg:text-left">
          {/* Badge */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              text-sm  font-medium mb-8 border"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--color-primary) 10%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--color-primary) 30%, transparent)",
              color: "var(--color-primary)",
            }}
          >
            <HiSparkles size={14} />
            Ai-Powered Interview Prep
          </Motion.div>

          {/* Headline */}
          <Motion.h1
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Ace Your Next{" "}
            <span className="text-gradient">Tech Interview</span>{" "}
          </Motion.h1>

          {/* Subheadline */}
          <Motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 mb-10 leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Practice realistic AI interviews, improve your resume, master coding
            rounds, and receive actionable feedback— all in one workspace.
          </Motion.p>

          {/* CTAs */}
          <Motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate(ROUTES.REGISTER)}
              className="gap-2 px-8"
            >
              Get Started Free
              <HiArrowRight size={18} />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                document
                  .querySelector("#how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="gap-2"
            >
              <HiPlay size={18} />
              See How It Works
            </Button>
          </Motion.div>

          {/* Social proof */}
          <Motion.p
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Trusted by aspiring software engineers preparing for
            interviews.
          </Motion.p>
        </div>

        <Motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative mx-auto w-full max-w-xl"
        >
          <div
            className="absolute inset-0 -translate-x-6 translate-y-6 rounded-[2rem] blur-3xl"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 26%, transparent), transparent 70%)",
            }}
          />

          <div
            className="relative overflow-hidden rounded-[2rem] border p-5 sm:p-6 shadow-2xl"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 90%, white), var(--color-bg))",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="absolute inset-0 opacity-60 pointer-events-none">
              <div
                className="absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 24%, transparent), transparent 72%)",
                }}
              />
              <div
                className="absolute -left-16 bottom-0 h-44 w-44 rounded-full blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 72%)",
                }}
              />
            </div>

            <div className="relative grid gap-4">
              <div
                className="flex items-center justify-between rounded-2xl border px-4 py-3"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-bg) 92%, transparent)",
                  borderColor: "var(--color-border)",
                }}
              >
                <div>
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Live AI Coach
                  </p>
                  <p
                    className="text-sm font-medium mt-1"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Interview mode ready
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-white bg-brand-gradient">
                  <span className="h-2 w-2 rounded-full bg-white/90" />
                  Active
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div
                  className="relative overflow-hidden rounded-[1.75rem] border p-6 min-h-[320px] flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--color-media-bg) 88%, var(--color-bg)), var(--color-surface))",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-80"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--color-primary) 20%, transparent), transparent 42%)",
                    }}
                  />
                  <Motion.img
                    src="/interviewAceAi-image.png"
                    alt="AI interview assistant"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative z-10 w-full max-w-[260px] drop-shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {heroHighlights.map((item, index) => (
                    <Motion.div
                      key={item}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.25 + index * 0.08,
                      }}
                      className="rounded-2xl border p-4"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: "var(--color-primary)" }}
                        >
                          <HiSparkles size={18} className="text-white" />
                        </div>
                        <div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: "var(--color-text-primary)" }}
                          >
                            {item}
                          </p>
                          <p
                            className="text-xs mt-1"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            Built to keep the practice session focused and
                            realistic.
                          </p>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
