'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  const inputClass =
    'w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-600 transition-colors'

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800">

        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="https://i.ibb.co/0pjPXpZy/thrillyverse.png"
            alt="ThrillyVerse Logo"
            width={64}
            height={64}
            className="w-16 h-16 mx-auto mb-4 rounded-xl"
          />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">ThrillyVerse Dashboard</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="admin@thrillyverse.com"
              className={inputClass}
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-800 rounded-lg px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          ThrillyVerse Admin — Authorized users only
        </p>
      </div>
    </main>
  )
}