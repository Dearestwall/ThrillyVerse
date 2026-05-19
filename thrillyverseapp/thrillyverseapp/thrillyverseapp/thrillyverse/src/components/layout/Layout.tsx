import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="app-shell">
      <Header />
      <main className={isAdmin ? 'page admin-page' : 'page'}>{children}</main>
      {!isAdmin && <Footer />}
    </div>
  )
}