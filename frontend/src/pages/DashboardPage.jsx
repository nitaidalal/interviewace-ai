import { motion as Motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineVideoCall,
  MdOutlineDescription,
  MdOutlineCode,
} from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import { ROUTES } from "../utils/constants.js";

const quickLinks = [
  {
    label: "Start AI Interview",
    description: "Practice with adaptive AI questions",
    icon: MdOutlineVideoCall,
    href: ROUTES.INTERVIEW,
    gradient: "from-orange-500 to-amber-500",
  },
  {
    label: "Analyze Resume",
    description: "Get ATS score and feedback",
    icon: MdOutlineDescription,
    href: ROUTES.ATS,
    gradient: "from-orange-400 to-rose-500",
  },
  {
    label: "Practice Coding",
    description: "Solve interview coding problems",
    icon: MdOutlineCode,
    href: ROUTES.PROGRAMMING,
    gradient: "from-amber-500 to-orange-600",
  },
];

const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-8"
    >
      {/* Welcome */}
      <div>
        <Motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </Motion.h1>
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Ready to practice? Pick a module to get started.
        </Motion.p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickLinks.map((item, i) => (
          <Motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => navigate(item.href)}
            className="p-5 rounded-2xl cursor-pointer group"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${item.gradient} mb-4`}
            >
              <item.icon size={20} className="text-white" />
            </div>
            <h3
              className="font-semibold text-sm mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {item.label}
            </h3>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {item.description}
            </p>
            <div
              className="flex items-center gap-1 mt-4 text-xs font-medium
                opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              style={{ color: "var(--color-primary)" }}
            >
              Get Started <HiArrowRight size={12} />
            </div>
          </Motion.div>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-8 rounded-2xl text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="text-sm font-medium"
          style={{ color: "var(--color-text-muted)" }}
        >
          📊 Analytics Dashboard — Coming in Phase 9
        </p>
      </Motion.div>
    </Motion.div>
  );
};

export default DashboardPage;
