import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const siteMetadata: Metadata = {
  metadataBase: new URL('https://thrillyverse.vercel.app'),
  title: {
    default: 'ThrillyVerse — Think Beyond The Verse',
    template: '%s | ThrillyVerse',
  },
  description:
    'Entertainment, learning and publishing in one evolving universe. Explore movies, study resources, quizzes, blogs, projects and announcements on ThrillyVerse.',
  openGraph: {
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Entertainment, learning and publishing in one evolving universe.',
    url: 'https://thrillyverse.vercel.app',
    siteName: 'ThrillyVerse',
    images: ['/logo-192.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThrillyVerse — Think Beyond The Verse',
    description:
      'Entertainment, learning and publishing in one evolving universe.',
    images: ['/logo-192.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}