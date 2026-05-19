import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  RotateCcw,
  ShieldCheck
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'
import { ADMIN_ROOT } from '../lib/config'
import { isSupabaseConfigured } from '../lib/supabase'

type View = 'login' | 'forgot'

type FieldErrors = {
  email?: string
  password?: string
}

function getView(search: string): View {
  const mode = new URLSearchParams(search).get('mode')
  return mode === 'forgot' ? 'forgot' : 'login'
}

function getRedirect(search: string) {
  return new URLSearchParams(search).get('redirect') || ADMIN_ROOT
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizeError(message: string): string {
  const msg = message.toLowerCase()

  if (msg.includes('invalid login credentials')) {
    return 'Incorrect email or password.'
  }

  if (msg.includes('email not confirmed')) {
    return 'Your email is not confirmed yet. Please check your inbox.'
  }

  if (msg.includes('failed to fetch') || msg.includes('network')) {
    return 'Could not connect to Supabase. Check your internet and project configuration.'
  }

  return message
}

export function LoginPage() {
  const { role, loading, initialized, signIn, sendPasswordReset } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const [view, setView] = useState<View>(() => getView(location.search))
  const [pending, setPending] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const redirectTo = useMemo(() => getRedirect(location.search), [location.search])

  useEffect(() => {
    setView(getView(location.search))
  }, [location.search])

  useEffect(() => {
    if (initialized && !loading && role === 'admin') {
      navigate(redirectTo, { replace: true })
    }
  }, [initialized, loading, role, navigate, redirectTo])

  const clearMessages = () => {
    setFormError('')
    setFormSuccess('')
  }

  const switchView = (next: View) => {
    setView(next)
    clearMessages()
    setFieldErrors({})

    const params = new URLSearchParams(location.search)

    if (next === 'forgot') {
      params.set('mode', 'forgot')
    } else {
      params.delete('mode')
    }

    const query = params.toString()
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, { replace: true })
  }

  const validateLogin = () => {
    const errors: FieldErrors = {}

    if (!email.trim()) {
      errors.email = 'Email is required.'
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Enter a valid email address.'
    }

    if (!password) {
      errors.password = 'Password is required.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateForgot = () => {
    const errors: FieldErrors = {}

    if (!email.trim()) {
      errors.email = 'Email is required.'
    } else if (!isValidEmail(email.trim())) {
      errors.email = 'Enter a valid email address.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    clearMessages()
    if (!validateLogin()) return

    setPending(true)

    try {
      const result = await signIn(email.trim(), password)

      if (result.error) {
        const message = normalizeError(result.error)
        setFormError(message)
        toast.error(message)
        return
      }

      setFormSuccess('Signed in successfully. Redirecting...')
      toast.success('Signed in successfully')
      navigate(redirectTo, { replace: true })
    } catch (error) {
      const message =
        error instanceof Error ? normalizeError(error.message) : 'Unable to sign in right now.'
      setFormError(message)
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  const handleForgot = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    clearMessages()
    if (!validateForgot()) return

    setPending(true)

    try {
      const result = await sendPasswordReset(email.trim())

      if (result.error) {
        const message = normalizeError(result.error)
        setFormError(message)
        toast.error(message)
        return
      }

      setFormSuccess('Password reset link sent. Check your inbox.')
      toast.success('Password reset link sent')
    } catch (error) {
      const message =
        error instanceof Error
          ? normalizeError(error.message)
          : 'Could not send password reset email.'
      setFormError(message)
      toast.error(message)
    } finally {
      setPending(false)
    }
  }

  if (!initialized) {
    return (
      <div className="login-page">
        <div className="login-card card">
          <div className="login-loading-state">
            <div className="login-spinner" />
            <p>Checking your session...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-brand">
          <div className="login-brand-badge">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="login-title">ThrillyVerse</h1>
            <p className="login-tagline">Admin Control Room</p>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="login-alert login-alert-warning">
            <strong>Supabase not configured</strong>
            <p>Add your Supabase URL and anon key in `.env` and restart the dev server.</p>
          </div>
        )}

        <div className="login-tabs login-tabs-two" role="tablist" aria-label="Auth modes">
          <button
            type="button"
            className={view === 'login' ? 'login-tab active' : 'login-tab'}
            onClick={() => switchView('login')}
            disabled={pending}
          >
            <LogIn size={15} />
            <span>Sign in</span>
          </button>

          <button
            type="button"
            className={view === 'forgot' ? 'login-tab active' : 'login-tab'}
            onClick={() => switchView('forgot')}
            disabled={pending}
          >
            <RotateCcw size={15} />
            <span>Reset password</span>
          </button>
        </div>

        {view === 'login' ? (
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <p className="login-form-hint">
              Use your admin credentials to access the ThrillyVerse dashboard.
            </p>

            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <div className={`login-input-wrap ${fieldErrors.email ? 'login-input-wrap-error' : ''}`}>
                <Mail size={17} className="login-input-icon" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearMessages()
                    setFieldErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="thrillyverse@gmail.com"
                  disabled={pending}
                />
              </div>
              {fieldErrors.email && <p className="login-field-error">{fieldErrors.email}</p>}
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className={`login-input-wrap ${fieldErrors.password ? 'login-input-wrap-error' : ''}`}>
                <LockKeyhole size={17} className="login-input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    clearMessages()
                    setFieldErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  placeholder="Enter your password"
                  disabled={pending}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {fieldErrors.password && <p className="login-field-error">{fieldErrors.password}</p>}
            </div>

            {formError && (
              <div className="login-alert login-alert-error" role="alert">
                <strong>Sign in failed</strong>
                <p>{formError}</p>
              </div>
            )}

            {!formError && formSuccess && (
              <div className="login-alert login-alert-success" role="status">
                <strong>Success</strong>
                <p>{formSuccess}</p>
              </div>
            )}

            <button type="submit" className="button button-primary login-submit" disabled={pending}>
              {pending ? 'Signing in...' : 'Enter dashboard'}
            </button>

            <button
              type="button"
              className="login-text-btn"
              onClick={() => switchView('forgot')}
              disabled={pending}
            >
              Forgot your password?
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleForgot} noValidate>
            <p className="login-form-hint">
              Enter your admin email to receive a password reset link.
            </p>

            <div className="login-field">
              <label htmlFor="forgot-email">Email</label>
              <div className={`login-input-wrap ${fieldErrors.email ? 'login-input-wrap-error' : ''}`}>
                <Mail size={17} className="login-input-icon" />
                <input
                  id="forgot-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearMessages()
                    setFieldErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="thrillyverse@gmail.com"
                  disabled={pending}
                />
              </div>
              {fieldErrors.email && <p className="login-field-error">{fieldErrors.email}</p>}
            </div>

            {formError && (
              <div className="login-alert login-alert-error" role="alert">
                <strong>Reset failed</strong>
                <p>{formError}</p>
              </div>
            )}

            {!formError && formSuccess && (
              <div className="login-alert login-alert-success" role="status">
                <strong>Email sent</strong>
                <p>{formSuccess}</p>
              </div>
            )}

            <button type="submit" className="button button-primary login-submit" disabled={pending}>
              {pending ? 'Sending...' : 'Send reset link'}
            </button>

            <button
              type="button"
              className="login-text-btn"
              onClick={() => switchView('login')}
              disabled={pending}
            >
              Back to sign in
            </button>
          </form>
        )}

        <div className="login-footer">
          <span>Not an admin?</span>
          <Link to="/">Go to ThrillyVerse</Link>
        </div>
      </div>
    </div>
  )
}