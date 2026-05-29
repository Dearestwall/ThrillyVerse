'use client';

import {
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  SunMedium,
} from 'lucide-react';

type Props = {
  title?: string;
  subtitle?: string;
  desktopCollapsed?: boolean;
  onToggleDesktop?: () => void;
  onOpenMobile?: () => void;
};

export default function AdminTopbarControls({
  title = 'Admin Panel',
  subtitle = 'Manage content, updates, and platform data.',
  desktopCollapsed = false,
  onToggleDesktop,
  onOpenMobile,
}: Props) {
  const toggleTheme = () => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
  };

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-menu-btn"
          aria-label="Open menu"
          onClick={onOpenMobile}
        >
          <Menu size={18} />
        </button>

        <button
          type="button"
          className="admin-desktop-toggle-top"
          aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleDesktop}
        >
          {desktopCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>

        <div className="admin-topbar-title-group">
          <h1 className="admin-topbar-title">{title}</h1>
          <p className="admin-topbar-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="admin-topbar-right">
        <div className="admin-topbar-search">
          <Search size={16} />
          <input
            type="text"
            className="form-input"
            placeholder="Search admin pages, content, and records..."
          />
        </div>

        <button
          type="button"
          className="admin-theme-toggle"
          aria-label="Toggle theme"
          onClick={toggleTheme}
        >
          <SunMedium size={16} className="theme-light-icon" />
          <Moon size={16} className="theme-dark-icon" />
        </button>
      </div>
    </header>
  );
}