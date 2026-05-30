import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Params = {
  params: { slug: string };
};

async function getMaterialBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('materials')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return data;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const material = await getMaterialBySlug(slug);

  if (!material) {
    return {
      title: 'Material Not Found',
      description: 'The requested study material could not be found.',
    };
  }

  const description =
    material.description || `Study ${material.title} on ThrillyVerse.`;

  return {
    title: material.title,
    description,
    alternates: {
      canonical: `/materials/${material.slug}`,
    },
    openGraph: {
      title: `${material.title} | ThrillyVerse`,
      description,
      url: `/materials/${material.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${material.title} | ThrillyVerse`,
      description,
    },
  };
}

export default async function MaterialSlugPage({ params }: Params) {
  const { slug } = params;
  const material = await getMaterialBySlug(slug);

  if (!material) notFound();

  return (
    <article className="page-wrapper">
      <section className="page-hero materials-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">{material.subject ?? 'Study Material'}</div>
          <h1 className="page-title">{material.title}</h1>
          <p className="page-subtitle">
            {material.description ?? 'Board-wise study material and resource details.'}
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--emerald" />
      </section>

      <section className="container py-10">
        <div className="card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><strong>Subject:</strong> {material.subject ?? '—'}</div>
            <div><strong>Board:</strong> {material.board ?? '—'}</div>
            <div><strong>Class:</strong> {material.class_level ?? '—'}</div>
          </div>

          {material.content ? (
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: material.content }} />
            </div>
          ) : null}

          {material.file_url ? (
            <div>
              <a
                href={material.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Open Material
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </article>
  );
}