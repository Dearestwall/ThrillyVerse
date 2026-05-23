import type { Metadata } from 'next';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://thrillyverse.com'),
  title: {
    default: 'ThrillyVerse — Movies, Study, Blogs',
    template: '%s | ThrillyVerse',
  },
  description:
    'ThrillyVerse brings movies, study materials, quizzes, blogs, and projects together in one fast, modern platform.',
  keywords: ['ThrillyVerse', 'movies', 'study materials', 'quizzes', 'blogs', 'projects', 'education'],
  openGraph: {
    title: 'ThrillyVerse — Movies, Study, Blogs',
    description: 'Discover movies, study resources, quizzes, blogs, and projects on ThrillyVerse.',
    url: 'https://thrillyverse.com',
    siteName: 'ThrillyVerse',
    images: ['/logo-192.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThrillyVerse — Movies, Study, Blogs',
    description: 'Movies, study resources, quizzes, blogs, and projects in one platform.',
    images: ['/logo-192.png'],
  },
  robots: { index: true, follow: true },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNavbar />
      <main id="main-content" className="min-h-screen pt-0">
        {children}
      </main>
      <Footer />
    </>
  );
}