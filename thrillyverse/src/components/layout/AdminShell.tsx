'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Menu, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const SIDEBAR_KEY = 'thrillyverse-admin-sidebar-collapsed';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(SIDEBAR_KEY);
    setCollapsed(saved === '1');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(SIDEBAR_KEY, collapsed ? '1' : '0');
    document.body.classList.toggle('admin-sidebar-collapsed', collapsed);
  }, [collapsed, mounted]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const shellClass = useMemo(
    () => `admin-shell ${collapsed ? 'admin-shell-collapsed' : ''}`,
    [collapsed]
  );

  return (
    <div className={shellClass}>
      <div
        className={`admin-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-sidebar-mobile-head md:hidden">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMobileSidebarOpen(false)}
            type="button"
            aria-label="Close admin menu"
          >
            <X size={18} />
          </button>
        </div>
        <AdminSidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </aside>

      <div className="admin-main-shell">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="btn btn-secondary btn-sm admin-nav-toggle md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open admin menu"
            >
              <Menu size={18} />
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm hidden md:inline-flex admin-collapse-btn"
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar collapse"
            >
              {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
            </button>

            <span className="admin-badge">Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        <main id="main-content" className="admin-content page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}