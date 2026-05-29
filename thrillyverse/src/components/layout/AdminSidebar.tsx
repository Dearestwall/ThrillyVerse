'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard, Film, BookOpen, FileText, Megaphone, Bell,
  HelpCircle, Mail, Folder, Award, Handshake, Star,
  Settings, LogOut, ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/movies', label: 'Movies', icon: Film },
  { href: '/admin/materials', label: 'Materials', icon: BookOpen },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/projects', label: 'Projects', icon: Folder },
  { href: '/admin/quizzes', label: 'Quizzes', icon: HelpCircle },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/contacts', label: 'Contacts', icon: Mail },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/partners', label: 'Partners', icon: Handshake },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ role, userName, avatarUrl }: {
  role: string; userName: string | null; avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        {!collapsed && (
          <span className="sidebar-brand">
            <Zap size={18} className="sidebar-brand-icon" />
            ThrillyVerse
          </span>
        )}
        <button onClick={() => setCollapsed(v => !v)} className="sidebar-collapse-btn" aria-label="Toggle sidebar">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" aria-label="Admin navigation">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={`sidebar-link ${active ? 'active' : ''}`} title={collapsed ? label : undefined}>
              <Icon size={18} className="sidebar-link-icon" />
              {!collapsed && <span className="sidebar-link-label">{label}</span>}
              {active && !collapsed && <span className="sidebar-active-dot" aria-hidden />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="sidebar-avatar">
              {avatarUrl ? <img src={avatarUrl} alt={userName ?? 'Admin'} /> : <span>{(userName ?? 'A')[0]}</span>}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{userName ?? 'Admin'}</p>
              <p className="sidebar-user-role">{role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button onClick={logout} className="sidebar-logout" title="Sign out" aria-label="Sign out">
          <LogOut size={16} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}