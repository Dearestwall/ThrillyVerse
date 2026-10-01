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
                : 'lg:grid-cols-1',
            ].join(' ')}
          >
            {/* Article */}
            <article className="min-w-0">
              <div className="rounded-[1.75rem] border border-border bg-card px-5 py-7 shadow-xl shadow-black/5 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                {/* Screen-reader article label */}
                <div className="sr-only">
                  <h2>
                    {blog.title} article
                  </h2>
                </div>

                <div
                  className="
                    prose prose-lg max-w-none
                    dark:prose-invert
                    prose-headings:scroll-mt-24
                    prose-headings:font-bold
                    prose-h2:mt-12
                    prose-h2:text-2xl
                    prose-h3:mt-10
                    prose-h3:text-xl
                    prose-p:leading-8
                    prose-a:font-semibold
                    prose-a:underline
                    prose-a:underline-offset-4
                    prose-img:mx-auto
                    prose-img:rounded-2xl
                    prose-img:border
                    prose-img:border-border
                    prose-blockquote:rounded-r-xl
                    prose-blockquote:border-l-4
                    prose-blockquote:bg-muted/40
                    prose-blockquote:px-5
                    prose-blockquote:py-2
                    prose-code:rounded
                    prose-code:bg-muted
                    prose-code:px-1.5
                    prose-code:py-0.5
                    prose-code:before:content-none
                    prose-code:after:content-none
                    prose-pre:overflow-x-auto
                    prose-pre:rounded-2xl
                    prose-table:block
                    prose-table:overflow-x-auto
                  "
                  dangerouslySetInnerHTML={{
                    __html: articleHtml,
                  }}
                />

                {/* Tags */}
                {tags.length > 0 ? (
                  <div className="mt-10 border-t border-border pt-6">
                    <div className="mb-3 text-sm font-bold">
                      Topics
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {tags.map(
                        (tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Share */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-sm font-bold">
                        Share this article
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Help others discover this article.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                          canonicalUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                      >
                        LinkedIn
                      </a>

                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                          blog.title
                        )}&url=${encodeURIComponent(
                          canonicalUrl
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                      >
                        X
                      </a>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `${blog.title} — ${canonicalUrl}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold transition hover:bg-muted"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Table of contents */}
            {headings.length > 0 ? (
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <details
                  open
                  className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/5"
                >
                  <summary className="cursor-pointer list-none text-base font-bold">
                    <span className="flex items-center justify-between gap-4">
                      <span>
                        In this article
                      </span>

                      <span
                        aria-hidden="true"
                        className="text-muted-foreground"
                      >
                        ☰
                      </span>
                    </span>
                  </summary>

                  <nav
                    aria-label="Table of contents"
                    className="mt-5"
                  >
                    <div className="flex flex-col">
                      {headings.map(
                        (heading) => (
                          <a
                            key={
                              heading.id
                            }
                            href={`#${heading.id}`}
                            className={[
                              'border-l-2 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground',
                              heading.level ===
                              2
                                ? 'border-border pl-3 font-medium'
                                : 'border-border pl-7 text-xs',
                            ].join(' ')}
                          >
                            {heading.text}
                          </a>
                        )
                      )}
                    </div>
                  </nav>
                </details>

                {/* Article summary card */}
                <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/5">
                  <div className="text-sm font-bold">
                    Article details
                  </div>

                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">
                        Category
                      </dt>

                      <dd className="text-right font-medium">
                        {blog.category ||
                          'Article'}
                      </dd>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">
                        Reading time
                      </dt>

                      <dd className="text-right font-medium">
                        {readingTime} min
                      </dd>
                    </div>

                    {wordCount > 0 ? (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-muted-foreground">
                          Word count
                        </dt>

                        <dd className="text-right font-medium">
                          {wordCount.toLocaleString(
                            'en-IN'
                          )}
                        </dd>
                      </div>
                    ) : null}

                    {publishedDate ? (
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-muted-foreground">
                          Published
                        </dt>

                        <dd className="text-right font-medium">
                          {publishedDate}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </aside>
            ) : null}
          </div>
        </div>

        {/* Related articles */}
        {visibleRelatedBlogs.length >
        0 ? (
          <section
            aria-labelledby="related-articles-heading"
            className="container mx-auto px-4 pb-20 sm:px-6 lg:px-8"
          >
            <div className="mx-auto max-w-7xl">
              <div className="mb-7 flex flex-col gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Keep reading
                </p>

                <h2
                  id="related-articles-heading"
                  className="text-2xl font-black tracking-tight sm:text-3xl"
                >
                  More from ThrillyVerse
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {visibleRelatedBlogs.map(
                  (related) => (
                    <article
                      key={related.id}
                      className="group overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <a
                        href={`/blogs/${related.slug}`}
                        className="block"
                      >
                        <div className="aspect-[16/9] overflow-hidden bg-muted">
                          <img
                            src={
                              related.cover_image ||
                              DEFAULT_IMAGE
                            }
                            alt={
                              related.title
                            }
                            width={800}
                            height={450}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="p-5">
                          {related.category ? (
                            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                              {
                                related.category
                              }
                            </span>
                          ) : null}

                          <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug transition-colors group-hover:text-violet-500">
                            {
                              related.title
                            }
                          </h3>

                          {related.excerpt ? (
                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                              {
                                related.excerpt
                              }
                            </p>
                          ) : null}

                          <div className="mt-4 text-sm font-semibold">
                            Read article →
                          </div>
                        </div>
                      </a>
                    </article>
                  )
                )}
              </div>
            </div>
          </section>
        ) : null}

        {/* Bottom navigation */}
        <section className="container mx-auto px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-lg shadow-black/5 sm:flex-row sm:text-left">
            <div>
              <div className="font-bold">
                Explore more ThrillyVerse articles
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Discover more guides, ideas, technology,
                social media and digital topics.
              </p>
            </div>

            <a
              href="/blogs"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-foreground px-5 py-2.5 text-sm font-bold text-background transition hover:opacity-90"
            >
              Browse all blogs
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
