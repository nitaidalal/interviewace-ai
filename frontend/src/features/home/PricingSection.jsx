import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HiCheck, HiX } from "react-icons/hi";
import { HiSparkles } from "react-icons/hi2";
import { RiCoinLine } from "react-icons/ri";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { ROUTES, PRICING, CREDIT_COSTS } from "../../utils/constants.js";

const freeFeatures = [
  { text: "100 credits / month", included: true },
  { text: "20 credits daily limit", included: true },
  { text: "5 questions per interview", included: true },
  { text: "AI Mock Interview", included: true },
  { text: "ATS Resume Analyzer", included: true },
  { text: "Coding Practice", included: true },
  { text: "Voice Interview", included: true },
  { text: "Full Analytics", included: false },
  { text: "Priority AI Response", included: false },
  { text: "Premium Voice (ElevenLabs)", included: false },
];

const proFeatures = [
  { text: "1500 credits / month", included: true },
  { text: "100 credits daily limit", included: true },
  { text: "10 questions per interview", included: true },
  { text: "AI Mock Interview", included: true },
  { text: "ATS Resume Analyzer", included: true },
  { text: "Coding Practice", included: true },
  { text: "Voice Interview", included: true },
  { text: "Full Analytics", included: true },
  { text: "Priority AI Response", included: true },
  { text: "Premium Voice (coming soon)", included: true },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");

  const proPrice =
    billing === "monthly" ? PRICING.pro.monthly : PRICING.pro.sixMonths;

  return (
    <section
      id="pricing"
      className="py-24 px-4"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest mb-3"
            style={{ color: "var(--color-primary)" }}
          >
            Pricing
          </Motion.p>
          <Motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--color-text-primary)" }}
          >
            Simple, <span className="text-gradient">transparent pricing</span>
          </Motion.h2>
          <Motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Start free. Upgrade when you're ready.
          </Motion.p>
        </div>

        {/* Credit costs info */}
        <Motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-10"
        >
          {[
            { label: "AI Interview", cost: CREDIT_COSTS.INTERVIEW },
            { label: "ATS Analysis", cost: CREDIT_COSTS.ATS_ANALYSIS },
            { label: "Coding Submit", cost: CREDIT_COSTS.CODING_SUBMISSION },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm border"
              style={{
                borderColor: "var(--color-border)",
                color: "var(--color-text-secondary)",
                backgroundColor: "var(--color-bg)",
              }}
            >
              <RiCoinLine style={{ color: "var(--color-primary)" }} />
              <span>{item.label}</span>
              <span
                className="font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {item.cost} credits
              </span>
            </div>
          ))}
        </Motion.div>

        {/* Billing toggle */}
        <Motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span
            className="text-sm font-medium"
            style={{
              color:
                billing === "monthly"
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
            }}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBilling((b) => (b === "monthly" ? "sixMonths" : "monthly"))
            }
            className="relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer"
            style={{
              backgroundColor:
                billing === "sixMonths"
                  ? "var(--color-primary)"
                  : "var(--color-border)",
            }}
          >
            <Motion.div
              animate={{ x: billing === "sixMonths" ? 24 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
            />
          </button>
          <span
            className="text-sm font-medium flex items-center gap-2"
            style={{
              color:
                billing === "sixMonths"
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
            }}
          >
            6 Months
            {billing === "sixMonths" && (
              <Badge variant="success">
                Save {PRICING.pro.sixMonths.savings}
              </Badge>
            )}
          </span>
        </Motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free Card */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 flex flex-col"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="mb-6">
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--color-text-muted)" }}
              >
                Free
              </p>
              <div className="flex items-end gap-1 mb-1">
                <span
                  className="text-4xl font-bold"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  ₹0
                </span>
                <span
                  className="text-sm mb-1.5"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  /forever
                </span>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Start practicing today. No card needed.
              </p>
            </div>

            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate(ROUTES.REGISTER)}
              className="mb-6"
            >
              Get Started Free
            </Button>

            <ul className="flex flex-col gap-3">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  {f.included ? (
                    <HiCheck
                      size={16}
                      style={{ color: "var(--color-success)", flexShrink: 0 }}
                    />
                  ) : (
                    <HiX
                      size={16}
                      style={{
                        color: "var(--color-text-muted)",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <span
                    style={{
                      color: f.included
                        ? "var(--color-text-primary)"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </Motion.div>

          {/* Pro Card */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
            style={{
              backgroundColor: "var(--color-bg)",
              border: "2px solid var(--color-primary)",
              boxShadow:
                "0 0 40px color-mix(in srgb, var(--color-primary) 15%, transparent)",
            }}
          >
            {/* Popular badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="primary" className="flex items-center gap-1">
                <HiSparkles size={10} />
                Most Popular
              </Badge>
            </div>

            <div className="mb-6">
              <p
                className="text-sm font-medium mb-1"
                style={{ color: "var(--color-primary)" }}
              >
                Pro
              </p>

              <AnimatePresence mode="wait">
                <Motion.div
                  key={billing}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-end gap-1 mb-1">
                    <span
                      className="text-4xl font-bold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {billing === "monthly" ? "₹299" : "₹999"}
                    </span>
                    <span
                      className="text-sm mb-1.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {billing === "monthly" ? "/month" : "/6 months"}
                    </span>
                  </div>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {billing === "monthly"
                      ? "Serious about your next offer? Go Pro."
                      : `${proPrice.perMonth} · Best value for placement season.`}
                  </p>
                </Motion.div>
              </AnimatePresence>
            </div>

            <Button
              fullWidth
              onClick={() => navigate(ROUTES.REGISTER)}
              className="mb-6"
            >
              Upgrade to Pro
            </Button>

            <ul className="flex flex-col gap-3">
              {proFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <HiCheck
                    size={16}
                    style={{ color: "var(--color-success)", flexShrink: 0 }}
                  />
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {f.text}
                  </span>
                </li>
              ))}
            </ul>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
