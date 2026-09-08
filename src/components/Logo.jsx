import { Link } from "react-router-dom";

function Mark() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 24C13 24 4 20 4 11.5C4 8.5 6 5.5 9 4.5C9.5 8 11.5 10 13 11.5C11.5 8 12 4 15 2C18.5 4 19.5 8 18.5 11C21 9.5 22 8 22 8C22.5 12 21.5 16 18.5 19C16.5 21 14.5 22.5 13 24Z"
        fill="#6F866B"
      />
    </svg>
  );
}

function Wordmark() {
  return (
    <span className="font-display text-xl text-ink tracking-tight">
      SkillSet<span className="text-sage italic">Go</span>
    </span>
  );
}

// Renders the SkillSetGo logo. Pass `to` (defaults to "/") to make it a
// clickable link back to the homepage, or `linked={false}` for plain markup.
export default function Logo({ className = "", linked = true, to = "/" }) {
  const content = (
    <div className={`flex items-center gap-2 ${className}`}>
      <Mark />
      <Wordmark />
    </div>
  );

  if (!linked) return content;

  return (
    <Link to={to} aria-label="SkillSetGo home" className="inline-flex">
      {content}
    </Link>
  );
}
