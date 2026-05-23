// src/app/layout.tsx - ROOT LAYOUT
import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'ThrillyVerse - Web Development & Learning Platform',
  description: 'Professional web development services and educational platform for students',
  keywords: ['web development', 'content creation', 'education', 'study materials', 'Next.js'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}