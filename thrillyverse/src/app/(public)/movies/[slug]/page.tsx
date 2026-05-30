import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type Params = {
  params: Promise<{ slug: string }>;
};

async function getMovieBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('movies')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return data;
}

export async function generateStaticParams() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('movies')
    .select('slug')
    .eq('published', true);

  return (data ?? []).map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    return {
      title: 'Movie Not Found',
      description: 'The requested movie could not be found.',
    };
  }

  const description =
    movie.description ||
    `Explore ${movie.title} on ThrillyVerse.`;

  return {
    title: movie.title,
    description,
    alternates: {
      canonical: `/movies/${movie.slug}`,
    },
    openGraph: {
      title: `${movie.title} | ThrillyVerse`,
      description,
      url: `/movies/${movie.slug}`,
      type: 'website',
      images: movie.poster_url ? [{ url: movie.poster_url, alt: movie.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} | ThrillyVerse`,
      description,
      images: movie.poster_url ? [movie.poster_url] : [],
    },
  };
}

export default async function MovieSlugPage({ params }: Params) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) notFound();

  return (
    <div className="page-wrapper">
      <section className="page-hero movies-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">{movie.category ?? 'Movie'}</div>
          <h1 className="page-title">{movie.title}</h1>
          <p className="page-subtitle">
            {movie.description ?? 'Movie details, links, and highlights.'}
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--blue" />
      </section>

      <section className="container py-10">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div>
            {movie.poster_url ? (
              <img
                src={movie.poster_url}
                alt={movie.title}
                className="w-full rounded-2xl border border-border"
              />
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="card p-6">
              <h2 className="text-xl font-bold mb-4">Details</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><strong>Year:</strong> {movie.year ?? '—'}</div>
                <div><strong>Rating:</strong> {movie.rating ?? '—'}</div>
                <div><strong>Category:</strong> {movie.category ?? '—'}</div>
                <div><strong>Status:</strong> {movie.status ?? 'Available'}</div>
              </div>
            </div>

            {movie.storyline ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-3">Storyline</h2>
                <p className="text-text-muted leading-7">{movie.storyline}</p>
              </div>
            ) : null}

            {movie.watch_link || movie.download_link ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold mb-3">Links</h2>
                <div className="flex flex-wrap gap-3">
                  {movie.watch_link ? (
                    <a className="btn btn-primary" href={movie.watch_link} target="_blank" rel="noopener noreferrer">
                      Watch Now
                    </a>
                  ) : null}
                  {movie.download_link ? (
                    <a className="btn btn-secondary" href={movie.download_link} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}