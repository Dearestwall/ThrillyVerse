export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 fade-up max-w-3xl">
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      <h1 className="section-title">{title}</h1>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}