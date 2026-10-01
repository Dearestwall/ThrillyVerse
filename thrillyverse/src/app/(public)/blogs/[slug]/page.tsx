import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ||
  'https://thrillyverse.com';

const SITE_NAME = 'ThrillyVerse';
const DEFAULT_IMAGE = `${SITE_URL}/logo-192.png`;

type Params = {
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
  level: 2 | 3;
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
    console.error('Blog query error:', error);
    return null;
  }

  return (data as Blog | null) ?? null;
}

async function getRelatedBlogs(
  currentId: string,
  category: string | null
): Promise<Blog[]> {
  const supabase = await createClient();

  let query = supabase
    .from('blogs')
    .select(
      'id,title,slug,excerpt,content,cover_image,category,tags,read_time,featured,published,published_at,view_count,author_id,created_at,updated_at'
    )
    .eq('published', true)
    .neq('id', currentId)
    .order('published_at', {
      ascending: false,
    })
    .limit(6);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Related blogs query error:', error);
    return [];
  }

  return (data as Blog[]) ?? [];
}

function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) {
    return tags
      .filter((tag): tag is string => typeof tag === 'string')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  if (typeof tags !== 'string') {
    return [];
  }

  const value = tags.trim();

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  } catch {
    // Continue with comma-separated parsing.
  }

  // Supports PostgreSQL-style arrays such as:
  // {Instagram,SEO,YouTube}
  if (value.startsWith('{') && value.endsWith('}')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((tag) => tag.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  }

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function createHeadingId(text: string): string {
  const id = decodeHtml(stripHtml(text))
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return id || 'section';
}

function prepareArticleHtml(
  content: string
): {
  html: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();

  /*
   * This strips content that should never be part of an article.
   *
   * For true application-wide XSS protection, sanitize article HTML
   * before it is stored in Supabase as well.
   */
  let safeHtml = content
    .replace(
      /<(script|style|noscript|iframe|object)\b[^>]*>[\s\S]*?<\/\1>/gi,
      ''
    )
    .replace(/<(embed|base|meta|link)\b[^>]*>/gi, '')
    .replace(/\s+on[a-z]+\s*=\s*(["']).*?\1/gi, '')
    .replace(
      /\s+(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi,
      ''
    );

  /*
   * Add IDs to H1/H2/H3 automatically.
   *
   * The page already contains the article title as the main H1,
   * so an H1 inside stored content is converted to H2.
   */
  const headingRegex =
    /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  safeHtml = safeHtml.replace(
    headingRegex,
    (
      _fullMatch: string,
      levelText: string,
      attributes: string,
      innerHtml: string
    ) => {
      const originalLevel = Number(levelText);

      const level: 2 | 3 =
        originalLevel <= 2 ? 2 : 3;

      const headingText = decodeHtml(
        stripHtml(innerHtml)
      );

      const baseId = createHeadingId(headingText);

      const count = usedIds.get(baseId) ?? 0;

      const id =
        count === 0
          ? baseId
          : `${baseId}-${count + 1}`;

      usedIds.set(baseId, count + 1);

      headings.push({
        level,
        text: headingText,
        id,
      });

      const cleanedAttributes = (attributes || '')
        .replace(
          /\s+id\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
          ''
        )
        .trim();

      const attributeOutput = cleanedAttributes
        ? ` ${cleanedAttributes}`
        : '';

      return `<h${level} id="${id}"${attributeOutput}>${innerHtml}</h${level}>`;
    }
  );

  return {
    html: safeHtml,
    headings,
  };
}

function formatDate(
  value: string | null
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function toIsoDate(
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

function getWordCount(content: string): number {
  const text = stripHtml(content);

  if (!text) {
    return 0;
  }

  return text
    .split(/\s+/)
    .filter(Boolean).length;
}

function getReadingTime(
  readTime: number | null,
  wordCount: number
): number {
  if (Number(readTime) > 0) {
    return Number(readTime);
  }

  return Math.max(
    1,
    Math.ceil(wordCount / 200)
  );
}

function safeJsonLd(
  value: unknown
): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    return {
      title: 'Blog Not Found | ThrillyVerse',
      description:
        'The requested article could not be found on ThrillyVerse.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const tags = parseTags(blog.tags);

  const title = blog.title.trim();

  const description = (
    blog.excerpt ||
    `Read ${title} on ThrillyVerse.`
  ).trim();

  const canonicalUrl =
    `${SITE_URL}/blogs/${blog.slug}`;

  const imageUrl =
    blog.cover_image || DEFAULT_IMAGE;

  const publishedTime = toIsoDate(
    blog.published_at,
    blog.created_at
  );

  const modifiedTime = toIsoDate(
    blog.updated_at,
    blog.published_at || blog.created_at
  );

  return {
    metadataBase: new URL(SITE_URL),

    title: `${title} | ${SITE_NAME}`,

    description,

    keywords: tags,

    authors: [
      {
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],

    creator: SITE_NAME,

    publisher: SITE_NAME,

    alternates: {
      canonical: canonicalUrl,
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

    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
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

      authors: [SITE_URL],

      section:
        blog.category || 'Blog',

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [imageUrl],
    },

    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function BlogSlugPage({
  params,
}: Params) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const tags = parseTags(blog.tags);

  const rawContent = blog.content || '';

  const {
    html: articleHtml,
    headings,
  } = prepareArticleHtml(rawContent);

  const publishedDate = formatDate(
    blog.published_at || blog.created_at
  );

  const modifiedDate =
    blog.updated_at &&
    blog.updated_at !== blog.published_at
      ? formatDate(blog.updated_at)
      : null;

  const publishedTime = toIsoDate(
    blog.published_at,
    blog.created_at
  );

  const modifiedTime = toIsoDate(
    blog.updated_at,
    blog.published_at || blog.created_at
  );

  const wordCount = getWordCount(
    rawContent
  );

  const readingTime = getReadingTime(
    blog.read_time,
    wordCount
  );

  const canonicalUrl =
    `${SITE_URL}/blogs/${blog.slug}`;

  const imageUrl =
    blog.cover_image || DEFAULT_IMAGE;

  const relatedBlogs =
    await getRelatedBlogs(
      blog.id,
      blog.category
    );

  const visibleRelatedBlogs =
    relatedBlogs.slice(0, 3);

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',

    '@id': `${canonicalUrl}#article`,

    headline: blog.title,

    description:
      blog.excerpt ||
      `Read ${blog.title} on ${SITE_NAME}.`,

    url: canonicalUrl,

    image: [imageUrl],

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },

    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },

    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },

    ...(publishedTime
      ? {
          datePublished:
            publishedTime,
        }
      : {}),

    ...(modifiedTime
      ? {
          dateModified:
            modifiedTime,
        }
      : {}),

    ...(tags.length
      ? {
          keywords:
            tags.join(', '),
        }
      : {}),

    ...(blog.category
      ? {
          articleSection:
            blog.category,
        }
      : {}),

    wordCount,

    timeRequired:
      `PT${readingTime}M`,

    inLanguage: 'en-IN',
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogs',
        item: `${SITE_URL}/blogs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <Script
        id="blog-posting-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            articleJsonLd
          ),
        }}
      />

      <Script
        id="blog-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLd(
            breadcrumbJsonLd
          ),
        }}
      />

      <main className="min-h-screen bg-background text-foreground">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute left-[-140px] top-[-140px] h-[320px] w-[320px] rounded-full bg-violet-500/10 blur-3xl" />
          <div className="absolute right-[-120px] top-[20%] h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-3xl" />
          <div className="absolute bottom-[-140px] left-[25%] h-[320px] w-[320px] rounded-full bg-blue-500/10 blur-3xl" />
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-6 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 text-sm text-muted-foreground"
          >
            <a
              href="/"
              className="transition-colors hover:text-foreground"
            >
              Home
            </a>

            <span aria-hidden="true">/</span>

            <a
              href="/blogs"
              className="transition-colors hover:text-foreground"
            >
              Blogs
            </a>

            <span aria-hidden="true">/</span>

            <span
              className="max-w-[250px] truncate sm:max-w-[500px]"
              aria-current="page"
            >
              {blog.title}
            </span>
          </nav>
        </div>

        {/* Hero */}
        <header className="container mx-auto px-4 pb-8 pt-8 sm:px-6 lg:px-8 lg:pt-12">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card/70 shadow-2xl shadow-black/5 backdrop-blur">
            <div className="relative overflow-hidden">
              {blog.cover_image ? (
                <div className="relative aspect-[16/8.5] min-h-[240px] w-full overflow-hidden bg-muted">
                  <img
                    src={blog.cover_image}
                    alt={blog.title}
                    width={1600}
                    height={850}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"
                  />

                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
                    {blog.category ? (
                      <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                        {blog.category}
                      </div>
                    ) : null}

                    <h1 className="max-w-5xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-6xl">
                      {blog.title}
                    </h1>

                    {blog.excerpt ? (
                      <p className="mt-4 max-w-4xl text-base leading-7 text-white/85 sm:text-lg">
                        {blog.excerpt}
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-fuchsia-500/10"
                  />

                  <div className="relative">
                    {blog.category ? (
                      <div className="mb-4 inline-flex rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {blog.category}
                      </div>
                    ) : null}

                    <h1 className="max-w-5xl text-3xl font-black tracking-tight sm:text-4xl lg:text-6xl">
                      {blog.title}
                    </h1>

                    {blog.excerpt ? (
                      <p className="mt-5 max-w-4xl text-base leading-7 text-muted-foreground sm:text-lg">
                        {blog.excerpt}
                      </p>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Article information */}
            <div className="border-t border-border px-6 py-5 sm:px-8 lg:px-12">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 rounded-full bg-current"
                  />
                  By{' '}
                  <strong className="font-semibold text-foreground">
                    ThrillyVerse
                  </strong>
                </span>

                {publishedDate ? (
                  <time
                    dateTime={
                      publishedTime
                    }
                    className="inline-flex items-center gap-2"
                  >
                    <span aria-hidden="true">
                      •
                    </span>
                    Published{' '}
                    {publishedDate}
                  </time>
                ) : null}

                {modifiedDate ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">
                      •
                    </span>
                    Updated{' '}
                    {modifiedDate}
                  </span>
                ) : null}

                <span className="inline-flex items-center gap-2">
                  <span aria-hidden="true">
                    •
                  </span>
                  {readingTime} min read
                </span>

                {wordCount > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">
                      •
                    </span>
                    {wordCount.toLocaleString(
                      'en-IN'
                    )}{' '}
                    words
                  </span>
                ) : null}

                {blog.view_count !== null &&
                Number(blog.view_count) > 0 ? (
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true">
                      •
                    </span>
                    {Number(
                      blog.view_count
                    ).toLocaleString('en-IN')}{' '}
                    views
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        {/* Main article area */}
        <div className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div
            className={[
              'mx-auto grid max-w-7xl gap-8',
              headings.length > 0
                ? 'lg:grid-cols-[minmax(0,1fr)_290px]'
         
