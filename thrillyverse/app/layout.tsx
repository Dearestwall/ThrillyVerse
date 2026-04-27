import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThrillyVerse — Think Beyond The Verse',
  description: 'ICSE Study Materials, Movies & Web Series',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/logo-192.png" />
      </head>
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}