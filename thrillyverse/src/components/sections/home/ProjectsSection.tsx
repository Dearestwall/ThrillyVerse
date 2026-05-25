import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';
import { truncate } from '@/utils';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="home-section home-section--alt">
      <div className="container">
        <div className="section-header fade-up">
          <div>
            <div className="section-eyebrow">Built by ThrillyVerse</div>
            <h2 className="section-title">Our Projects</h2>
          </div>
        </div>
        <div className="projects-grid">
          {projects.map((project, i) => {
            const techStack: string[] = project.tech_stack ?? [];
            return (
              <article
                key={project.id}
                className="project-card card overflow-hidden group section-reveal"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="project-card-img">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width:640px) 100vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    </div>
                  )}
                  {project.status === 'published' && (
                    <span className="project-live-dot" aria-label="Live project" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display font-bold text-base mb-1.5 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.summary && (
                    <p className="text-sm text-text-muted mb-4 leading-relaxed">
                      {truncate(project.summary, 110)}
                    </p>
                  )}
                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {techStack.map((tech: string) => (
                        <span key={tech} className="badge badge-muted text-[10px]">{tech}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {project.link && (
                      <Link
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        aria-label={`Open ${project.title}`}
                      >
                        <ExternalLink size={13} />
                        Live
                      </Link>
                    )}
                    {project.github_url && (
                      <Link
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        aria-label={`GitHub – ${project.title}`}
                      >
                        <Github size={13} />
                        Code
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}