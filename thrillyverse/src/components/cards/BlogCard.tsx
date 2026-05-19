// src/components/cards/BlogCard.tsx
import { Link } from 'react-router-dom'
import type { Blog } from '../../types'
import './BlogCard.css'

export function BlogCard({ item }: { item: Blog }) {
  return (
    <Link to={`/blogs/${item.slug}`} className="blog-card card hover-lift">
      <img src={item.cover_url} alt={item.title} className="blog-card__image" />

      <div className="blog-card__body">
        <span className="badge">{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>

        <div className="blog-card__meta">
          <strong>{item.published ? 'Published' : 'Draft'}</strong>
          <span className="muted-text">/{item.slug}</span>
        </div>
      </div>
    </Link>
  )
}