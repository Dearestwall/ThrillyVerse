// src/components/cards/ProjectCard.tsx
import type { Project } from '../../types'
import './ProjectCard.css'

export function ProjectCard({ item }: { item: Project }) {
  return (
    <article className="project-card card hover-lift">
      <div className="project-card__top">
        <img
          src={item.logo_url || 'https://i.ibb.co/0pjPXpZy/thrillyverse.png'}
          alt={item.title}
          className="project-card__logo"
        />
        <span className="badge">{item.category || 'Project'}</span>
      </div>

      <div className="project-card__body">
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </div>

      <a href={item.url} target="_blank" rel="noopener noreferrer" className="button button-primary">
        Open project
      </a>
    </article>
  )
}