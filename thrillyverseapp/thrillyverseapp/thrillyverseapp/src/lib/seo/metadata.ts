// src/lib/seo/metadata.ts - SEO Metadata Configuration
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string[];
  type?: string;
}

const siteConfig = {
  name: 'ThrillyVerse',
  description: 'Think Beyond The Verse - Your ultimate educational platform for ICSE, ISC materials, quizzes, and interactive learning',
  url: 'https://thrillyverse.com',
  ogImage: 'https://thrillyverse.com/og-image.jpg',
  keywords: [
    'ThrillyVerse',
    'ICSE',
    'ISC',
    'study materials',
    'online learning',
    'educational platform',
    'quizzes',
    'practice tests',
    'ICSE materials',
    'Class 10',
    'Class 11',
    'Class 12',
  ],
};

export function generateMetadata({
  title,
  description,
  image,
  url,
  keywords,
  type = 'website',
}: SEOProps = {}): Metadata {
  const seo = {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    image: image || siteConfig.ogImage,
    url: url ? `${siteConfig.url}${url}` : siteConfig.url,
    keywords: keywords || siteConfig.keywords,
  };

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'ThrillyVerse Team' }],
    creator: 'ThrillyVerse',
    publisher: 'ThrillyVerse',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as any,
      locale: 'en_US',
      url: seo.url,
      title: seo.title,
      description: seo.description,
      siteName: siteConfig.name,
      images: [
        {
          url: seo.image,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.image],
      creator: '@thrillyverse',
    },
    alternates: {
      canonical: seo.url,
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

export const defaultMetadata: Metadata = generateMetadata();