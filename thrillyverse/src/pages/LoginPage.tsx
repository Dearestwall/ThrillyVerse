import { FormEvent, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function LoginPage() {
  const { role, signIn, previewMode } = useAuth()
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (role === 'admin') {
      window.location.href = '/admin'
    }
  }, [role])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setPending(true)

    const result = await signIn(
      String(form.get('email') || ''),
      String(form.get('password') || '')
    )

    if (result.error) {
      setError(result.error)
      setPending(false)
      return
    }

    setError('')
    setPending(false)
    window.location.href = '/admin'
  }

  return (
    <section className="section narrow-section">
      <div className="container narrow-container">
        <div className="card login-card">
          <p className="eyebrow">Admin access</p>
          <h1>Sign in to the ThrillyVerse dashboard</h1>
          <p>
            {previewMode
              ? 'Supabase is not connected yet, so admin pages currently open in preview mode.'
              : 'Use your admin credentials to manage live content.'}
          </p>

          <form className="field-grid" onSubmit={handleSubmit}>
            <label>
              <span>Email</span>
              <input name="email" type="email" required />
            </label>

            <label>
              <span>Password</span>
              <input name="password" type="password" required />
            </label>

            <button className="button button-primary" disabled={pending} type="submit">
              {pending ? 'Signing in...' : 'Sign in'}
            </button>

            {error && <p className="status-text error-text">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}