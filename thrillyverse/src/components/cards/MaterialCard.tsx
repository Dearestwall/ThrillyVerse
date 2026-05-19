// src/components/cards/MaterialCard.tsx
import type { Material } from '../../types'
import './MaterialCard.css'

export function MaterialCard({ item }: { item: Material }) {
  return (
    <article className="material-card card hover-lift">
      <div className="material-card__top">
        <span className="badge">{item.category || 'Material'}</span>
        <span className="material-card__subject">{item.subject}</span>
      </div>

      <div className="material-card__body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      <div className="material-card__footer">
        <strong>{item.subject}</strong>
        <a href={item.drive_url} target="_blank" rel="noopener noreferrer" className="button button-primary">
          Open folder
        </a>
      </div>
    </article>
  )
}