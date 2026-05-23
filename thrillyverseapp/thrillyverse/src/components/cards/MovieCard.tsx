// src/components/cards/MovieCard.tsx
import type { Movie } from '../../types'
import './MovieCard.css'

export function MovieCard({ item }: { item: Movie }) {
  return (
    <article className="movie-card card hover-lift">
      <img src={item.poster_url} alt={item.title} className="movie-card__image" />

      <div className="movie-card__body">
        <div className="movie-card__meta">
          <span className="badge">{item.language}</span>
          <span className="muted-text">{item.type}</span>
        </div>

        <h3>{item.title}</h3>
        <p>{item.description}</p>

        <div className="movie-card__meta">
          <strong>{item.status}</strong>
          <span className="muted-text">{item.release_year ?? 'TBA'}</span>
        </div>
      </div>
    </article>
  )
}