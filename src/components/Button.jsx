import { Link } from "react-router-dom";

const variants = {
  primary: "bg-sage-dark text-white hover:bg-[#455943] shadow-sm",
  secondary: "bg-white text-ink border border-border hover:border-sage",
  ghost: "text-sage-dark hover:text-sage-dark/80",
  terracotta: "bg-terracotta text-white hover:bg-[#c17953]",
};

export default function Button({
  children,
  variant = "primary",
  to,
  href,
  onClick,
  type = "button",
  className = "",
  disabled = false,
  icon: Icon,
  iconPosition = "right",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-[15px] font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const cls = `${base} ${variants[variant]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon size={17} />}
      {children}
      {Icon && iconPosition === "right" && <Icon size={17} />}
    </>
  );

  if (to) return <Link to={to} className={cls}>{content}</Link>;
  if (href) return <a href={href} className={cls}>{content}</a>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {content}
    </button>
  );
}
