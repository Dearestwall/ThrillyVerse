'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  BookOpen,
  Briefcase,
  FileText,
  FolderKanban,
  Home,
  LayoutDashboard,
  MessageSquare,
  Newspaper,
  Settings,
  ShieldCheck,
  Star,
  Users,
  Video,
  X,
} from 'lucide-react';

type Props = {
  mobileOpen?: boolean;
  onClose?: () => void;
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
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/certifications', label: 'Certifications', icon: ShieldCheck },
  { href: '/admin/contacts', label: 'Contacts', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ mobileOpen = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      <aside className="admin-sidebar admin-sidebar-desktop">
        <div className="admin-sidebar-brand">
          <Link href="/admin" className="admin-brand-link">
            <Home size={18} />
            <span>ThrillyVerse Admin</span>
          </Link>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav-link ${active ? 'is-active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={`admin-mobile-drawer ${mobileOpen ? 'is-open' : ''}`}>
        <div className="admin-mobile-drawer-backdrop" onClick={onClose} />
        <aside className="admin-mobile-drawer-panel">
          <div className="admin-mobile-drawer-header">
            <span className="admin-mobile-drawer-title">Admin Menu</span>
            <button type="button" className="admin-mobile-close" onClick={onClose} aria-label="Close menu">
              <X size={18} />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link ${active ? 'is-active' : ''}`}
                  onClick={onClose}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
      </div>
    </>
  );
}