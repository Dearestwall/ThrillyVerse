import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogsGrid } from '@/components/sections/blogs/BlogsGrid';
import type { Blog } from '@/types';

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Read blogs on movies, learning, platform updates, and digital projects on ThrillyVerse.',
  alternates: {
    canonical: '/blogs',
  },
  openGraph: {
    title: 'Blogs | ThrillyVerse',
    description:
      'Read blogs on movies, learning, platform updates, and digital projects on ThrillyVerse.',
    url: '/blogs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogs | ThrillyVerse',
    description:
      'Read blogs on movies, learning, platform updates, and digital projects on ThrillyVerse.',
  },
};

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  return (
    <div className="page-wrapper">
      <section className="page-hero blogs-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Articles</div>
          <h1 className="page-title">Blogs</h1>
          <p className="page-subtitle">
            Readable, dynamic, and admin-managed articles.
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--violet" />
      </section>

      <section className="container py-10">
        <BlogsGrid blogs={(data ?? []) as Blog[]} />
      </section>
    </div>
  );
}