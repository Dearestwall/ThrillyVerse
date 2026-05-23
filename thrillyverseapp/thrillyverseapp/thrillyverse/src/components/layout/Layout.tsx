import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  const isAuthPage =
    location.pathname.includes('/login') ||
    location.pathname.includes('/reset-password')

  return (
    <div className={`app-shell ${isAdmin ? 'is-admin-shell' : 'is-public-shell'}`}>
      {!isAuthPage ? <Header /> : null}

      <main
        className={[
          'page',
          isAdmin ? 'admin-page' : 'public-page',
          isAuthPage ? 'auth-page' : ''
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </main>

      {!isAdmin && !isAuthPage ? <Footer /> : null}
    </div>
  )
}