import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="section narrow-section">
      <div className="container narrow-container">
        <div className="card login-card">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p>The page you requested does not exist in this ThrillyVerse build.</p>
          <Link to="/" className="button button-primary">Go home</Link>
        </div>
      </div>
    </section>
  )
}