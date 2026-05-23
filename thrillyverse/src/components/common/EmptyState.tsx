export function EmptyState({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <div className="card p-16 text-center scale-in">
      <div
        className="w-16 h-16 rounded-2xl text-2xl mx-auto mb-5 flex items-center justify-center float"
        style={{ background: 'linear-gradient(135deg, var(--color-primary-highlight), var(--color-gold-highlight))' }}
      >
        📭
      </div>
      <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
