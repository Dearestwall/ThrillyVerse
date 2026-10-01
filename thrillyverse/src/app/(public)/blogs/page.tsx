import type { Metadata } from 'next';
import Script from 'next/script';
import { createClient } from '@/lib/supabase/server';
import { BlogsGrid } from '@/components/sections/blogs/BlogsGrid';
import type { Blog } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(
    /\/+$/,
    ''
  ) || 'https://thrillyverse.com';

const SITE_NAME = 'ThrillyVerse';

const DEFAULT_IMAGE =
  `${SITE_URL}/logo-192.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: 'Blogs | ThrillyVerse',

  description:
    'Explore useful articles, guides, digital trends, technology, social media, learning and ThrillyVerse project updates.',

  keywords: [
    'ThrillyVerse blogs',
    'ThrillyVerse',
    'digital trends',
    'social media',
    'technology',
    'learning',
    'digital projects',
    'online guides',
  ],

  alternates: {
    canonical: `${SITE_URL}/blogs`,
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
    title: 'Blogs | ThrillyVerse',
    description:
      'Explore useful articles, guides, digital trends, technology, social media, learning and ThrillyVerse project updates.',
    url: `${SITE_URL}/blogs`,
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: 'ThrillyVerse Blogs',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Blogs | ThrillyVerse',
    description:
      'Explore useful articles, guides, digital trends, technology, social media, learning and ThrillyVerse project updates.',
    images: [DEFAULT_IMAGE],
  },
};

function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

export default async function BlogsPage() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', {
      ascending: false,
      nullsFirst: false,
    });

  if (error) {
    console.error(
      'BLOGS PAGE SUPABASE ERROR:',
      error
    );
  }

  const blogs =
    (data ?? []) as Blog[];

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id':
      `${SITE_URL}/blogs#collection`,
    url:
      `${SITE_URL}/blogs`,
    name:
      'Blogs | ThrillyVerse',
    description:
      'Articles, guides, digital trends, social media, technology, learning and projects from ThrillyVerse.',
    isPartOf: {
      '@type': 'WebSite',
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
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems:
        blogs.length,
      itemListElement:
        blogs.map(
          (blog, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: blog.title,
            url:
              `${SITE_URL}/blogs/${blog.slug}`,
          })
        ),
    },
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
        item:
          `${SITE_URL}/blogs`,
      },
    ],
  };

  return (
    <>
      <Script
        id="blogs-collection-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              collectionJsonLd
            ),
        }}
      />

      <Script
        id="blogs-breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            safeJsonLd(
              breadcrumbJsonLd
            ),
        }}
      />

      <main className="page-wrapper">
        {/* Hero */}
        <section className="page-hero blogs-hero">
          <div className="page-hero-inner">
            <div className="page-eyebrow">
              ThrillyVerse Articles
            </div>

            <h1 className="page-title">
              Blogs
            </h1>

            <p className="page-subtitle">
              Explore useful articles,
              guides, digital trends,
              technology, social media,
              learning and ThrillyVerse
              project updates.
            </p>

            {blogs.length > 0 ? (
              <div className="mt-5">
                <span
                  className="
                    inline-flex
                    rounded-full
                    border
                    border-border
                    bg-background/50
                    px-4
                    py-2
                    text-sm
                    text-text-muted
                    backdrop-blur
                  "
                >
                  {blogs.length}{' '}
                  {blogs.length === 1
                    ? 'published article'
                    : 'published articles'}
                </span>
              </div>
            ) : null}
          </div>

          <div
            aria-hidden="true"
            className="
              page-hero-glow
              page-hero-glow--violet
            "
          />
        </section>

        {/* Content */}
        <section
          aria-labelledby="latest-blogs-heading"
          className="
            container
            py-10
            sm:py-12
          "
        >
          <div className="mb-8">
            <div
              className="
                mb-2
                text-xs
                font-bold
                uppercase
                tracking-[0.2em]
                text-text-faint
              "
            >
              Latest articles
            </div>

            <h2
              id="latest-blogs-heading"
              className="
                text-2xl
                font-black
                tracking-tight
                sm:text-3xl
              "
            >
              Latest from ThrillyVerse
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-text-muted
              "
            >
              Browse the latest published
              articles from ThrillyVerse.
            </p>
          </div>

          {error ? (
            <div
              className="
                mb-8
                rounded-2xl
                border
                border-red-500/20
                bg-red-500/5
                p-5
              "
              role="alert"
            >
              <div className="font-bold text-red-500">
                Unable to load blog posts
              </div>

              <p className="mt-2 text-sm text-text-muted">
                Supabase returned an error while
                loading published articles.
                Check the server terminal/logs.
              </p>
            </div>
          ) : null}

          <BlogsGrid blogs={blogs} />
        </section>
      </main>
    </>
  );
}
