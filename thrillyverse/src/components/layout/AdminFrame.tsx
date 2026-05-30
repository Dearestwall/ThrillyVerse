'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbarControls from '@/components/layout/AdminTopbarControls';

export default function AdminFrame({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const saved = window.localStorage.getItem('tv-admin-sidebar-collapsed');
      if (saved === 'true') setDesktopCollapsed(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem('tv-admin-sidebar-collapsed', String(desktopCollapsed));
    } catch {}
  }, [desktopCollapsed, hydrated]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('admin-mobile-menu-open', mobileOpen);
    document.body.classList.toggle('admin-mobile-menu-open', mobileOpen);
    return () => {
      document.documentElement.classList.remove('admin-mobile-menu-open');
      document.body.classList.remove('admin-mobile-menu-open');
    };
  }, [mobileOpen]);

  return (
    <div className={`admin-shell-layout ${desktopCollapsed ? 'sidebar-collapsed' : ''}`}>
      <AdminSidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        onClose={() => setMobileOpen(false)}
        onToggleDesktop={() => setDesktopCollapsed((prev) => !prev)}
      />

      <div className="admin-main-wrap">
        <AdminTopbarControls
          desktopCollapsed={desktopCollapsed}
          onToggleDesktop={() => setDesktopCollapsed((prev) => !prev)}
          onOpenMobile={() => setMobileOpen(true)}
        />

        <main id="main-content" className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}