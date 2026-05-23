import { Link } from 'react-router-dom'
import type { Blog } from '../../types'

export function BlogCard({ item }: { item: Blog }) {
  return (
    <Link to={`/blogs/${item.slug}`} className="blog-card card hover-lift">
      <img src={item.cover_url} alt={item.title} className="media-image" />
      <div className="media-body">
        <span className="badge">{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.excerpt}</p>
        <div className="meta-row">
          <strong>{item.published ? 'Published' : 'Draft'}</strong>
          <span className="muted-text">/{item.slug}</span>
        </div>
      </div>
    </Link>
  )
}