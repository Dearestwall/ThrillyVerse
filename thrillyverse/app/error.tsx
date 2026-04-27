'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4">⚠️</p>
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-gray-400 text-sm mb-6">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-medium transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  )
}