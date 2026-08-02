import { motion } from "framer-motion";
import {
  MdOutlineDesktopWindows,
  MdOutlineStorage,
  MdOutlineLayers,
  MdOutlineDataObject,
  MdOutlineSchool,
} from "react-icons/md";
import { HiCheck } from "react-icons/hi";

const roles = [
  {
    value: "frontend",
    label: "Frontend Developer",
    description: "HTML, CSS, JS + your chosen framework",
    icon: MdOutlineDesktopWindows,
  },
  {
    value: "backend",
    label: "Backend Developer",
    description: "Server, APIs, databases, architecture",
    icon: MdOutlineStorage,
  },
  {
    value: "fullstack",
    label: "Full Stack Developer",
    description: "End-to-end development with a full bundle",
    icon: MdOutlineLayers,
  },
  {
    value: "dsa",
    label: "DSA / Algorithms",
    description: "Data structures, algorithms, problem solving",
    icon: MdOutlineDataObject,
  },
  {
    value: "core_cs",
    label: "Core CS Subjects",
    description: "OS, DBMS, CN, OOPs, System Design",
    icon: MdOutlineSchool,
  },
];

const RoleSelector = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {roles.map((role, i) => {
        const isSelected = selected === role.value;
        return (
          <motion.div
            key={role.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(role.value)}
            className="relative p-5 rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "var(--color-surface)",
              border: `2px solid ${
                isSelected ? "var(--color-primary)" : "var(--color-border)"
              }`,
              boxShadow: isSelected
                ? "0 0 16px color-mix(in srgb, var(--color-primary) 15%, transparent)"
                : "none",
            }}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full
                  flex items-center justify-center bg-brand-gradient"
              >
                <HiCheck size={10} className="text-white" />
              </motion.div>
            )}

            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center
                mb-3 bg-brand-gradient"
            >
              <role.icon size={20} className="text-white" />
            </div>

            <h3
              className="text-sm font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              {role.label}
            </h3>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {role.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoleSelector;
