import type { Movie } from '../../types'

export function MovieCard({ item }: { item: Movie }) {
  return (
    <article className="media-card card hover-lift">
      <img src={item.poster_url} alt={item.title} className="media-image" />
      <div className="media-body">
        <div className="meta-row">
          <span className="badge">{item.language}</span>
          <span className="muted-text">{item.type}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="meta-row">
          <strong>{item.status}</strong>
          <span className="muted-text">{item.release_year ?? 'TBA'}</span>
        </div>
      </div>
    </article>
  )
}