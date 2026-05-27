import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

// Optimize font loading to prevent layout shifts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Next.js requires this exact name to register page metadata
export const metadata: Metadata = {
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
    images: [
      {
        url: '/logo-192.png',
        width: 192,
        height: 192,
        alt: 'ThrillyVerse Logo',
      },
    ],
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

// Separate viewport configuration (Required in newer Next.js versions)
export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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
