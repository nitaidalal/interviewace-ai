import { useState } from "react";

import { HiSparkles, HiShieldCheck } from "react-icons/hi2";

import { HiCheck, HiRefresh } from "react-icons/hi";

import Button from "../components/ui/Button.jsx";
import Badge from "../components/ui/Badge.jsx";
import Spinner from "../components/ui/Spinner.jsx";

import usePayment from "../hooks/usePayment.js";

const formatMoney = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount / 100);

const formatDate = (date) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const panelStyle = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl p-5" style={panelStyle}>
    <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>
      {label}
    </p>

    <p
      className="text-2xl font-bold"
      style={{ color: "var(--color-text-primary)" }}
    >
      {value}
    </p>
  </div>
);

const BillingPage = () => {
  const {
    user,
    plans,
    payments,
    credits,
    loading,
    busy,
    activeCycle,
    checkingOrderId,
    purchasePlan,
    checkPaymentStatus,
    fetchBilling,
  } = usePayment();

  const [billingCycle, setBillingCycle] = useState("monthly");

  const selectedPlan = plans.find((plan) => plan.billingCycle === billingCycle);

  const isPro = credits?.plan === "pro";

  const monthlyPlan = plans.find((plan) => plan.billingCycle === "monthly");

  const sixMonthsPlan = plans.find((plan) => plan.billingCycle === "6months");

  const savings =
    monthlyPlan && sixMonthsPlan
      ? monthlyPlan.amount * 6 - sixMonthsPlan.amount
      : 0;

  const features = selectedPlan
    ? [
        `${selectedPlan.totalCredits.toLocaleString("en-IN")} purchased credits`,
        `${selectedPlan.dailyLimit} credits daily limit`,
        "10 questions per interview",
        "AI mock interview",
        "ATS resume analyzer",
        "Voice interview and coding questions",
        "No automatic recurring debit",
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-bold mb-2"
            style={{
              color: "var(--color-text-primary)",
            }}
          >
            Billing & Subscription
          </h1>

          <p
            className="text-sm"
            style={{
              color: "var(--color-text-secondary)",
            }}
          >
            Manage your subscription, credits and payment history.
          </p>
        </div>

        <Button variant="secondary" onClick={fetchBilling} disabled={busy}>
          <HiRefresh size={17} />
          Refresh
        </Button>
      </div>

      {/* Current plan */}

      <div className="rounded-2xl p-6" style={panelStyle}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p
              className="text-sm mb-2"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              Current subscription
            </p>

            <div className="flex items-center gap-3">
              <h2
                className="text-2xl font-bold"
                style={{
                  color: "var(--color-text-primary)",
                }}
              >
                {credits ? (isPro ? "Pro Plan" : "Free Plan") : "Unavailable"}
              </h2>

              {credits && (
                <Badge variant={isPro ? "success" : "primary"}>
                  {isPro ? "Pro" : "Free"}
                </Badge>
              )}
            </div>
          </div>

          {isPro && (
            <div>
              <p
                className="text-xs"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                Access expires on
              </p>

              <p
                className="font-semibold mt-1"
                style={{
                  color: "var(--color-text-primary)",
                }}
              >
                {formatDate(credits.expiresAt)}
              </p>
            </div>
          )}
        </div>

        {credits && (
          <p
            className="text-sm mt-4"
            style={{
              color: "var(--color-text-secondary)",
            }}
          >
            {isPro
              ? "Your Pro features are unlocked. You can manually renew your access below."
              : "Upgrade to Pro for more credits and longer interviews."}
          </p>
        )}
      </div>

      {/* Credit statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Remaining Credits"
          value={credits?.remainingCredits ?? "—"}
        />

        <StatCard
          label="Daily Credits Used"
          value={
            credits
              ? `${credits.dailyCreditsUsed} / ${credits.dailyLimit}`
              : "—"
          }
        />

        <StatCard
          label="Daily Credits Available"
          value={credits?.dailyRemaining ?? "—"}
        />
      </div>

      {/* Plan selector */}

      <div>
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--color-text-primary)",
          }}
        >
          {isPro ? "Renew your plan" : "Upgrade to Pro"}
        </h2>

        <div
          className="inline-flex rounded-xl p-1 gap-1 mb-5"
          style={panelStyle}
        >
          {[
            { id: "monthly", label: "Monthly" },
            { id: "6months", label: "6 Months" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              disabled={busy}
              onClick={() => setBillingCycle(option.id)}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor:
                  billingCycle === option.id
                    ? "var(--color-primary)"
                    : "transparent",

                color:
                  billingCycle === option.id
                    ? "#ffffff"
                    : "var(--color-text-secondary)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {!selectedPlan ? (
          <p
            className="text-sm"
            style={{
              color: "var(--color-text-muted)",
            }}
          >
            Payment plans are unavailable. Please refresh the page.
          </p>
        ) : (
          <div
            className="rounded-2xl p-6 md:p-8 max-w-xl"
            style={{
              ...panelStyle,
              border: "2px solid var(--color-primary)",
            }}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <HiSparkles size={24} style={{ color: "#f97316" }} />

                <h3
                  className="text-xl font-bold"
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  {selectedPlan.name}
                </h3>
              </div>

              {billingCycle === "6months" && savings > 0 && (
                <Badge variant="success">Save {formatMoney(savings)}</Badge>
              )}
            </div>

            <div className="flex items-end gap-2 mb-2">
              <span
                className="text-4xl font-bold"
                style={{
                  color: "var(--color-text-primary)",
                }}
              >
                {formatMoney(selectedPlan.amount)}
              </span>

              <span
                className="text-sm pb-1"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                / {selectedPlan.validityDays} days
              </span>
            </div>

            <p
              className="text-sm mb-6"
              style={{
                color: "var(--color-text-secondary)",
              }}
            >
              One-time payment. No automatic renewal.
            </p>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm"
                  style={{
                    color: "var(--color-text-primary)",
                  }}
                >
                  <HiCheck
                    size={18}
                    style={{
                      color: "var(--color-success)",
                      flexShrink: 0,
                    }}
                  />

                  {feature}
                </li>
              ))}
            </ul>

            {isPro && (
              <p
                className="text-sm mb-4"
                style={{
                  color: "var(--color-text-secondary)",
                }}
              >
                Renewal adds purchased credits and extends your existing Pro
                validity.
              </p>
            )}

            <Button
              fullWidth
              size="lg"
              disabled={busy || !user}
              loading={busy && activeCycle === billingCycle}
              onClick={() => purchasePlan(billingCycle)}
            >
              {isPro ? "Renew Pro" : "Purchase Pro"}
              {" — "}
              {formatMoney(selectedPlan.amount)}
            </Button>

            <p
              className="flex items-center justify-center gap-2 text-xs mt-4"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              <HiShieldCheck size={16} />
              Secure Checkout powered by Razorpay
            </p>
          </div>
        )}
      </div>

      {/* Payment history */}

      <div>
        <h2
          className="text-xl font-bold mb-4"
          style={{
            color: "var(--color-text-primary)",
          }}
        >
          Payment History
        </h2>

        {payments.some((payment) => payment.status !== "paid") && (
          <p
            className="text-sm mb-4"
            style={{ color: "var(--color-text-muted)" }}
          >
            Unpaid means payment has not been confirmed for this order. Creating
            an order does not deduct money. If you paid, use Check Status before
            paying again.
          </p>
        )}

        {payments.length === 0 ? (
          <div className="rounded-2xl p-10 text-center" style={panelStyle}>
            <p
              className="font-semibold mb-1"
              style={{
                color: "var(--color-text-primary)",
              }}
            >
              No payments yet
            </p>

            <p
              className="text-sm"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              Your payment history will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl overflow-x-auto" style={panelStyle}>
            <table className="w-full text-sm text-left">
              <thead
                style={{
                  backgroundColor: "var(--color-bg)",
                  color: "var(--color-text-muted)",
                }}
              >
                <tr>
                  {[
                    "Plan",
                    "Amount",
                    "Date",
                    "Status",
                    "Payment ID",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="p-4 font-medium whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment._id}
                    style={{
                      borderTop: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                    }}
                  >
                    <td className="p-4 whitespace-nowrap">
                      {payment.billingCycle === "monthly"
                        ? "Pro Monthly"
                        : "Pro Six Months"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatMoney(payment.amount, payment.currency)}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {formatDate(payment.paidAt || payment.createdAt)}
                    </td>

                    <td className="p-4">
                      <Badge
                        variant={
                          payment.status === "paid" ? "success" : "warning"
                        }
                      >
                        {payment.status === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>

                    <td className="p-4 text-xs whitespace-nowrap">
                      {payment.razorpayPaymentId || "—"}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {payment.status !== "paid" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={busy}
                          loading={checkingOrderId === payment.razorpayOrderId}
                          onClick={() =>
                            checkPaymentStatus(payment.razorpayOrderId)
                          }
                        >
                          Check Status
                        </Button>
                      ) : (
                        <span
                          className="text-xs"
                          style={{
                            color: "var(--color-text-muted)",
                          }}
                        >
                          Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
