import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import { ADMIN_LOGIN_PATH } from '../lib/config'

function readHashParams() {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash

  return new URLSearchParams(hash)
}

export function ResetPasswordPage() {
  const [ready, setReady] = useState(false)
  const [pending, setPending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const hashParams = useMemo(() => readHashParams(), [])
  const hashError = hashParams.get('error')
  const hashErrorCode = hashParams.get('error_code')
  const hashErrorDescription = hashParams.get('error_description')

  const isExpired = hashError === 'access_denied' || hashErrorCode === 'otp_expired'

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')

    async function hydrateRecoverySession() {
      if (type === 'recovery' && accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (!error) {
          setReady(true)
        }
      }
    }

    hydrateRecoverySession()

    return () => subscription.unsubscribe()
  }, [hashParams])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setPending(true)

    const form = new FormData(event.currentTarget)
    const password = String(form.get('password') || '')
    const confirm = String(form.get('confirm') || '')

    if (password !== confirm) {
      setError('Passwords do not match')
      setPending(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      setPending(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw new Error(updateError.message)

      setDone(true)
      toast.success('Password updated successfully')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setPending(false)
    }
  }

  if (done) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Done</p>
            <h1>Password updated</h1>
            <p>Your password was changed successfully.</p>
            <a href="/admin" className="button button-primary">Go to dashboard</a>
          </div>
        </div>
      </section>
    )
  }

  if (isExpired) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Reset link expired</p>
            <h1>This password reset link is no longer valid</h1>
            <p>
              The recovery link may have expired or may already have been used once.
            </p>
            {hashErrorDescription && (
              <p className="status-text error-text">
                {decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))}
              </p>
            )}

            <div className="form-actions">
              <Link to={ADMIN_LOGIN_PATH} className="button button-primary">
                Request a new reset link
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!ready) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Reset password</p>
            <h1>Waiting for verification...</h1>
            <p>
              If you opened the link just now, wait a moment. If nothing happens, request a fresh reset email.
            </p>
            <div className="form-actions">
              <Link to={ADMIN_LOGIN_PATH} className="button button-ghost">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section narrow-section">
      <div className="container narrow-container">
        <div className="card login-card">
          <p className="eyebrow">Reset password</p>
          <h1>Set a new password</h1>

          <form className="field-grid" onSubmit={handleSubmit}>
            <label>
              <span>New password</span>
              <input name="password" type="password" required autoComplete="new-password" />
            </label>

            <label>
              <span>Confirm password</span>
              <input name="confirm" type="password" required autoComplete="new-password" />
            </label>

            <button className="button button-primary" disabled={pending} type="submit">
              {pending ? 'Updating...' : 'Update password'}
            </button>

            {error && <p className="status-text error-text">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}