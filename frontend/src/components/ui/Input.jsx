export const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  leftIcon,
  rightElement,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium"
          style={{ color: "var(--color-text-primary)" }}
        >
          {label}
          {required && (
            <span style={{ color: "var(--color-danger)" }} className="ml-1">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div
            className="absolute left-3 flex items-center pointer-events-none"
            style={{ color: "var(--color-text-muted)" }}
          >
            {leftIcon}
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
              input-base
              ${leftIcon ? "pl-10" : ""}
              ${rightElement ? "pr-10" : ""}
              ${error ? "input-error" : ""}
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
        />

        {rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          className="text-xs font-medium"
          style={{ color: "var(--color-danger)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
