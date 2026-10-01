import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ViewCounter from '@/components/blogs/ViewCounter';

const SITE_URL = 'https://thrillyverse.com';

export const revalidate = 3600; // Cache page for 1 hour

type Props = {
  params: Promise<{ slug: string }>;
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

export async function generateMetadata({ params }: Props): Promise {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog article could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const description =
    blog.excerpt || 'Read the latest article on ThrillyVerse.';
  const pageUrl = `\({SITE_URL}/blogs/\){blog.slug}`;
  const imageUrl = blog.cover_image ? blog.cover_image : `${SITE_URL}/logo-192.png`;

  return {
    title: `${blog.title} | ThrillyVerse`,
    description,
    keywords: Array.isArray(blog.tags) ? blog.tags : typeof blog.tags === 'string' ? JSON.parse(blog.tags) : [],
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${blog.title} | ThrillyVerse`,
      description,
      url: pageUrl,
      type: 'article',
      publishedTime: blog.published_at ?? blog.created_at,
      modifiedTime: blog.updated_at ?? blog.published_at,
      authors: [blog.author_id ? `Author ID: ${blog.author_id}` : 'ThrillyVerse'],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${blog.title} | ThrillyVerse`,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Helper to parse tags safely whether stored as stringified JSON or JS array
function parseTags(tags: any): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
  }
  return [];
}

// Helper to extract Headings for Table of Contents
function extractHeadings(contentHtml: string) {
  const regex = /(.*?)<\/h[1-3]>/g;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = regex.exec(contentHtml)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, '');
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ level: Number(match[1]), text, id });
  }

  return headings;
}

// Helper to inject IDs into content HTML tags for internal anchor jumping
function addHeadingIds(contentHtml: string): string {
  return contentHtml.replace(/(.*?)<\/h[1-3]>/g, (_, level, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '');
    const id = cleanText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return `${text}`;
  });
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const parsedTags = parseTags(blog.tags);
  const headings = extractHeadings(blog.content || '');
  const processedContent = addHeadingIds(blog.content || '');

  const publishedDate = blog.published_at || blog.created_at
    ? new Date(blog.published_at || blog.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const pageUrl = `\({SITE_URL}/blogs/\){blog.slug}`;

  // Article JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.cover_image ? [blog.cover_image] : [`${SITE_URL}/logo-192.png`],
    datePublished: blog.published_at || blog.created_at,
    dateModified: blog.updated_at || blog.published_at || blog.created_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Organization',
      name: 'ThrillyVerse',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ThrillyVerse',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo-192.png`,
      },
    },
    keywords: parsedTags.join(', '),
  };

  return (
    <>
