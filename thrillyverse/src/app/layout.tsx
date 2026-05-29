import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://thrillyverse.vercel.app'),
  title: {
    default: 'ThrillyVerse — Think Beyond The Verse',
    template: '%s | ThrillyVerse',
  },
  description:
    'Entertainment, learning and publishing in one evolving universe. Explore movies, study resources, quizzes, blogs, projects and announcements on ThrillyVerse.',
  applicationName: 'ThrillyVerse',
  keywords: [
    'ThrillyVerse',
    'movies',
    'study materials',
    'blogs',
    'quizzes',
    'projects',
    'announcements',
    'education',
    'entertainment',
  ],
  authors: [{ name: 'ThrillyVerse' }],
  creator: 'ThrillyVerse',
  publisher: 'ThrillyVerse',
  alternates: {
    canonical: '/',
  },
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
  icons: {
    icon: '/logo-192.png',
    apple: '/logo-192.png',
    shortcut: '/logo-192.png',
  },
  openGraph: {
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Entertainment, learning and publishing in one evolving universe.',
    url: 'https://thrillyverse.vercel.app',
    siteName: 'ThrillyVerse',
    images: [
      {
        url: '/logo-192.png',
        width: 192,
        height: 192,
        alt: 'ThrillyVerse Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Entertainment, learning and publishing in one evolving universe.',
    images: ['/logo-192.png'],
    creator: '@thrillyverse',
  },
  category: 'education',
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  );
}