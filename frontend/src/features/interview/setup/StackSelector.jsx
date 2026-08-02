import { motion } from "framer-motion";
import { HiCheck } from "react-icons/hi";

const STACKS = {
  frontend: {
    label: "Choose Framework",
    note: "HTML, CSS & JavaScript are always included",
    single: true,
    options: [
      { value: "react", label: "React" },
      { value: "nextjs", label: "Next.js" },
      { value: "vue", label: "Vue.js" },
      { value: "nuxtjs", label: "Nuxt.js" },
      { value: "angular", label: "Angular" },
      { value: "svelte", label: "Svelte" },
      { value: "web", label: "Vanilla JS (No Framework)" },
    ],
  },
  backend: {
    label: "Choose Stack",
    single: true,
    options: [
      { value: "node_express", label: "Node.js + Express" },
      { value: "node_nest", label: "Node.js + NestJS" },
      { value: "node_fastify", label: "Node.js + Fastify" },
      { value: "springboot", label: "Spring Boot (Java)" },
      { value: "fastapi", label: "FastAPI (Python)" },
      { value: "django", label: "Django REST (Python)" },
      { value: "laravel", label: "Laravel (PHP)" },
      { value: "golang", label: "Golang (Gin)" },
    ],
  },
  fullstack: {
    label: "Choose Bundle",
    single: true,
    options: [
      { value: "mern", label: "MERN Stack" },
      { value: "mean", label: "MEAN Stack" },
      { value: "pern", label: "PERN Stack" },
      { value: "next_node_pg", label: "Next.js + Node + PostgreSQL" },
      {
        value: "python_fullstack",
        label: "Python Full Stack (Django + React)",
      },
      {
        value: "java_fullstack",
        label: "Java Full Stack (Spring Boot + React)",
      },
    ],
  },
  dsa: {
    label: "Choose Language",
    single: true,
    options: [
      { value: "javascript", label: "JavaScript" },
      { value: "python", label: "Python" },
      { value: "java", label: "Java" },
      { value: "cpp", label: "C++" },
    ],
  },
  core_cs: {
    label: "Choose Subjects",
    note: "Select one or more",
    single: false,
    options: [
      { value: "os", label: "Operating Systems" },
      { value: "dbms", label: "DBMS" },
      { value: "cn", label: "Computer Networks" },
      { value: "oops", label: "Object Oriented Programming" },
      { value: "system_design", label: "System Design (Basic)" },
    ],
  },
};

const DATABASE_OPTIONS = {
  node_express: ["mongodb", "mysql", "postgresql"],
  node_nest: ["mongodb", "mysql", "postgresql"],
  node_fastify: ["mongodb", "mysql", "postgresql"],
  springboot: ["mysql", "postgresql"],
  fastapi: ["postgresql", "mysql"],
  django: ["postgresql", "mysql"],
};

const OptionChip = ({ value, label, selected, onClick }) => (
  <motion.button
    type="button"
    whileTap={{ scale: 0.96 }}
    onClick={() => onClick(value)}
    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl
      text-sm font-medium transition-all duration-200 cursor-pointer border"
    style={{
      backgroundColor: selected
        ? "color-mix(in srgb, var(--color-primary) 12%, transparent)"
        : "var(--color-surface)",
      borderColor: selected ? "var(--color-primary)" : "var(--color-border)",
      color: selected ? "var(--color-primary)" : "var(--color-text-secondary)",
    }}
  >
    {selected && <HiCheck size={14} />}
    {label}
  </motion.button>
);

const StackSelector = ({ role, stack, database, subjects, onChange }) => {
  const config = STACKS[role];
  if (!config) return null;

  const dbOptions = DATABASE_OPTIONS[stack] ?? [];
  const showDatabase = role === "backend" && stack && dbOptions.length > 0;

  const handleStackClick = (value) => {
    if (config.single) {
      onChange({ stack: value, database: null, subjects: [] });
    } else {
      const current = subjects || [];
      const updated = current.includes(value)
        ? current.filter((s) => s !== value)
        : [...current, value];
      onChange({ stack, database, subjects: updated });
    }
  };

  const handleDatabaseClick = (value) => {
    onChange({ stack, database: value, subjects });
  };

//   const selectedValue = role === "core_cs" ? subjects : [stack];

  return (
    <div className="flex flex-col gap-6">
      {/* Stack / Framework / Bundle / Language / Subjects */}
      <div>
        <p
          className="text-sm font-semibold mb-1"
          style={{ color: "var(--color-text-primary)" }}
        >
          {config.label}
        </p>
        {config.note && (
          <p
            className="text-xs mb-3"
            style={{ color: "var(--color-text-muted)" }}
          >
            {config.note}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {config.options.map((opt) => (
            <OptionChip
              key={opt.value}
              value={opt.value}
              label={opt.label}
              selected={
                role === "core_cs"
                  ? (subjects || []).includes(opt.value)
                  : stack === opt.value
              }
              onClick={handleStackClick}
            />
          ))}
        </div>
      </div>

      {/* Database (backend only) */}
      {showDatabase && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "var(--color-text-primary)" }}
          >
            Choose Database
          </p>
          <div className="flex flex-wrap gap-2">
            {dbOptions.map((db) => (
              <OptionChip
                key={db}
                value={db}
                label={db.toUpperCase()}
                selected={database === db}
                onClick={handleDatabaseClick}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StackSelector;
