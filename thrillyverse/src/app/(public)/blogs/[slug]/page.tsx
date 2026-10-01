import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const SITE_URL = 'https://thrillyverse.com';
const DEFAULT_IMAGE = `${SITE_URL}/logo-192.png`;

export const revalidate = 3600;

type Props = {
  params: {
    slug: string;
  };
};

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: unknown;
  read_time: number | null;
  featured: boolean | null;
  published: boolean | null;
  published_at: string | null;
  view_count: number | null;
  author_id: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type Heading = {
  level: number;
  text: string;
  id: string;
};

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (error) {
    console.error('Error loading blog:', error);
    return null;
  }

  return (data as Blog | null) ?? null;
}

function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof tags === 'string') {
    const trimmed = tags.trim();

    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed
          .filter((tag): tag is string => typeof tag === 'string')
          .map((tag) => tag.trim())
          .filter(Boolean);
      }
    } catch {
      // Fall back to comma-separated tags.
    }

    return trimmed
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeBasicHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function createHeadingId(text: string): string {
  const cleaned = decodeBasicHtmlEntities(stripHtml(text))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return cleaned || 'section';
}

function processContent(contentHtml: string): {
  html: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();

  const regex = /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const html = contentHtml.replace(
    regex,
    (_match, levelString: string, attributes: string, innerHtml: string) => {
      const level = Number(levelString);

      const text = decodeBasicHtmlEntities(stripHtml(innerHtml));

      let baseId = createHeadingId(text);
      let id = baseId;

      const existingCount = usedIds.get(baseId) ?? 0;

      if (existingCount > 0) {
        id = `${baseId}-${existingCount + 1}`;
      }

      usedIds.set(baseId, existingCount + 1);

      headings.push({
        level,
        text,
        id,
      });

      const cleanedAttributes = (attributes || '')
        .replace(
          /\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
          ''
        )
        .trim();

      const attributeString = cleanedAttributes
        ? ` ${cleanedAttributes}`
        : '';

      return `<h${level} id="${id}"${attributeString}>${innerHtml}</h${level}>`;
    }
  );

  return {
    html,
    headings,
  };
}

function formatDate(dateValue: string | null): string | null {
  if (!dateValue) {
    return null;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function safeDateValue(
  primary: string | null,
  fallback: string | null
): string | undefined {
  const value = primary || fallback;

  if (!value) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
}

async function getRelatedBlogs(
  currentBlogId: string,
  category: string | null
): Promise<Blog[]> {
  const supabase = await createClient();

  let query = supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .neq('id', currentBlogId)
    .order('published_at', { ascending: false })
    .limit(4);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error loading related blogs:', error);
    return [];
  }

  return (data as Blog[]) ?? [];
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | ThrillyVerse',
      description:
        'The requested ThrillyVerse article could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description =
    blog.excerpt ||
    `Read ${blog.title} on ThrillyVerse — technology, creators, projects, education and digital culture.`;

  const pageUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const imageUrl = blog.cover_image || DEFAULT_IMAGE;
  const tags = parseTags(blog.tags);

  const publishedTime = safeDateValue(
    blog.published_at,
    blog.created_at
  );

  const modifiedTime = safeDateValue(
    blog.updated_at,
    blog.published_at || blog.created_at
  );

  return {
    title: `${blog.title} | ThrillyVerse`,
    description,
    keywords: tags,

    alternates: {
      canonical: pageUrl,
    },

    openGraph: {
      title: `${blog.title} | ThrillyVerse`,
      description,
      url: pageUrl,
      siteName: 'ThrillyVerse',
      type: 'article',

      ...(publishedTime
        ? {
            publishedTime,
          }
        : {}),

      ...(modifiedTime
        ? {
            modifiedTime,
          }
        : {}),

      authors: ['ThrillyVerse'],

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
        'max-video-preview': -1,
      },
    },

    category: blog.category || undefined,
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  /*
   * Increment the view counter.
   *
   * This is intentionally done after the article is found.
   * Errors are logged but do not break the article page.
   */
  const supabase = await createClient();

  const currentViews = Number(blog.view_count || 0);

  const { error: viewError } = await supabase
    .from('blogs')
    .update({
      view_count: currentViews + 1,
    })
    .eq('id', blog.id);

  if (viewError) {
    console.error('Unable to increment blog view count:', viewError);
  }

  const tags = parseTags(blog.tags);

  const content = blog.content || '';

  const processed = processContent(content);

  const processedContent = processed.html;
  const headings = processed.headings;

  const publishedDate = formatDate(
    blog.published_at || blog.created_at
  );

  const pageUrl = `${SITE_URL}/blogs/${blog.slug}`;

  const imageUrl = blog.cover_image || DEFAULT_IMAGE;

  const readingTime =
    Number(blog.read_time) > 0
      ? Number(blog.read_time)
      : Math.max(
          1,
          Math.ceil(stripHtml(content).split(/\s+/).length / 200)
        );

  const relatedBlogs = await getRelatedBlogs(
    blog.id,
    blog.category
  );

  const publishedTime = safeDateValue(
    blog.published_at,
    blog.created_at
  );

  const modifiedTime = safeDateValue(
    blog.updated_at,
    blog.published_at || blog.created_at
  );

  /*
   * JSON-LD structured data for search engines.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',

    headline: blog.title,

    description:
      blog.excerpt ||
      `Read ${blog.title} on ThrillyVerse.`,

    image: [imageUrl],

    ...(publishedTime
      ? {
          datePublished: publishedTime,
        }
      : {}),

    ...(modifiedTime
      ? {
          dateModified: modifiedTime,
        }
      : {}),

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },

    url: pageUrl,

    author: {
      '@type': 'Organization',
      name: 'ThrillyVerse',
      url: SITE_URL,
    },

    publisher: {
      '@type': 'Organization',
      name: 'ThrillyVerse',
      url: SITE_URL,

      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },

    ...(tags.length > 0
      ? {
          keywords: tags.join(', '),
        }
      : {}),

    ...(blog.category
      ? {
          articleSection: blog.category,
        }
      : {}),

    timeRequired: `PT${readingTime}M`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .tv-blog-page {
              min-height: 100vh;
              background: #f7f8fc;
              color: #151922;
            }

            .tv-blog-container {
              width: min(1200px, calc(100% - 32px));
              margin: 0 auto;
              padding: 40px 0 80px;
            }

            .tv-blog-breadcrumbs {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              align-items: center;
              margin-bottom: 24px;
              font-size: 14px;
              color: #667085;
            }

            .tv-blog-breadcrumbs a {
              color: inherit;
              text-decoration: none;
            }

            .tv-blog-breadcrumbs a:hover {
              text-decoration: underline;
            }

            .tv-blog-hero {
              overflow: hidden;
              border: 1px solid #e5e7eb;
              border-radius: 24px;
              background: #ffffff;
              box-shadow: 0 12px 40px rgba(16, 24, 40, 0.08);
            }

            .tv-blog-cover {
              position: relative;
              width: 100%;
              aspect-ratio: 1200 / 630;
              background: #eef1f5;
            }

            .tv-blog-cover img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            .tv-blog-header {
              padding: 34px;
            }

            .tv-blog-badge {
              display: inline-flex;
              align-items: center;
              padding: 7px 12px;
              border-radius: 999px;
              background: #eef2ff;
              color: #3730a3;
              font-size: 13px;
              font-weight: 700;
              margin-bottom: 16px;
            }

            .tv-blog-title {
              margin: 0;
              font-size: clamp(32px, 5vw, 58px);
              line-height: 1.05;
              letter-spacing: -0.035em;
              font-weight: 850;
              max-width: 1000px;
            }

            .tv-blog-excerpt {
              margin: 20px 0 0;
              max-width: 900px;
              font-size: 19px;
              line-height: 1.7;
              color: #475467;
            }

            .tv-blog-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 10px 18px;
              margin-top: 22px;
              color: #667085;
              font-size: 14px;
            }

            .tv-blog-layout {
              display: grid;
              grid-template-columns: minmax(0, 1fr) 290px;
              gap: 28px;
              align-items: start;
              margin-top: 28px;
            }

            .tv-blog-article,
            .tv-blog-sidebar {
              border: 1px solid #e5e7eb;
              border-radius: 22px;
              background: #ffffff;
              box-shadow: 0 8px 30px rgba(16, 24, 40, 0.05);
            }

            .tv-blog-article {
              min-width: 0;
              padding: clamp(24px, 4vw, 48px);
            }

            .tv-blog-content {
              font-size: 18px;
              line-height: 1.85;
              color: #202531;
              overflow-wrap: anywhere;
            }

            .tv-blog-content h1,
            .tv-blog-content h2,
            .tv-blog-content h3 {
              scroll-margin-top: 100px;
              color: #111827;
              line-height: 1.2;
              letter-spacing: -0.025em;
            }

            .tv-blog-content h1 {
              font-size: 2.1rem;
              margin: 2.2em 0 0.8em;
            }

            .tv-blog-content h2 {
              font-size: 1.65rem;
              margin: 2em 0 0.7em;
            }

            .tv-blog-content h3 {
              font-size: 1.3rem;
              margin: 1.7em 0 0.6em;
            }

            .tv-blog-content p {
              margin: 1em 0;
            }

            .tv-blog-content a {
              color: #4f46e5;
              font-weight: 600;
              text-decoration: underline;
              text-underline-offset: 3px;
            }

            .tv-blog-content img {
              display: block;
              width: 100%;
              max-width: 100%;
              height: auto;
              border-radius: 16px;
              margin: 24px auto;
            }

            .tv-blog-content ul,
            .tv-blog-content ol {
              padding-left: 1.5rem;
              margin: 1.2em 0;
            }

            .tv-blog-content li {
              margin: 0.45em 0;
            }

            .tv-blog-content blockquote {
              margin: 24px 0;
              padding: 18px 22px;
              border-left: 4px solid #4f46e5;
              background: #f8f7ff;
              border-radius: 10px;
              color: #475467;
            }

            .tv-blog-content pre {
              overflow-x: auto;
              padding: 18px;
              border-radius: 14px;
              background: #111827;
              color: #f9fafb;
            }

            .tv-blog-content code {
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            }

            .tv-blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 24px 0;
              display: block;
              overflow-x: auto;
            }

            .tv-blog-content th,
            .tv-blog-content td {
              padding: 11px 14px;
              border: 1px solid #e5e7eb;
              text-align: left;
              vertical-align: top;
              min-width: 140px;
            }

            .tv-blog-content th {
              background: #f8fafc;
              font-weight: 700;
            }

            .tv-blog-sidebar {
              position: sticky;
              top: 24px;
              padding: 22px;
            }

            .tv-blog-sidebar-title {
              margin: 0 0 15px;
              font-size: 17px;
              font-weight: 800;
              color: #111827;
            }

            .tv-blog-toc {
              display: flex;
              flex-direction: column;
              gap: 7px;
            }

            .tv-blog-toc a {
              color: #667085;
              text-decoration: none;
              font-size: 14px;
              line-height: 1.4;
              padding: 4px 0;
            }

            .tv-blog-toc a:hover {
              color: #4f46e5;
            }

            .tv-blog-toc .level-2 {
              padding-left: 8px;
              color: #344054;
            }

            .tv-blog-toc .level-3 {
              padding-left: 18px;
              font-size: 13px;
            }

            .tv-blog-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 28px;
              padding-top: 22px;
              border-top: 1px solid #eaecf0;
            }

            .tv-blog-tag {
              border-radius: 999px;
              background: #f2f4f7;
              color: #475467;
              padding: 7px 10px;
              font-size: 12px;
              font-weight: 600;
            }

            .tv-blog-related {
              margin-top: 30px;
            }

            .tv-blog-related h2 {
              margin: 0 0 18px;
              font-size: 27px;
              letter-spacing: -0.02em;
            }

            .tv-blog-related-grid {
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 18px;
            }

            .tv-blog-related-card {
              overflow: hidden;
              border: 1px solid #e5e7eb;
              border-radius: 18px;
              background: #ffffff;
              text-decoration: none;
              color: inherit;
              box-shadow: 0 8px 24px rgba(16, 24, 40, 0.04);
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }

            .tv-blog-related-card:hover {
              transform: translateY(-3px);
              box-shadow: 0 14px 32px rgba(16, 24, 40, 0.09);
            }

            .tv-blog-related-image {
              aspect-ratio: 16 / 9;
              background: #eef1f5;
              overflow: hidden;
            }

            .tv-blog-related-image img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              display: block;
            }

            .tv-blog-related-body {
              padding: 16px;
            }

            .tv-blog-related-body h3 {
              margin: 0;
              font-size: 17px;
              line-height: 1.35;
            }

            .tv-blog-related-body p {
              margin: 9px 0 0;
              color: #667085;
              font-size: 13px;
              line-height: 1.55;
            }

            @media (max-width: 900px) {
              .tv-blog-layout {
                grid-template-columns: 1fr;
              }

              .tv-blog-sidebar {
                position: static;
                order: -1;
              }

              .tv-blog-related-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
              }
            }

            @media (max-width: 600px) {
              .tv-blog-container {
                width: min(100% - 20px, 1200px);
                padding-top: 20px;
              }

              .tv-blog-header {
                padding: 24px 20px;
              }

              .tv-blog-article {
                padding: 22px 18px;
              }

              .tv-blog-excerpt {
                font-size: 16px;
              }

              .tv-blog-content {
                font-size: 16px;
                line-height: 1.75;
              }

              .tv-blog-related-grid {
                grid-template-columns: 1fr;
              }
            }
          `,
        }}
      />

      <main className="tv-blog-page">
        <div className="tv-blog-con
