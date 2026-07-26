import { motion as Motion } from "framer-motion";
import {
  MdOutlineVideoCall,
  MdOutlineDescription,
  MdOutlineCode,
} from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";

const features = [
  {
    icon: MdOutlineVideoCall,
    title: "AI Mock Interview",
    description:
      "Practice with an adaptive AI interviewer that asks follow-up questions based on your answers. HR and technical rounds for multiple roles.",
    points: [
      "Adaptive follow-up questions",
      "Voice & text answers",
      "Real-time evaluation",
    ],
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: MdOutlineDescription,
    title: "ATS Resume Analyzer",
    description:
      "Upload your resume and get an AI-powered analysis with actionable feedback to improve your chances of passing ATS filters.",
    points: [
      "ATS compatibility score",
      "Section-by-section feedback",
      "Keyword optimization",
    ],
    gradient: "from-orange-400 to-rose-500",
  },
  {
    icon: MdOutlineCode,
    title: "Coding Practice",
    description:
      "Solve real interview coding problems and get AI feedback on your logic, code quality, and best practices — just like a real interviewer.",
    points: ["JavaScript, Python, SQL", "Run code instantly", "AI code review"],
    gradient: "from-amber-500 to-orange-600",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 40 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-24 px-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Everything You Need
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Three modules. <span className="text-gradient">One platform.</span>
          </Motion.h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="rounded-2xl p-6 flex flex-col gap-4 cursor-default"
              style={{
                backgroundColor: "var(--color-bg)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.gradient}`}
              >
                <feature.icon size={24} className="text-white" />
              </div>

              {/* Content */}
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {feature.description}
                </p>
              </div>

              {/* Points */}
              <ul className="flex flex-col gap-2 mt-auto">
                {feature.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
