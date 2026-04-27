import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ThrillyVerse — Think Beyond The Verse',
  description: 'ICSE Study Materials, Movies & Web Series',
  manifest: '/manifest.json',
  // ← Do NOT put raw strings or broken JSX here
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Only valid self-closing tags here — NO raw text */}
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/logo-192.png" />
      </head>
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}