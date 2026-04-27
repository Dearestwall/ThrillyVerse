import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-purple-700 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-semibold transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/movies"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-semibold transition-colors"
          >
            Browse Movies
          </Link>
        </div>
      </div>
    </main>
  )
}