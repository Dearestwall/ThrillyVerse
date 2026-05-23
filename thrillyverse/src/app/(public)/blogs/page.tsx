import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BlogsGrid } from '@/components/sections/blogs/BlogsGrid';

export const metadata: Metadata = {
  title: 'Blogs â€” ThrillyVerse',
  description: 'Readable, dynamic, and admin-managed articles.',
};

export default async function BlogsPage() {
  const supabase = createClient();
  const { data } = await supabase.from('blogs').select('*').eq('published', true).order('published_at', { ascending: false });

  return (
    <div className="page-wrapper">
      <div className="page-hero blogs-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Articles</div>
          <h1 className="page-title">Blogs</h1>
          <p className="page-subtitle">Readable, dynamic, and admin-managed articles.</p>
        </div>
        <div className="page-hero-glow page-hero-glow--violet" />
      </div>
      <div className="container py-10">
        <BlogsGrid blogs={(data ?? []) as never} />
      </div>
    </div>
  );
}

