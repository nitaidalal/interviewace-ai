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

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="min-h-screen flex items-center justify-center pt-16  px-4 relative overflow-hidden"
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

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Badge */}
        <Motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            text-sm font-medium mb-6 border"
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
          Ace Your Next <span className="text-gradient">Tech Interview</span>{" "}
          with AI
        </Motion.h1>

        {/* Subheadline */}
        <Motion.p
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Practice real interviews with adaptive AI. Get instant feedback,
          analyze your resume, and sharpen your coding skills — all in one
          platform.
        </Motion.p>

        {/* CTAs */}
        <Motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
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
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          No credit card required · Free plan available · Setup in 2 minutes
        </Motion.p>
      </div>
    </section>
  );
};

export default HeroSection;
