const variantStyles = {
  primary: {
    background: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
    color: "var(--color-primary)",
  },
  success: {
    background: "color-mix(in srgb, var(--color-success) 15%, transparent)",
    color: "var(--color-success)",
  },
  warning: {
    background: "color-mix(in srgb, var(--color-warning) 15%, transparent)",
    color: "var(--color-warning)",
  },
  danger: {
    background: "color-mix(in srgb, var(--color-danger) 15%, transparent)",
    color: "var(--color-danger)",
  },
  muted: {
    background: "var(--color-surface-hover)",
    color: "var(--color-text-secondary)",
  },
};

export const Badge = ({ children, variant = "primary", className = "" }) => {
  const styles = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={styles}
    >
      {children}
    </span>
  );
};

export default Badge;
