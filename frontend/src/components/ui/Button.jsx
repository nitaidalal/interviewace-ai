import Spinner from "./Spinner.jsx";

const variantStyles = {
  primary: `
    bg-brand-gradient text-white font-medium
    hover:opacity-90 active:scale-[0.98]
    shadow-sm
  `,
  secondary: `
    bg-transparent font-medium
    border border-[var(--color-border)]
    text-[var(--color-text-primary)]
    hover:bg-[var(--color-surface-hover)]
    active:scale-[0.98]
  `,
  ghost: `
    bg-transparent font-medium
    text-[var(--color-text-secondary)]
    hover:text-[var(--color-text-primary)]
    hover:bg-[var(--color-surface-hover)]
    active:scale-[0.98]
  `,
  danger: `
    bg-[var(--color-danger)] text-white font-medium
    hover:opacity-90 active:scale-[0.98]
    shadow-sm
  `,
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

export default Button;
