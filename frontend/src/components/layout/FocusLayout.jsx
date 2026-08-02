import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {motion as Motion, AnimatePresence } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineClose, MdOutlineWarning } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { ROUTES } from "../../utils/constants.js";

const WARN_ON_EXIT_ROUTES = ["/session"];

const shouldWarnOnExit = (pathname) =>
  WARN_ON_EXIT_ROUTES.some((r) => pathname.includes(r));

const ExitWarningModal = ({ onConfirm, onCancel }) => (
  <AnimatePresence>
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
    >
      <Motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center
            mb-4 mx-auto"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--color-warning) 15%, transparent)",
          }}
        >
          <MdOutlineWarning
            size={24}
            style={{ color: "var(--color-warning)" }}
          />
        </div>

        <h3
          className="text-lg font-bold text-center mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Leave Interview?
        </h3>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Your interview is still in progress. Leaving now will abandon your
          session. Credits will be refunded only if no answers were submitted.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
              cursor-pointer transition-colors duration-200"
            style={{
              backgroundColor: "var(--color-surface-hover)",
              color: "var(--color-text-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            Stay
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
              cursor-pointer transition-colors duration-200 text-white"
            style={{ backgroundColor: "var(--color-danger)" }}
          >
            Leave
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  </AnimatePresence>
);

const FocusLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showWarning, setShowWarning] = useState(false);

  const handleExit = () => {
    if (shouldWarnOnExit(location.pathname)) {
      setShowWarning(true);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleConfirmExit = () => {
    setShowWarning(false);
    navigate(ROUTES.DASHBOARD);
  };

  const isSessionPage = location.pathname.includes("/session");

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Minimal top bar */}
      <Motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between px-6 h-14 shrink-0"
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleExit}
        >
          <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center">
            <HiSparkles className="text-white text-xs" />
          </div>
          <span className="font-bold text-sm text-gradient hidden sm:block">
            AceInterviewAI
          </span>
        </div>

        {/* Center label — session only */}
        {isSessionPage && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <Motion.div
              className="w-2 h-2 rounded-full bg-red-500"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Interview in progress
            </span>
          </Motion.div>
        )}

        {/* Exit button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-sm font-medium cursor-pointer transition-all duration-200"
          style={{
            color: isSessionPage
              ? "var(--color-danger)"
              : "var(--color-text-secondary)",
            backgroundColor: isSessionPage
              ? "color-mix(in srgb, var(--color-danger) 10%, transparent)"
              : "transparent",
            border: `1px solid ${
              isSessionPage
                ? "color-mix(in srgb, var(--color-danger) 30%, transparent)"
                : "var(--color-border)"
            }`,
          }}
        >
          {isSessionPage ? (
            <>
              <MdOutlineClose size={15} />
              Exit Session
            </>
          ) : (
            <>
              <HiArrowLeft size={15} />
              Back to Dashboard
            </>
          )}
        </button>
      </Motion.header>

      {/* Page content — full width */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>

      {/* Exit warning modal */}
      {showWarning && (
        <ExitWarningModal
          onConfirm={handleConfirmExit}
          onCancel={() => setShowWarning(false)}
        />
      )}
    </div>
  );
};

export default FocusLayout;