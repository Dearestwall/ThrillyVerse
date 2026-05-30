'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Sparkles,
  X,
  ZoomIn,
} from 'lucide-react';
import type { Project } from '@/types';
import { truncate } from '@/utils';

type ProjectWithExtras = Project & {
  featured?: boolean;
  status?: string;
  published?: boolean;
  summary?: string | null;
  description?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  gallery_images?: string[] | null;
  screenshots?: string[] | null;
  slug?: string;
  link?: string | null;
  github_url?: string | null;
  tech_stack?: unknown;
};

function normalizeTechStack(stack: unknown): string[] {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack.filter(Boolean).map(String);
  if (typeof stack === 'string') {
    return stack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (typeof stack === 'object') {
    return Object.values(stack as Record<string, unknown>)
      .map((v) => String(v).trim())
      .filter(Boolean);
  }
  return [String(stack)];
}

function isPublished(project: ProjectWithExtras) {
  return project.status === 'published' || project.published === true;
}

function normalizeGallery(project: ProjectWithExtras): string[] {
  const possible = [
    project.image_url,
    ...(Array.isArray(project.images) ? project.images : []),
    ...(Array.isArray(project.gallery_images) ? project.gallery_images : []),
    ...(Array.isArray(project.screenshots) ? project.screenshots : []),
  ];

  return Array.from(
    new Set(possible.filter((item): item is string => Boolean(item && item.trim())))
  );
}

function ProjectGallery({
  title,
  images,
  onOpen,
}: {
  title: string;
  images: string[];
  onOpen: (index: number) => void;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [images]);

  if (!images.length) {
    return (
      <div className="project-gallery-shell">
        <div className="project-img-placeholder">
          <div className="project-img-placeholder-icon">
            <ArrowUpRight size={20} />
          </div>
          <span>No preview available</span>
        </div>
      </div>
    );
  }

  const goPrev = () => setActive((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goNext = () => setActive((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="project-gallery-shell">
      <div className="project-gallery-main">
        <button
          type="button"
          className="project-gallery-nav project-gallery-nav--left"
          aria-label={`Previous image for ${title}`}
          onClick={goPrev}
        >
          <ArrowLeft size={16} />
        </button>

        <button
          type="button"
          className="project-gallery-main-view"
          onClick={() => onOpen(active)}
          aria-label={`Enlarge image ${active + 1} for ${title}`}
        >
          <Image
            src={images[active]}
            alt={`${title} preview ${active + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="project-gallery-image"
          />
          <div className="project-gallery-overlay" />
          <span className="project-gallery-enlarge">
            <ZoomIn size={15} />
            Enlarge
          </span>
        </button>

        <button
          type="button"
          className="project-gallery-nav project-gallery-nav--right"
          aria-label={`Next image for ${title}`}
          onClick={goNext}
        >
          <ArrowRight size={16} />
        </button>

        {images.length > 1 ? (
          <div className="project-gallery-count">
            {active + 1} / {images.length}
          </div>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="project-gallery-thumbs" role="tablist" aria-label={`${title} screenshots`}>
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              className={`project-gallery-thumb ${active === index ? 'is-active' : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Show image ${index + 1} for ${title}`}
              aria-pressed={active === index}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="72px"
                className="project-gallery-thumb-image"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ProjectLightbox({
  open,
  title,
  images,
  activeIndex,
  onClose,
  onNavigate,
}: {
  open: boolean;
  title: string;
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onNavigate('prev');
      if (event.key === 'ArrowRight') onNavigate('next');
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose, onNavigate]);

  if (!open || !images.length) return null;

  return (
    <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={`${title} gallery viewer`}>
      <button
        type="button"
        className="project-lightbox-backdrop"
        aria-label="Close image viewer"
        onClick={onClose}
      />

      <div className="project-lightbox-panel">
        <button
          type="button"
          className="project-lightbox-close"
          aria-label="Close image viewer"
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <button
          type="button"
          className="project-lightbox-arrow project-lightbox-arrow--left"
          aria-label="Previous image"
          onClick={() => onNavigate('prev')}
        >
          <ArrowLeft size={18} />
        </button>

        <div className="project-lightbox-media">
          <Image
            src={images[activeIndex]}
            alt={`${title} preview ${activeIndex + 1}`}
            fill
            sizes="100vw"
            className="project-lightbox-image"
          />
        </div>

        <button
          type="button"
          className="project-lightbox-arrow project-lightbox-arrow--right"
          aria-label="Next image"
          onClick={() => onNavigate('next')}
        >
          <ArrowRight size={18} />
        </button>

        <div className="project-lightbox-footer">
          <span>{title}</span>
          <span>
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  const visible = useMemo(
    () => (projects as ProjectWithExtras[]).filter((p) => p?.title),
    [projects]
  );

  const [viewer, setViewer] = useState<{
    open: boolean;
    projectTitle: string;
    images: string[];
    activeIndex: number;
  }>({
    open: false,
    projectTitle: '',
    images: [],
    activeIndex: 0,
  });

  if (!visible.length) return null;

  const openViewer = (projectTitle: string, images: string[], index: number) => {
    setViewer({
      open: true,
      projectTitle,
      images,
      activeIndex: index,
    });
  };

  const navigateViewer = (direction: 'prev' | 'next') => {
    setViewer((prev) => {
      if (!prev.images.length) return prev;

      const nextIndex =
        direction === 'prev'
          ? prev.activeIndex === 0
            ? prev.images.length - 1
            : prev.activeIndex - 1
          : prev.activeIndex === prev.images.length - 1
            ? 0
            : prev.activeIndex + 1;

      return { ...prev, activeIndex: nextIndex };
    });
  };

  return (
    <>
      <section id="projects" className="home-section home-section--alt projects-showcase-section">
        <div className="container">
          <div className="section-header fade-up projects-section-header">
            <div>
              <div className="section-eyebrow flex items-center gap-2">
                <Sparkles size={14} />
                Built by ThrillyVerse
              </div>
              <h2 className="section-title">Our Projects</h2>
              <p className="section-description projects-section-description">
                Explore tools, experiments, utilities, and live builds with richer previews,
                tech details, and direct project pages.
              </p>
            </div>
            <div className="projects-total-pill">
              {visible.length} project{visible.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="projects-showcase-stack">
            {visible.map((project, i) => {
              const techStack = normalizeTechStack(project.tech_stack);
              const live = isPublished(project);
              const images = normalizeGallery(project);

              return (
                <article
                  key={project.id ?? project.slug ?? project.title}
                  className="project-showcase-card card section-reveal"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="project-showcase-media">
                    <ProjectGallery
                      title={project.title}
                      images={images}
                      onOpen={(index) => openViewer(project.title, images, index)}
                    />

                    {live ? <span className="project-live-dot" aria-label="Live project" /> : null}

                    {project.featured ? (
                      <span className="project-featured-badge">Featured</span>
                    ) : null}
                  </div>

                  <div className="project-showcase-content">
                    <div className="project-showcase-top">
                      <div className="project-showcase-heading">
                        <h3 className="project-showcase-title">{project.title}</h3>
                        <p className="project-showcase-summary">
                          {truncate(
                            project.summary || project.description || 'No project summary available yet.',
                            190
                          )}
                        </p>
                      </div>

                      <div className="project-showcase-links">
                        {project.slug ? (
                          <Link
                            href={`/projects/${project.slug}`}
                            className="btn btn-secondary btn-sm"
                            aria-label={`View ${project.title} details`}
                          >
                            <ArrowUpRight size={14} />
                            View Page
                          </Link>
                        ) : null}

                        {project.link ? (
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
                        ) : null}

                        {project.github_url ? (
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
                        ) : null}
                      </div>
                    </div>

                    <div className="project-showcase-bottom">
                      {techStack.length ? (
                        <div className="project-tech-row">
                          {techStack.slice(0, 8).map((tech) => (
                            <span key={tech} className="badge badge-muted project-tech-badge">
                              {tech}
                            </span>
                          ))}
                        </div>
                      ) : null}

                      {images.length > 1 ? (
                        <div className="project-gallery-meta">
                          Scroll, switch thumbnails, or enlarge screenshots
                        </div>
                      ) : (
                        <div className="project-gallery-meta">
                          Tap preview to enlarge
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <ProjectLightbox
        open={viewer.open}
        title={viewer.projectTitle}
        images={viewer.images}
        activeIndex={viewer.activeIndex}
        onClose={() =>
          setViewer({
            open: false,
            projectTitle: '',
            images: [],
            activeIndex: 0,
          })
        }
        onNavigate={navigateViewer}
      />
    </>
  );
}