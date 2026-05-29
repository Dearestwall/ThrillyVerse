import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Github, Sparkles, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { truncate } from '@/utils';

function normalizeTechStack(stack: any): string[] {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack.filter(Boolean).map(String);
  if (typeof stack === 'string') {
    return stack.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (typeof stack === 'object') {
    return Object.values(stack).map((v) => String(v).trim()).filter(Boolean);
  }
  return [String(stack)];
}

function isPublished(project: Project & { status?: string; published?: boolean }) {
  return project.status === 'published' || project.published === true;
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const visible = (projects ?? []).filter((p: any) => p?.title);

  if (!visible.length) return null;

  return (
    <section id="projects" className="home-section home-section--alt">
      <div className="container">
        <div className="section-header fade-up flex items-end justify-between gap-4 flex-wrap">
          <div>
            <div className="section-eyebrow flex items-center gap-2">
              <Sparkles size={14} />
              Built by ThrillyVerse
            </div>
            <h2 className="section-title">Our Projects</h2>
          </div>
          <div className="text-sm text-text-muted">
            {visible.length} project{visible.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="projects-grid">
          {visible.map((project: any, i) => {
            const techStack = normalizeTechStack(project.tech_stack);
            const live = isPublished(project);

            return (
              <article
                key={project.id}
                className="project-card card overflow-hidden group section-reveal"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="project-card-img relative overflow-hidden">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      sizes="(max-width:640px) 100vw, 400px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="project-img-placeholder">
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 grid place-items-center">
                        <ArrowUpRight size={20} />
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-80" />

                  {live && <span className="project-live-dot" aria-label="Live project" />}
                  {project.featured && (
                    <span className="absolute top-3 left-3 z-10 badge bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-base mb-1.5 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.summary && (
                      <p className="text-sm text-text-muted leading-relaxed">
                        {truncate(project.summary, 120)}
                      </p>
                    )}
                  </div>

                  {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.slice(0, 6).map((tech: string) => (
                        <span key={tech} className="badge badge-muted text-[10px]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
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