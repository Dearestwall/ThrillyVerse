import { type ReactNode, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  BarChart2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Film,
  FolderKanban,
  Home,
  Inbox,
  LayoutDashboard,
  LibraryBig,
  Menu,
  X
} from 'lucide-react'
import '../../styles/admin.css'

const items = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/materials', label: 'Materials', icon: LibraryBig },
  { to: '/admin/movies', label: 'Movies', icon: Film },
  { to: '/admin/blogs', label: 'Blogs', icon: FileText },
  { to: '/admin/contacts', label: 'Contacts', icon: Inbox },
  { to: '/admin/homepage', label: 'Homepage', icon: Home },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart2 }
]

type AdminShellProps = {
  title: string
  text: string
  actions?: ReactNode
  children: ReactNode
  stats?: ReactNode
}

export function AdminShell({
  title,
  text,
  actions,
  children,
  stats
}: AdminShellProps) {
  const location = useLocation()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeItem = useMemo(
    () =>
      items.find((item) =>
        item.to === '/admin'
          ? location.pathname === '/admin'
          : location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
      ),
    [location.pathname]
  )

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const SidebarNav = (
    <>
      <div className="admin-brand">
        <div className="admin-brand-mark">TV</div>
        {!sidebarCollapsed && (
          <div className="admin-brand-copy">
            <strong>ThrillyVerse CMS</strong>
            <span>Think Beyond The Verse</span>
          </div>
        )}
      </div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {items.map((item) => {
          const Icon = item.icon
          const active = isActive(item.to)

          return (
            <Link
              key={item.to}
              to={item.to}
              className={active ? 'admin-link active' : 'admin-link'}
              aria-current={active ? 'page' : undefined}
              onClick={() => setMobileOpen(false)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={18} />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <section className={`admin-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
      <aside className="admin-sidebar card">
        <div className="admin-sidebar-inner">{SidebarNav}</div>

        <button
          type="button"
          className="admin-sidebar-toggle"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </aside>

      <div className={`admin-mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="admin-mobile-backdrop" onClick={() => setMobileOpen(false)} />
        <aside className="admin-mobile-panel card">
          <div className="admin-mobile-top">
            <strong>Navigation</strong>
            <button
              type="button"
              className="admin-icon-btn"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>
          <div className="admin-sidebar-inner mobile">{SidebarNav}</div>
        </aside>
      </div>

      <div className="admin-content">
        <header className="admin-topbar card">
          <div className="admin-topbar-main">
            <div className="admin-topbar-row">
              <button
                type="button"
                className="admin-icon-btn admin-mobile-menu-btn"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu size={18} />
              </button>

              <div>
                <p className="eyebrow">Admin panel</p>
                <h1>{title}</h1>
                <p>{text}</p>
              </div>
            </div>

            <div className="admin-breadcrumb-chip">
              <span>Current</span>
              <strong>{activeItem?.label ?? 'Overview'}</strong>
            </div>
          </div>

          {actions ? <div className="admin-topbar-actions">{actions}</div> : null}
        </header>

        {stats ? <section className="admin-stats-wrap">{stats}</section> : null}

        <main className="admin-main">{children}</main>
      </div>
    </section>
  )
}