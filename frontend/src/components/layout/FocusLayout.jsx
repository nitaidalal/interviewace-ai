import { useCallback, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineClose } from "react-icons/md";
import { HiArrowLeft } from "react-icons/hi";
import { ROUTES } from "../../utils/constants.js";

const FocusLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [exitPath, setExitPath] = useState(null);
  const cancelExit = useCallback(() => setExitPath(null), []);

  const handleExit = () => {
    if (location.pathname.endsWith("/session")) {
      setExitPath(location.pathname);
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const isSessionPage = location.pathname.includes("/session");

  return (
    <div
      className={isSessionPage ? "h-dvh flex flex-col overflow-hidden" : "min-h-screen flex flex-col"}
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
      <main className={isSessionPage ? "flex-1 min-h-0 overflow-hidden" : "flex-1 overflow-y-auto"}>
        <div className={isSessionPage ? "h-full" : "max-w-4xl mx-auto px-4 py-6"}>
          <Outlet context={{ exitRequested: exitPath === location.pathname, cancelExit }} />
        </div>
      </main>

    </div>
  );
};

export default FocusLayout;
