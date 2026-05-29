'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  MessageSquare,
  Newspaper,
  Settings,
  Star,
  Video,
  X,
} from 'lucide-react';

type Props = {
  mobileOpen?: boolean;
  desktopCollapsed?: boolean;
  onClose?: () => void;
  onToggleDesktop?: () => void;
};

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/movies', label: 'Movies', icon: Video },
  { href: '/admin/materials', label: 'Materials', icon: BookOpen },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/quizzes', label: 'Quizzes', icon: FolderKanban },
  { href: '/admin/announcements', label: 'Announcements', icon: Newspaper },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/projects', label: 'Projects', icon: Briefcase },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function SidebarLinks({
  collapsed = false,
  onClose,
}: {
  collapsed?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="admin-sidebar-nav">
      {navItems.map((item) => {
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
  );
}

export default function AdminSidebar({
  mobileOpen = false,
  desktopCollapsed = false,
  onClose,
  onToggleDesktop,
}: Props) {
  return (
    <>
      <aside className={`admin-sidebar-desktop ${desktopCollapsed ? 'is-collapsed' : ''}`}>
        <div className="admin-sidebar-brand">
          <Link href="/admin" className="admin-brand-link">
            <div className="admin-brand-mark">
              <Home size={18} />
            </div>
            {!desktopCollapsed && <span>ThrillyVerse Admin</span>}
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

        <SidebarLinks collapsed={desktopCollapsed} />
      </aside>

      <div className={`admin-mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="admin-mobile-drawer-backdrop" onClick={onClose} />
        <aside className="admin-mobile-drawer-panel">
          <div className="admin-mobile-drawer-header">
            <div className="admin-brand-link">
              <div className="admin-brand-mark">
                <Home size={18} />
              </div>
              <span>ThrillyVerse Admin</span>
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

          <SidebarLinks onClose={onClose} />
        </aside>
      </div>
    </>
  );
}