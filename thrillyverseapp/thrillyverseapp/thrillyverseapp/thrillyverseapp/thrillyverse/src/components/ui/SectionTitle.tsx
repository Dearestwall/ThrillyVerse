export function SectionTitle({
  eyebrow,
  title,
  text
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="section-title">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  )
}