import {
  LayoutDashboard,
  FileText,
  Film,
  FolderKanban,
  Home,
  Inbox,
  LibraryBig
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

const items = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/materials', label: 'Materials', icon: LibraryBig },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/contacts', label: 'Contacts', icon: Inbox },
  { to: '/admin/homepage', label: 'Homepage', icon: Home }
]

export function AdminShell({
  title,
  text,
  actions,
  children
}: {
  title: string
  text: string
  actions?: ReactNode
  children: ReactNode
}) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar card">
        <div className="admin-brand">
          <strong>ThrillyVerse CMS</strong>
          <span>Manage every section</span>
        </div>

        <nav className="admin-nav">
          {items.map(item => {
            const Icon = item.icon

            return (
              <Link
                key={item.to}
                to={item.to}
                className={isActive(item.to) ? 'admin-link active' : 'admin-link'}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="admin-content">
        <div className="admin-topbar card">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1>{title}</h1>
            <p>{text}</p>
          </div>
          {actions}
        </div>

        {children}
      </div>
    </section>
  )
}