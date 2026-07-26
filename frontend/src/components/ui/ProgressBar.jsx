export const ProgressBar = ({ value, max, className = "" }) => {
  const percent = Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      className={`w-full rounded-full h-2 overflow-hidden ${className}`}
      style={{ backgroundColor: "var(--color-border)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${percent}%`,
          background:
            "linear-gradient(to right, var(--color-primary), var(--color-accent))",
        }}
      />
    </div>
  );
};

export default ProgressBar;
