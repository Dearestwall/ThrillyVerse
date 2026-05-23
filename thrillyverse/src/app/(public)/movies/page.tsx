import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MoviesGrid } from '@/components/sections/movies/MoviesGrid';

export const metadata: Metadata = {
  title: 'Movies â€” ThrillyVerse',
  description: 'Watch, stream, and download your favourite movies.',
};

export default async function MoviesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('movies').select('*').eq('published', true).order('sort_order');

  return (
    <div className="page-wrapper">
      <div className="page-hero movies-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Browse</div>
          <h1 className="page-title">Movies</h1>
          <p className="page-subtitle">Watch links, downloads, and curated picks.</p>
        </div>
        <div className="page-hero-glow page-hero-glow--blue" />
      </div>
      <div className="container py-10">
        <MoviesGrid movies={(data ?? []) as never} />
      </div>
    </div>
  );
}

