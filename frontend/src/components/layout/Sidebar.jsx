import { NavLink, useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { HiSparkles, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  MdDashboard,
  MdOutlineVideoCall,
  MdOutlineDescription,
  MdOutlineCode,
  MdOutlinePerson,
  MdOutlineLogout,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import useAuth from "../../hooks/useAuth.js";
import useTheme from "../../hooks/useTheme.js";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";
import { ROUTES } from "../../utils/constants.js";
import { useSelector } from "react-redux";

const navItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: MdDashboard, end: true },
  { label: "AI Interview", href: ROUTES.INTERVIEW, icon: MdOutlineVideoCall },
  { label: "ATS Analyzer", href: ROUTES.ATS, icon: MdOutlineDescription },
  { label: "Practice", href: ROUTES.PROGRAMMING, icon: MdOutlineCode },
  { label: "Profile", href: ROUTES.PROFILE, icon: MdOutlinePerson },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const isPro = user?.subscription?.plan === "pro";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AI";

  return (
    <Motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between px-4 h-16 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {!collapsed && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-lg  flex items-center justify-center shrink-0">
              {/* <HiSparkles className="text-white text-xs" /> */}
              <img src="/interviewAceAi-image.png" alt="ai-logo" />
            </div>
            <span className="font-bold text-sm text-gradient whitespace-nowrap">
              AceInterviewAI
            </span>
          </Motion.div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center mx-auto">
            <HiSparkles className="text-white text-xs" />
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-lg
              transition-all duration-200 group relative
              ${
                isActive
                  ? "bg-brand-gradient text-white shadow-sm"
                    : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }
            `}
          >
            <item.icon size={20} className="shrink-0" />
            {!collapsed && (
              <Motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="text-sm font-medium whitespace-nowrap"
              >
                {item.label}
              </Motion.span>
            )}
            {/* Tooltip on collapsed */}
            {collapsed && (
              <div
                className="absolute left-full ml-2 px-2 py-1 rounded-md text-xs font-medium
                  whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
                  pointer-events-none z-50"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div
        className="px-2 py-3 shrink-0 flex flex-col gap-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* User info */}
        {!collapsed && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 rounded-2xl flex flex-col gap-3"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent)",
              border: "1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-border))",
            }}
          >
            {isLoading ? (
              <div className="flex items-center gap-3 animate-pulse">
                <div
                  className="w-11 h-11 rounded-xl"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
                <div className="flex-1 flex flex-col gap-2">
                  <div
                    className="h-3 w-24 rounded"
                    style={{ backgroundColor: "var(--color-border)" }}
                  />
                  <div
                    className="h-2.5 w-20 rounded"
                    style={{ backgroundColor: "var(--color-border)" }}
                  />
                </div>
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isPro
                        ? "linear-gradient(135deg, #f59e0b, #f97316)"
                        : "var(--color-surface-hover)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <span
                        className="text-sm font-bold"
                        style={{ color: isPro ? "#fff" : "var(--color-text-primary)" }}
                      >
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{
                          backgroundColor: isPro
                            ? "color-mix(in srgb, #f59e0b 15%, transparent)"
                            : "color-mix(in srgb, var(--color-text-muted) 12%, transparent)",
                          color: isPro ? "#f59e0b" : "var(--color-text-muted)",
                        }}
                      >
                        {isPro ? (
                          <>
                            <HiSparkles size={10} /> Pro Plan
                          </>
                        ) : (
                          <>
                            <MdOutlineWorkspacePremium size={10} /> Free Plan
                          </>
                        )}
                      </span>
                      {user.email && (
                        <span
                          className="text-[11px] truncate"
                          style={{ color: "var(--color-text-muted)" }}
                        >
                          {user.email}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {!isPro && (
                  <button
                    onClick={() => navigate(ROUTES.BILLING)}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #f97316, #fdba74)",
                      color: "#fff",
                      boxShadow: "0 10px 22px rgba(249, 115, 22, 0.24)",
                    }}
                  >
                    <HiSparkles size={14} />
                    Upgrade to Pro
                  </button>
                )}

                {isPro && (
                  <div
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 10%, transparent)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <HiSparkles size={12} style={{ color: "#f59e0b" }} />
                      Pro features unlocked
                    </span>
                    <span style={{ color: "var(--color-text-muted)" }}>
                      Manage in Billing
                    </span>
                  </div>
                )}
              </>
            ) : null}
          </Motion.div>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-colors duration-200 cursor-pointer w-full"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {isDark ? (
            <MdOutlineLightMode size={20} className="shrink-0" />
          ) : (
            <MdOutlineDarkMode size={20} className="shrink-0" />
          )}
          {!collapsed && (
            <span className="text-sm font-medium">
              {isDark ? "Light Mode" : "Dark Mode"}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg
            transition-colors duration-200 cursor-pointer w-full"
          style={{ color: "var(--color-danger)" }}
        >
          <MdOutlineLogout size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex items-center justify-center transition-colors duration-150"
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "7px",
            border: "1px solid var(--color-border)",
            background: "transparent",
            cursor: "pointer",
            margin: "4px auto 0",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <HiChevronRight size={14} style={{ color: "var(--color-text-muted)" }} />
          ) : (
            <HiChevronLeft size={14} style={{ color: "var(--color-text-muted)" }} />
          )}
        </button>

      </div>
    </Motion.aside>
  );
};

export default Sidebar;
