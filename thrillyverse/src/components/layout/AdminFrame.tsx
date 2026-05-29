'use client';

import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import AdminTopbarControls from '@/components/layout/AdminTopbarControls';

export default function AdminFrame({
  children,
}: {
  children: React.ReactNode;
}) {
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

        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}