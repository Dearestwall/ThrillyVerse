'use client'

import { useState } from 'react'

interface SendResult {
  sent?: number
  total?: number
  error?: string
}

const TOPICS = [
  { value: 'all',       label: '📢 All Subscribers' },
  { value: 'movies',    label: '🎬 Movie Subscribers' },
  { value: 'materials', label: '📚 Material Subscribers' },
  { value: 'news',      label: '📰 News Subscribers' },
]

const PRESETS = [
  { title: '🎬 New Movie Added!', body: 'A new movie is now available on ThrillyVerse', url: '/movies' },
  { title: '📚 New Study Material!', body: 'New ICSE study material uploaded for download', url: '/material' },
  { title: '📢 ThrillyVerse Update', body: 'Check out the latest updates on ThrillyVerse', url: '/' },
]

const inputClass =
  'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors'

export default function AdminPushPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('/movies')
  const [topic, setTopic] = useState('all')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SendResult | null>(null)

  const applyPreset = (preset: (typeof PRESETS)[0]) => {
    setTitle(preset.title)
    setBody(preset.body)
    setUrl(preset.url)
  }

  const sendPush = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': process.env.NEXT_PUBLIC_ADMIN_SECRET ?? '',
        },
        body: JSON.stringify({ title, body, url, topic }),
      })

      const data = (await res.json()) as SendResult
      setResult(data)
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Network error' })
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-2">Send Push Notification</h1>
      <p className="text-gray-400 text-sm mb-6">
        Notify all subscribers or a specific topic group instantly.
      </p>

      {/* Presets */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-2">Quick Presets</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <form onSubmit={sendPush} className="space-y-4">

          {/* Notification Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Notification Title *
            </label>
            <input
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="🎬 New Movie Added!"
              maxLength={80}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">{title.length}/80</p>
          </div>

          {/* Message Body */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Message *
            </label>
            <textarea
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={3}
              placeholder="Kesari 2 is now available in HD quality on ThrillyVerse!"
              maxLength={200}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1">{body.length}/200</p>
          </div>

          {/* Link URL */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Tap destination URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="/movies"
              className={inputClass}
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Send to
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={inputClass}
            >
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending…' : '🚀 Send Notification'}
          </button>

          {/* Result */}
          {result && (
            <div
              className={`rounded-xl px-4 py-3 text-sm text-center ${
                result.error
                  ? 'bg-red-900/30 border border-red-800 text-red-400'
                  : 'bg-green-900/30 border border-green-800 text-green-400'
              }`}
            >
              {result.error
                ? `Error: ${result.error}`
                : `Sent to ${result.sent ?? 0} of ${result.total ?? 0} subscribers`}
            </div>
          )}
        </form>
      </div>

      {/* Info box */}
      <div className="mt-4 p-4 bg-gray-900 border border-gray-800 rounded-xl text-xs text-gray-500">
        <p className="font-semibold text-gray-400 mb-1">How it works</p>
        <p>Users who clicked the 🔔 bell on any page are subscribed. Expired subscriptions are automatically cleaned up after each send.</p>
      </div>
    </div>
  )
}