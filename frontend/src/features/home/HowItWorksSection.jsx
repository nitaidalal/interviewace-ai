import { motion as Motion } from "framer-motion";
import {
  HiOutlineUserAdd,
  HiOutlineAdjustments,
  HiOutlineChartBar,
} from "react-icons/hi";

const steps = [
  {
    number: "01",
    icon: HiOutlineUserAdd,
    title: "Create Your Account",
    description:
      "Sign up for free in under 2 minutes. No credit card required. Get 100 credits to start practicing immediately.",
  },
  {
    number: "02",
    icon: HiOutlineAdjustments,
    title: "Set Up Your Interview",
    description:
      "Choose your role, tech stack, experience level and difficulty. The AI tailors every question specifically to your profile.",
  },
  {
    number: "03",
    icon: HiOutlineChartBar,
    title: "Practice & Improve",
    description:
      "Get detailed feedback after every session. Track your progress, identify weak areas, and watch your scores improve over time.",
  },
];

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Simple Process
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Get interview-ready{" "}
            <span className="text-gradient">in 3 steps</span>
          </Motion.h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop only */}
          <div
            className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px"
            style={{ backgroundColor: "var(--color-border)" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <Motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Step number circle */}
                <div className="relative z-10">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center
                      border-2 relative"
                    style={{
                      backgroundColor: "var(--color-bg)",
                      borderColor: "var(--color-primary)",
                    }}
                  >
                    <step.icon
                      size={28}
                      style={{ color: "var(--color-primary)" }}
                    />
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                        flex items-center justify-center text-xs font-bold text-white
                        bg-brand-gradient"
                    >
                      {i + 1}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {step.description}
                  </p>
                </div>
              </Motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
