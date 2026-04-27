'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Movie } from '@/lib/types'

const CATEGORIES = ['hindi', 'punjabi', 'hollywood', 'webseries'] as const
type Category = (typeof CATEGORIES)[number]

interface MovieForm {
  title: string
  poster_url: string
  category: Category
  description: string
  quality: string
  year: string
  movie_links: string
  series_links: string
  is_featured: boolean
}

const EMPTY_FORM: MovieForm = {
  title: '',
  poster_url: '',
  category: 'hindi',
  description: '',
  quality: 'HD',
  year: '',
  movie_links: '{}',
  series_links: '{}',
  is_featured: false,
}

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors'

export default function AdminMoviesPage() {
  const supabase = createClient()
  const [movies, setMovies] = useState<Movie[]>([])
  const [form, setForm] = useState<MovieForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchMovies = useCallback(async () => {
    const { data } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    setMovies((data as Movie[]) ?? [])
  }, [supabase])

  useEffect(() => {
    fetchMovies()
  }, [fetchMovies])

  const set = (key: keyof MovieForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    let movie_links: Record<string, string> = {}
    let series_links: Record<string, string> = {}

    try {
      movie_links = JSON.parse(form.movie_links) as Record<string, string>
      series_links = JSON.parse(form.series_links) as Record<string, string>
    } catch {
      setError('Links must be valid JSON. Example: {"720p":"url","1080p":"url"}')
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('movies').insert({
      title: form.title,
      poster_url: form.poster_url || null,
      category: form.category,
      description: form.description || null,
      quality: form.quality,
      year: form.year ? parseInt(form.year, 10) : null,
      movie_links,
      series_links,
      is_featured: form.is_featured,
    })

    if (insertError) {
      setError(insertError.message)
    } else {
      setSuccess(`"${form.title}" added successfully!`)
      setForm(EMPTY_FORM)

      // Send push notification (fire and forget)
      fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '',
        },
        body: JSON.stringify({
          title: '🎬 New Movie Added!',
          body: `${form.title} is now on ThrillyVerse`,
          url: '/movies',
          topic: 'movies',
        }),
      }).catch(() => {})

      // Revalidate movies page cache
      fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: process.env.NEXT_PUBLIC_ADMIN_SECRET,
          path: '/movies',
        }),
      }).catch(() => {})

      fetchMovies()
    }

    setLoading(false)
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    const { error: delError } = await supabase.from('movies').delete().eq('id', id)
    if (delError) {
      alert(`Delete failed: ${delError.message}`)
    } else {
      fetchMovies()
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Movies</h1>

      {/* ── Add Movie Form ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-5">Add New Movie / Series</h2>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Row 1: Title + Poster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Title *</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="Movie or Series Title"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Poster URL</label>
              <input
                type="url"
                value={form.poster_url}
                onChange={(e) => set('poster_url', e.target.value)}
                placeholder="https://i.ibb.co/..."
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Category + Quality + Year */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Quality</label>
              <input
                type="text"
                value={form.quality}
                onChange={(e) => set('quality', e.target.value)}
                placeholder="HD, 4K, 1080p..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => set('year', e.target.value)}
                placeholder="2025"
                min={1990}
                max={2030}
                className={inputClass}
              />
            </div>
          </div>

          {/* Movie Links JSON */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Movie Download Links{' '}
              <span className="text-gray-600 text-xs">(JSON format)</span>
            </label>
            <textarea
              value={form.movie_links}
              onChange={(e) => set('movie_links', e.target.value)}
              rows={3}
              placeholder={'{"720p":"https://link1.com","1080p":"https://link2.com"}'}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          {/* Series Links JSON */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Series / Episode Links{' '}
              <span className="text-gray-600 text-xs">(leave as {} for movies)</span>
            </label>
            <textarea
              value={form.series_links}
              onChange={(e) => set('series_links', e.target.value)}
              rows={3}
              placeholder={'{"EP01 - S01":"https://...","EP02 - S01":"https://..."}'}
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Description{' '}
              <span className="text-gray-600 text-xs">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              placeholder="Brief description..."
              className={inputClass}
            />
          </div>

          {/* Featured checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_featured"
              checked={form.is_featured}
              onChange={(e) => set('is_featured', e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <label htmlFor="is_featured" className="text-sm text-gray-300">
              Mark as Featured (shows in featured strip)
            </label>
          </div>

          {/* Submit row */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding…' : '+ Add Movie'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}
          </div>
        </form>
      </div>

      {/* ── Movies Table ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold">All Movies</h2>
          <span className="text-sm text-gray-500">{movies.length} total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3">Title</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Quality</th>
                <th className="text-left px-4 py-3">Views</th>
                <th className="text-left px-4 py-3">Featured</th>
                <th className="text-center px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr
                  key={movie.id}
                  className="border-t border-gray-800 hover:bg-gray-800/40 transition-colors"
                >
                  <td className="px-5 py-3 font-medium max-w-xs truncate text-white">
                    {movie.title}
                  </td>
                  <td className="px-4 py-3 text-gray-400 capitalize">{movie.category}</td>
                  <td className="px-4 py-3 text-gray-400">{movie.quality}</td>
                  <td className="px-4 py-3 text-gray-400">{movie.view_count}</td>
                  <td className="px-4 py-3 text-center">{movie.is_featured ? '⭐' : '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDelete(movie.id, movie.title)}
                      className="text-red-400 hover:text-red-300 text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {movies.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-2">🎬</p>
              <p>No movies yet. Add one above.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}