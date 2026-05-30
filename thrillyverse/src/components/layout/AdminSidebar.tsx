'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  ChevronRight,
  FileText,
  FolderKanban,
  Handshake,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Newspaper,
  Settings,
  Star,
  Tv2,
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
      <span className="tv-admin-brand-mark" aria-hidden="true">
        <Tv2 size={18} strokeWidth={2.1} />
      </span>

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
        <section key={group.label} className="admin-nav-group">
          {!collapsed && (
            <div className="admin-nav-group-label">{group.label}</div>
          )}

          <nav
            className={`admin-nav-group-links${collapsed ? ' is-collapsed' : ''}`}
            aria-label={group.label}
          >
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`admin-nav-link${active ? ' is-active' : ''}${collapsed ? ' is-collapsed' : ''}`}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="admin-nav-icon" aria-hidden="true">
                    <Icon size={18} strokeWidth={2.15} />
                  </span>
                  {!collapsed && (
                    <span className="admin-nav-text">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </section>
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
      {/* ── Desktop sidebar ── */}
      <aside
        className={`admin-sidebar-desktop${desktopCollapsed ? ' is-collapsed' : ''}`}
      >
        {/* Brand / header row */}
        <div
          className={`admin-sidebar-brand${desktopCollapsed ? ' is-collapsed' : ''}`}
        >
          <Link
            href="/admin"
            className="admin-brand-link"
            aria-label="ThrillyVerse Admin"
          >
            <BrandBlock collapsed={desktopCollapsed} />
          </Link>

          {/* Collapse button always present — icon flips direction */}
          <button
            type="button"
            className={`admin-desktop-collapse-btn${desktopCollapsed ? ' is-collapsed' : ''}`}
            onClick={onToggleDesktop}
            aria-label={
              desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
          >
            <ChevronRight
              size={16}
              style={{
                transform: desktopCollapsed
                  ? 'rotate(0deg)'
                  : 'rotate(180deg)',
                transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </button>
        </div>

        {/* Nav links */}
        <div className="admin-sidebar-scroll">
          <SidebarLinks collapsed={desktopCollapsed} />
        </div>

        {/* Footer / logout */}
        <div
          className={`admin-sidebar-footer${desktopCollapsed ? ' is-collapsed' : ''}`}
        >
          <button
            type="button"
            className={`admin-sidebar-logout${desktopCollapsed ? ' is-collapsed' : ''}`}
            onClick={handleLogout}
            disabled={loggingOut}
            title="Logout"
            aria-label="Logout"
          >
            <LogOut size={16} />
            {!desktopCollapsed && (
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            )}
          </button>
        </div>
      </aside>

      {/* ── Mobile drawer ── */}
      <div className={`admin-mobile-drawer${mobileOpen ? ' is-open' : ''}`}>
        <button
          type="button"
          aria-label="Close menu overlay"
          className="admin-mobile-drawer-backdrop"
          onClick={onClose}
        />

        <aside className="admin-mobile-drawer-panel">
          <div className="admin-mobile-drawer-header">
            <Link
              href="/admin"
              className="admin-brand-link"
              aria-label="ThrillyVerse Admin"
              onClick={onClose}
            >
              <BrandBlock />
            </Link>

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