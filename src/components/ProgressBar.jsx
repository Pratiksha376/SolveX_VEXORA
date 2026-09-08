export default function ProgressBar({ label, value, max = 100, tone = "sage" }) {
  const tones = {
    sage: "bg-sage",
    terracotta: "bg-terracotta",
    gold: "bg-gold",
  };
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-ink">{label}</span>
        <span className="text-sm text-muted tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-sage-soft overflow-hidden">
        <div
          className={`h-full rounded-full ${tones[tone]}`}
          style={{ width: `${pct}%`, transition: "width 700ms ease-out" }}
        />
      </div>
    </div>
  );
}
