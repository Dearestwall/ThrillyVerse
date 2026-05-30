import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

type Params = {
  params: { slug: string };
};

async function getBlogBySlug(slug: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return data;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog article could not be found.',
    };
  }

  const description =
    blog.excerpt || 'Read the latest article on ThrillyVerse.';

  return {
    title: blog.title,
    description,
    alternates: {
      canonical: `/blogs/${blog.slug}`,
    },
    openGraph: {
      title: `${blog.title} | ThrillyVerse`,
      description,
      url: `/blogs/${blog.slug}`,
      type: 'article',
      images: blog.cover_image ? [{ url: blog.cover_image, alt: blog.title }] : [],
      publishedTime: blog.published_at ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | ThrillyVerse`,
      description,
      images: blog.cover_image ? [blog.cover_image] : [],
    },
  };
}

export default async function BlogSlugPage({ params }: Params) {
  const { slug } = params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <article className="page-wrapper">
      <section className="page-hero blogs-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">{blog.category ?? 'Article'}</div>
          <h1 className="page-title">{blog.title}</h1>
          {blog.excerpt ? <p className="page-subtitle">{blog.excerpt}</p> : null}
        </div>
        <div className="page-hero-glow page-hero-glow--violet" />
      </section>

      <section className="container py-10">
        {blog.cover_image ? (
          <img
            src={blog.cover_image}
            alt={blog.title}
            className="w-full rounded-2xl border border-border mb-8"
          />
        ) : null}

        <div className="prose prose-invert max-w-4xl">
          <div dangerouslySetInnerHTML={{ __html: blog.content ?? '' }} />
        </div>
      </section>
    </article>
  );
}