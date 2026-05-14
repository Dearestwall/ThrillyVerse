import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, role, previewMode } = useAuth()

  if (loading) {
    return (
      <div className="center-state">
        <div className="card">
          <h2>Loading dashboard…</h2>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <>
        <div className="preview-banner">
          <strong>Preview mode:</strong> Supabase is not connected yet, so admin pages use editable demo data in-memory.
        </div>
        {children}
      </>
    )
  }

  if (role !== 'admin') {
    return (
      <div className="center-state">
        <div className="card blocked-card">
          <h2>Admin access required</h2>
          <p>Sign in with an admin account to manage ThrillyVerse content.</p>
          <Link to="/login" className="button button-primary">Go to login</Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}