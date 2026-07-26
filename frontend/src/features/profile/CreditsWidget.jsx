import { motion as Motion } from "framer-motion";
import { RiCoinLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import Button from "../../components/ui/Button.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { ROUTES } from "../../utils/constants.js";

const CreditRow = ({ label, cost }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
      {label}
    </span>
    <span
      className="text-sm font-medium flex items-center gap-1"
      style={{ color: "var(--color-text-primary)" }}
    >
      <RiCoinLine size={13} style={{ color: "var(--color-primary)" }} />
      {cost} credits
    </span>
  </div>
);

const CreditsWidget = ({ credits, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        className="p-6 rounded-2xl animate-pulse"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          height: "280px",
        }}
      />
    );
  }

  if (!credits) return null;

  const isPro = credits.plan === "pro";

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-6 rounded-2xl flex flex-col gap-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className="text-base font-semibold flex items-center gap-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          <RiCoinLine style={{ color: "var(--color-primary)" }} />
          Credits
        </h3>
        <Badge variant={isPro ? "warning" : "muted"}>
          {isPro ? (
            <span className="flex items-center gap-1">
              <HiSparkles size={10} />
              Pro
            </span>
          ) : (
            "Free Plan"
          )}
        </Badge>
      </div>

      {/* Remaining */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Remaining
          </span>
          <span
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {credits.remainingCredits}
            <span
              className="text-sm font-normal ml-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              / {credits.totalCredits}
            </span>
          </span>
        </div>
        <ProgressBar
          value={credits.totalCredits - credits.remainingCredits}
          max={credits.totalCredits}
        />
      </div>

      {/* Daily */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Daily Used
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-primary)" }}
          >
            {credits.dailyCreditsUsed} / {credits.dailyLimit}
          </span>
        </div>
        <ProgressBar
          value={credits.dailyCreditsUsed}
          max={credits.dailyLimit}
        />
      </div>

      {/* Divider */}
      <div style={{ height: "1px", backgroundColor: "var(--color-border)" }} />

      {/* Credit costs */}
      <div className="flex flex-col gap-2">
        <p
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          Credit Costs
        </p>
        <CreditRow label="AI Interview" cost={credits.costs?.INTERVIEW ?? 20} />
        <CreditRow
          label="ATS Analysis"
          cost={credits.costs?.ATS_ANALYSIS ?? 10}
        />
        <CreditRow
          label="Coding Submit"
          cost={credits.costs?.CODING_SUBMISSION ?? 2}
        />
      </div>

      {/* Upgrade CTA */}
      {!isPro && (
        <Button
          fullWidth
          onClick={() => navigate(ROUTES.HOME + "#pricing")}
          className="gap-2"
        >
          <HiSparkles size={15} />
          Upgrade to Pro
        </Button>
      )}

      {isPro && credits.expiresAt && (
        <p
          className="text-xs text-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          Plan expires:{" "}
          {new Date(credits.expiresAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </Motion.div>
  );
};

export default CreditsWidget;
