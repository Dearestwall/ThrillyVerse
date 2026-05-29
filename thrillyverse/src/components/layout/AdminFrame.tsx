'use client';

import { useState } from 'react';
import { Menu, Search } from 'lucide-react';
import AdminSidebar from '@/components/layout/AdminSidebar';

export default function AdminFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="admin-shell-layout">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-menu-btn"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            <div className="admin-topbar-title-group">
              <h1 className="admin-topbar-title">Admin Panel</h1>
              <p className="admin-topbar-subtitle">Manage content, updates, and platform data.</p>
            </div>
          </div>

          <div className="admin-topbar-search">
            <Search size={16} />
            <input
              type="text"
              className="form-input"
              placeholder="Search admin pages, records, and content..."
            />
          </div>
        </header>

        <main className="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}