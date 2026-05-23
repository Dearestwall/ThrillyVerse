import type { Material } from '../../types'

export function MaterialCard({ item }: { item: Material }) {
  return (
    <article className="content-card card hover-lift">
      <span className="badge">{item.category}</span>
      <h3>{item.subject}</h3>
      <p>{item.description}</p>
      <div className="meta-row">
        <strong>{item.title}</strong>
      </div>
      <a href={item.drive_url} target="_blank" rel="noopener noreferrer" className="button button-primary">
        Open folder
      </a>
    </article>
  )
}