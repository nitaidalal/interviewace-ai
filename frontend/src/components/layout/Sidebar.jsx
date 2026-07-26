import { NavLink } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { HiSparkles, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import {
  MdDashboard,
  MdOutlineVideoCall,
  MdOutlineDescription,
  MdOutlineCode,
  MdOutlinePerson,
  MdOutlineLogout,
} from "react-icons/md";
import { RiCoinLine } from "react-icons/ri";
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
  const { user, isLoading } = useSelector((state) => state.auth);
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
            <div className="w-7 h-7 rounded-lg bg-brand-gradient flex items-center justify-center shrink-0">
              <HiSparkles className="text-white text-xs" />
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
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
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
        className="px-2 py-3 shrink-0 flex flex-col gap-1"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        {/* User info */}
        {/* User info */}
        {!collapsed && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-3 py-2 mb-1"
          >
            {isLoading ? (
              // Skeleton while getMe() is in flight
              <div className="flex flex-col gap-1.5">
                <div
                  className="h-3 w-24 rounded animate-pulse"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
                <div
                  className="h-2.5 w-16 rounded animate-pulse"
                  style={{ backgroundColor: "var(--color-border)" }}
                />
              </div>
            ) : user ? (
              <>
                <p
                  className="text-xs font-medium truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {user.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {user.subscription?.plan === "pro"
                    ? "⭐ Pro Plan"
                    : "🆓 Free Plan"}
                </p>
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
          className="flex items-center justify-center w-full py-2 mt-1
            rounded-lg transition-colors duration-200 cursor-pointer"
          style={{ color: "var(--color-text-muted)" }}
        >
          {collapsed ? (
            <HiChevronRight size={18} />
          ) : (
            <HiChevronLeft size={18} />
          )}
        </button>
      </div>
    </Motion.aside>
  );
};

export default Sidebar;
