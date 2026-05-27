'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LogOut,
  LayoutGrid,
  FileText,
  Film,
  BookOpen,
  Brain,
  Megaphone,
  Bell,
  Mail,
  Wrench,
  Handshake,
  Star,
  BadgeCheck,
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/movies', label: 'Movies', icon: Film },
  { href: '/admin/materials', label: 'Materials', icon: BookOpen },
  { href: '/admin/quizzes', label: 'Quizzes', icon: Brain },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/projects', label: 'Projects', icon: Wrench },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/certifications', label: 'Certifications', icon: BadgeCheck },
];

type Props = {
  onNavigate?: () => void;
};

export function AdminSidebar({ onNavigate }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut({ scope: 'local' });
    router.replace('/admin/login');
  }

  return (
    <div className="admin-sidebar-inner">
      <Link href="/admin" className="admin-sidebar-logo" onClick={onNavigate}>
        <div className="logo-circle w-10 h-10 text-xs font-black shrink-0">TV</div>
        <div className="admin-sidebar-brand">
          <div className="font-display font-black text-sm leading-tight">
            <span style={{ color: 'var(--admin-primary)' }}>Thrilly</span>
            <span style={{ color: 'var(--color-gold)' }}>Verse</span>
          </div>
          <div className="admin-sidebar-subtitle">Admin</div>
        </div>
      </Link>

      <nav className="admin-nav flex-1">
        {NAV.map((item) => {
          const active =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? 'admin-nav-item-active' : ''}`}
              onClick={onNavigate}
            >
              <span className="admin-nav-icon">
                <Icon size={16} />
              </span>
              <span className="admin-sidebar-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <button
          onClick={handleLogout}
          className="admin-nav-item admin-nav-item-danger w-full text-left"
          type="button"
        >
          <span className="admin-nav-icon">
            <LogOut size={16} />
          </span>
          <span className="admin-sidebar-label">Logout</span>
        </button>
      </div>
    </div>
  );
}