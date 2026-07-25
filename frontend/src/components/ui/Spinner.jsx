const sizeMap = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-[3px]",
};

export const Spinner = ({ size = "md", className = "" }) => {
  return (
    <div
      className={`
          inline-block rounded-full border-solid animate-spin
          border-t-transparent
          ${sizeMap[size]}
          ${className}
        `}
      style={{
        borderColor: "var(--color-primary)",
        borderTopColor: "transparent",
      }}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
