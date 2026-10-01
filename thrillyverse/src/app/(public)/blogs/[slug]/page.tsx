import type { Metadata } from 'next';
import Script from 'next/script';
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
    console.error('Blog query error:', error);
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
    // Not JSON. Try comma-separated tags below.
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

function processContent(content: string): {
  html: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const usedIds = new Map<string, number>();

  const headingRegex =
    /<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi;

  const html = content.replace(
    headingRegex,
    (
      fullMatch: string,
      levelText: string,
      attributes: string,
      innerHtml: string
    ) => {
      const level = Number(levelText);

      const headingText = decodeHtml(stripHtml(innerHtml));

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

      const attributesOutput = cleanedAttributes
        ? ` ${cleanedAttributes}`
        : '';

      return `<h${level} id="${id}"${attributesOutput}>${innerHtml}</h${level}>`;
    }
  );

  return {
    html,
    headings,
  };
}

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

async function getRelatedBlogs(
  currentId: string,
  category: string | null
): Promise<Blog[]> {
  const supabase = await createClient();

  let query = supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .neq('id', currentId)
    .order('published_at', {
      ascending: false,
    })
    .limit(4);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Related blogs error:', error);
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

  const tags = parseTags(blog.tags);

  const description =
    blog.excerpt ||
    `Read ${blog.title} on ThrillyVerse.`;

  const pageUrl =
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
      locale: 'en_IN',

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
  };
}

export default async function BlogSlugPage({
  params,
}: Props) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  const supabase = await createClient();

  const currentViews = Number(blog.view_count || 0);

  const { error: viewError } = await supabase
    .from('blogs')
    .update({
      view_count: currentViews + 1,
    })
    .eq('id', blog.id);

  if (viewError) {
    console.error(
      'View count update failed:',
      viewError
    );
  }

  const tags = parseTags(blog.tags);

  const rawContent = blog.content || '';

  const processed = processContent(rawContent);

  const contentHtml = processed.html;

  const headings = processed.headings;

  const publishedDate = formatDate(
    blog.published_at || blog.created_at
  );

  const pageUrl =
    `${SITE_URL}/blogs/${blog.slug}`;

  const imageUrl =
    blog.cover_image || DEFAULT_IMAGE;

  const wordCount =
    stripHtml(rawContent)
      .split(/\s+/)
      .filter(Boolean).length;

  const readingTime =
    Number(blog.read_time) > 0
      ? Number(blog.read_time)
      : Math.max(
          1,
          Math.ceil(wordCount / 200)
        );

  const relatedBlogs =
    await getRelatedBlogs(
      blog.id,
      blog.category
    );

  const publishedTime = toIsoDate(
    blog.published_at,
    blog.created_at
  );

  const modifiedTime = toIsoDate(
    blog.updated_at,
    blog.published_at || blog.created_at
  );

  const jsonLd = {
    '@context': 'https://schema.org',

    '@type': 'BlogPosting',

    headline: blog.title,

    description:
      blog.excerpt ||
      `Read ${blog.title} on ThrillyVerse.`,

    image: [imageUrl],

    url: pageUrl,

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
      url: SITE_URL,

      logo: {
        '@type': 'ImageObject',
        url: DEFAULT_IMAGE,
      },
    },

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

    ...(tags.length
      ? {
          keywords: tags.join(', '),
        }
      : {}),

    ...(blog.category
      ? {
          articleSection: blog.category,
        }
      : {}),

    timeRequired:
      `PT${readingTime}M`,
  };

  return (
    <>
      <Script
        id="thrillyverse-blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main
        style={{
          minHeight: '100vh',
          background: '#f7f8fc',
          color: '#171a21',
        }}
      >
        <div
          style={{
            width: 'min(1200px, calc(100% - 32px))',
            margin: '0 auto',
            padding: '32px 0 70px',
          }}
        >
          <nav
            aria-label="Breadcrumb"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '22px',
              fontSize: '14px',
              color: '#667085',
            }}
          >
            <a
              href="/"
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Home
            </a>

            <span>/</span>

            <a
              href="/blogs"
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Blogs
            </a>

            <span>/</span>

            <span>{blog.title}</span>
          </nav>

          <header
            style={{
              overflow: 'hidden',
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              boxShadow:
                '0 10px 35px rgba(16,24,40,.07)',
            }}
          >
            <div
              style={{
                width: '100%',
                aspectRatio: '1200 / 630',
                background: '#eef1f5',
              }}
            >
              <img
                src={imageUrl}
                alt={blog.title}
                width={1200}
                height={630}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            </div>

            <div
              style={{
                padding: 'clamp(24px, 5vw, 44px)',
              }}
            >
              {blog.category ? (
                <div
                  style={{
                    display: 'inline-block',
                    padding: '7px 12px',
                    marginBottom: '15px',
                    borderRadius: '999px',
                    background: '#eef2ff',
                    color: '#3730a3',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  {blog.category}
                </div>
              ) : null}

              <h1
                style={{
                  margin: 0,
                  maxWidth: '1000px',
                  fontSize:
                    'clamp(32px, 5vw, 58px)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.035em',
                  fontWeight: 800,
                }}
              >
                {blog.title}
              </h1>

              {blog.excerpt ? (
                <p
                  style={{
                    maxWidth: '900px',
                    margin:
                      '20px 0 0',
                    color: '#475467',
                    fontSize: '18px',
                    lineHeight: 1.7,
                  }}
                >
                  {blog.excerpt}
                </p>
              ) : null}

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px 18px',
                  marginTop: '22px',
                  color: '#667085',
                  fontSize: '14px',
                }}
              >
                <span>
                  By <strong>ThrillyVerse</strong>
                </span>

                {publishedDate ? (
                  <span>
                    Published {publishedDate}
                  </span>
                ) : null}

                <span>
                  {readingTime} min read
                </span>

                <span>
                  {currentViews + 1} views
                </span>
              </div>
            </div>
          </header>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                headings.length > 0
                  ? 'minmax(0, 1fr) 280px'
                  : 'minmax(0, 1fr)',
              gap: '28px',
              alignItems: 'start',
              marginTop: '28px',
            }}
          >
            <article
              style={{
                minWidth: 0,
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '22px',
                padding:
                  'clamp(22px, 4vw, 48px)',
                boxShadow:
                  '0 8px 30px rgba(16,24,40,.05)',
              }}
            >
              <div
                className="thrillyverse-blog-content"
                dangerouslySetInnerHTML={{
                  __html: contentHtml,
                }}
              />

              {tags.length > 0 ? (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginTop: '30px',
                    paddingTop: '22px',
                    borderTop:
                      '1px solid #eaecf0',
                  }}
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        padding:
                          '7px 10px',
                        borderRadius:
                          '999px',
                        background:
                          '#f2f4f7',
                        color:
                          '#475467',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </article>

            {headings.length > 0 ? (
              <aside
                style={{
                  position: 'sticky',
                  top: '20px',
                  background: '#ffffff',
                  border:
                    '1px solid #e5e7eb',
                  borderRadius: '20px',
                  padding: '20px',
                  boxShadow:
                    '0 8px 25px rgba(16,24,40,.05)',
                }}
              >
                <h2
                  style={{
                    margin:
                      '0 0 14px',
                    fontSize: '17px',
                    fontWeight: 800,
                  }}
                >
                  In this article
                </h2>

                <nav
                  aria-label="Table of contents"
                  style={{
                    display: 'flex',
                    flexDirection:
                      'column',
                    gap: '7px',
                  }}
                >
                  {headings.map(
                    (heading) => (
                      <a
                        key={heading.id}
                        href={`#${heading.id}`}
                        style={{
                          color:
                            '#667085',
                          textDecoration:
                            'none',
                          fontSize:
                            heading.level ===
                            3
                              ? '13px'
                              : '14px',
                          lineHeight: 1.4,
                          paddingLeft:
                            heading.level ===
                            2
                              ? '8px'
                              : heading.level ===
                                3
                              ? '18px'
                              : '0',
                        }}
                      >
                        {heading.text}
                      </a>
                    )
                  )}
                </nav>
              </aside>
            ) : null}
          </div>

          {relatedBlogs.length > 0 ? (
            <section
              style={{
                marginTop: '32px',
              }}
            >
              <h2
                style={{
                  margin:
                    '0 0 18px',
                  fontSize: '28px',
                  letterSpacing:
                    '-0.02em',
                }}
              >
                More from ThrillyVerse
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(3, minmax(0, 1fr))',
                  gap: '18px',
                }}
              >
                {relatedBlogs
                  .slice(0, 3)
                  .map(
                    (related) => (
                      <a
                        key={
                          related.id
                        }
                        href={`/blogs/${related.slug}`}
                        style={{
                          display:
                            'block',
                          overflow:
                            'hidden',
                          background:
                            '#ffffff',
                          border:
                            '1px solid #e5e7eb',
                          borderRadius:
                            '18px',
                          color:
                            'inherit',
                          textDecoration:
                            'none',
                        }}
                      >
                        <div
                          style={{
                            aspectRatio:
                              '16 / 9',
                            background:
                              '#eef1f5',
                          }}
                        >
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
                            style={{
                              width:
                                '100%',
                              height:
                                '100%',
                              objectFit:
                                'cover',
                              display:
                                'block',
                            }}
                          />
                        </div>

                        <div
                          style={{
                            padding:
                              '16px',
                          }}
                        >
                          <h3
                            style={{
                              margin: 0,
                              fontSize:
                                '17px',
                              lineHeight:
                                1.35,
                            }}
                          >
                            {
                              related.title
                            }
                          </h3>

                          <p
                            style={{
                              margin:
                                '9px 0 0',
                              color:
                                '#667085',
                              fontSize:
                                '13px',
                              lineHeight:
                                1.55,
                            }}
                          >
                            {(
                              related.excerpt ||
                              'Explore another article from ThrillyVerse.'
                            ).slice(
                              0,
                              150
                            )}
                            ...
                          </p>
                        </div>
                      </a>
                    )
                  )}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
