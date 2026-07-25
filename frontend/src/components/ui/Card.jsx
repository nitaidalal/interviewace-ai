export const Card = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`surface-card p-6 ${onClick ? "cursor-pointer hover:border-[var(--color-primary)] transition-colors duration-200" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
