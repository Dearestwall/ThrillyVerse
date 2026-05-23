import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github } from 'lucide-react';
import type { Project } from '@/types';
import { truncate } from '@/utils';

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;

  return (
    <section id="projects" className="py-16">
      <div className="container">
        <h2 className="font-display text-xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project: Project) => {
            const techStack = project.tech_stack ?? [];

            return (
              <article key={project.id} className="card overflow-hidden">
                {project.image_url ? (
                  <div className="relative h-48">
                    <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                  </div>
                ) : null}
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold mb-2">{project.title}</h3>
                  {project.summary ? <p className="text-sm text-text-muted mb-4">{truncate(project.summary, 100)}</p> : null}

                  {techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {techStack.map((tech: string) => (
                        <span key={tech} className="badge badge-muted">{tech}</span>
                      ))}
                    </div>
                  ) : null}

                  <div className="flex gap-2">
                    {project.link ? (
                      <Link href={project.link} className="btn btn-primary btn-sm" aria-label={`Open live project ${project.title}`}>
                        <ExternalLink size={14} />
                        Live
                      </Link>
                    ) : null}
                    {project.github_url ? (
                      <Link href={project.github_url} className="btn btn-secondary btn-sm" aria-label={`Open GitHub repository for ${project.title}`}>
                        <Github size={14} />
                        Code
                      </Link>
                    ) : null}
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
