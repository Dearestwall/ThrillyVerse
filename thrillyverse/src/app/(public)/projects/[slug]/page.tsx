import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type Params = {
  params: Promise<{ slug: string }>;
};

async function getProjectBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export async function generateStaticParams() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('projects')
    .select('slug');

  return (data ?? []).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const description =
    project.summary ||
    project.description ||
    `Explore ${project.title} on ThrillyVerse.`;

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} | ThrillyVerse`,
      description,
      url: `/projects/${project.slug}`,
      type: 'website',
      images: project.image_url ? [{ url: project.image_url, alt: project.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} | ThrillyVerse`,
      description,
      images: project.image_url ? [project.image_url] : [],
    },
  };
}

export default async function ProjectSlugPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const techStack = Array.isArray(project.tech_stack)
    ? project.tech_stack
    : typeof project.tech_stack === 'string'
    ? project.tech_stack.split(',').map((item: string) => item.trim()).filter(Boolean)
    : [];

  return (
    <article className="page-wrapper">
      <section className="page-hero projects-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">{project.status ?? 'Project'}</div>
          <h1 className="page-title">{project.title}</h1>
          <p className="page-subtitle">
            {project.summary ?? project.description ?? 'Project details and links.'}
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--gold" />
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <div>
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full rounded-2xl border border-border"
              />
            ) : null}
          </div>

          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-text-muted leading-7">
                {project.description ?? project.summary ?? 'No description available.'}
              </p>
            </div>

            {techStack.length ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-3">Tech Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech: string) => (
                    <span key={tech} className="badge badge-muted">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {(project.link || project.github_url) ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-3">Links</h2>
                <div className="flex flex-wrap gap-3">
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                    >
                      Live Project
                    </a>
                  ) : null}
                  {project.github_url ? (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                    >
                      GitHub
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </article>
  );
}