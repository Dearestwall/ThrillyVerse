// src/components/ui/SectionTitle.tsx
import './SectionTitle.css'

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
      <p className="section-title__eyebrow eyebrow">{eyebrow}</p>
      <h2 className="section-title__heading">{title}</h2>
      <p className="section-title__text">{text}</p>
    </div>
  )
}