export default function Card({ children, className = "", padded = true }) {
  return (
    <div
      className={`bg-white border border-border rounded-xl ${padded ? "p-6" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
