import type { Project } from '../../types'

export function ProjectCard({ item }: { item: Project }) {
  return (
    <article className="content-card card hover-lift">
      <img src={item.logo_url} alt={item.title} className="card-logo" />
      <span className="badge">{item.category}</span>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="button button-primary">
        Open project
      </a>
    </article>
  )
}