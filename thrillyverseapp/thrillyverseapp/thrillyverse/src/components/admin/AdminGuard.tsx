import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ADMIN_LOGIN_PATH } from '../../lib/config'

export function AdminGuard({ children }: { children: ReactNode }) {
  const { initialized, loading, role } = useAuth()
  const location = useLocation()

  const redirectTarget = `${location.pathname}${location.search}`

  if (!initialized) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Admin</p>
            <h1>Preparing dashboard</h1>
            <p>Loading your admin access.</p>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="section narrow-section">
        <div className="container narrow-container">
          <div className="card login-card">
            <p className="eyebrow">Admin</p>
            <h1>Checking access</h1>
            <p>Please wait a moment.</p>
          </div>
        </div>
      </section>
    )
  }

  if (role === 'admin') {
    return <>{children}</>
  }

  return (
    <Navigate
      to={`${ADMIN_LOGIN_PATH}?redirect=${encodeURIComponent(redirectTarget)}`}
      replace
    />
  )
}