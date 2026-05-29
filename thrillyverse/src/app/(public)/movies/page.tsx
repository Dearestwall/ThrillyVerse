import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MoviesGrid } from '@/components/sections/movies/MoviesGrid';
import type { Movie } from '@/types';

export const metadata: Metadata = {
  title: 'Movies',
  description:
    'Watch, stream, and discover curated movies, featured picks, and direct links on ThrillyVerse.',
  alternates: {
    canonical: '/movies',
  },
  openGraph: {
    title: 'Movies | ThrillyVerse',
    description:
      'Watch, stream, and discover curated movies, featured picks, and direct links on ThrillyVerse.',
    url: '/movies',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movies | ThrillyVerse',
    description:
      'Watch, stream, and discover curated movies, featured picks, and direct links on ThrillyVerse.',
  },
};

export default async function MoviesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('movies')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true });

  return (
    <div className="page-wrapper">
      <section className="page-hero movies-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Browse</div>
          <h1 className="page-title">Movies</h1>
          <p className="page-subtitle">
            Watch links, downloads, and curated picks.
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--blue" />
      </section>

      <section className="container py-10">
        <MoviesGrid movies={(data ?? []) as Movie[]} />
      </section>
    </div>
  );
}