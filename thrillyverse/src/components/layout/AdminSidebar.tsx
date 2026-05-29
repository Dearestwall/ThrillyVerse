'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderKanban,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Star,
  Video,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { useState } from 'react';

type Props = {
  mobileOpen?: boolean;
  desktopCollapsed?: boolean;
  onClose?: () => void;
  onToggleDesktop?: () => void;
};

const navGroups = [
  {
    label: 'Overview',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/movies', label: 'Movies', icon: Video },
      { href: '/admin/materials', label: 'Materials', icon: BookOpen },
      { href: '/admin/blogs', label: 'Blogs', icon: FileText },
      { href: '/admin/quizzes', label: 'Quizzes', icon: FolderKanban },
      { href: '/admin/announcements', label: 'Announcements', icon: Newspaper },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    ],
  },
  {
    label: 'Brand',
    items: [
      { href: '/admin/projects', label: 'Projects', icon: Briefcase },
      { href: '/admin/reviews', label: 'Reviews', icon: Star },
      { href: '/admin/partners', label: 'Partners', icon: Handshake },
      { href: '/admin/certifications', label: 'Certifications', icon: Award },
      { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
    ],
  },
  {
    label: 'System',
    items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

function BrandBlock({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`tv-admin-brand ${collapsed ? 'is-collapsed' : ''}`}>
      <div className="tv-admin-brand-mark">
        <Home size={18} />
      </div>

      {!collapsed && (
        <div className="tv-admin-brand-copy">
          <span className="tv-admin-brand-title">
            <span className="brand-thrilly">Thrilly</span>
            <span className="brand-verse">Verse</span>
          </span>
          <span className="tv-admin-brand-subtitle">Admin Panel</span>
        </div>
      )}
    </div>
  );
}

function SidebarLinks({
  collapsed = false,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="admin-sidebar-nav">
      {navGroups.map((group) => (
        <div key={group.label} className="admin-nav-group">
          {!collapsed && <div className="admin-nav-group-label">{group.label}</div>}

          <nav className="admin-nav-group-links">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`admin-nav-link ${active ? 'is-active' : ''} ${collapsed ? 'is-collapsed' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

export default function AdminSidebar({
  mobileOpen = false,
  desktopCollapsed = false,
  onClose,
  onToggleDesktop,
}: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Logged out successfully');
      onClose?.();
      router.replace('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <aside className={`admin-sidebar-desktop ${desktopCollapsed ? 'is-collapsed' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link href="/admin" className="admin-brand-link" aria-label="ThrillyVerse Admin">
            <BrandBlock collapsed={desktopCollapsed} />
          </Link>

          <button
            type="button"
            className="admin-desktop-collapse-btn"
            onClick={onToggleDesktop}
            aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {desktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="admin-sidebar-scroll">
          <SidebarLinks collapsed={desktopCollapsed} />
        </div>

        {!desktopCollapsed && (
          <div className="admin-sidebar-footer">
            <button
              type="button"
              className="admin-sidebar-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={16} />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        )}
      </aside>

      <div className={`admin-mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <button
          type="button"
          aria-label="Close menu overlay"
          className="admin-mobile-drawer-backdrop"
          onClick={onClose}
        />

        <aside className="admin-mobile-drawer-panel">
          <div className="admin-mobile-drawer-header">
            <div className="admin-brand-link">
              <BrandBlock />
            </div>

            <button
              type="button"
              className="admin-mobile-close"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <div className="admin-mobile-drawer-body">
            <SidebarLinks onClose={onClose} />
          </div>

          <div className="admin-mobile-drawer-footer">
            <button
              type="button"
              className="admin-sidebar-logout"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={16} />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}