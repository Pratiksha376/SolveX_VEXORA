export default function Spinner({ label = "Thinking..." }) {
  return (
    <div className="flex items-center gap-3 text-muted">
      <span className="relative flex h-4 w-4">
        <span className="animate-spin inline-block h-4 w-4 rounded-full border-2 border-sage-soft border-t-sage-dark" />
      </span>
      <span className="text-sm">{label}</span>
    </div>
  );
}
