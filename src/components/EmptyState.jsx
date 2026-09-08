export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-sage-soft flex items-center justify-center mb-5">
          <Icon size={24} className="text-sage-dark" />
        </div>
      )}
      <h3 className="font-display text-2xl text-ink mb-2">{title}</h3>
      <p className="text-muted max-w-sm mb-6 leading-relaxed">{description}</p>
      {action}
    </div>
  );
}
