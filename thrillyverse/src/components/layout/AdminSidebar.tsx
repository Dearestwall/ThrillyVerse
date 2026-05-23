'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/blogs', label: 'Blogs', icon: '✍️' },
  { href: '/admin/movies', label: 'Movies', icon: '🎬' },
  { href: '/admin/materials', label: 'Materials', icon: '📚' },
  { href: '/admin/quizzes', label: 'Quizzes', icon: '🧠' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📣' },
  { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/admin/contacts', label: 'Contacts', icon: '📬' },
  { href: '/admin/projects', label: 'Projects', icon: '🛠️' },
  { href: '/admin/partners', label: 'Partners', icon: '🤝' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/certifications', label: 'Certifications', icon: '🏅' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut({ scope: 'local' });
    router.replace('/admin/login');
  }

  return (
    <div className="admin-sidebar-inner">
      <Link href="/admin" className="admin-sidebar-logo">
        <div className="logo-circle w-9 h-9 text-xs font-black">TV</div>
        <div>
          <div className="font-display font-black text-sm leading-tight">
            <span style={{ color: 'var(--color-primary)' }}>Thrilly</span>
            <span style={{ color: 'var(--color-gold)' }}>Verse</span>
          </div>
          <div className="text-[10px] text-text-faint font-semibold uppercase tracking-widest">Admin</div>
        </div>
      </Link>

      <nav className="admin-nav flex-1">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${active ? 'admin-nav-item-active' : ''}`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--color-divider)' }}>
        <button onClick={handleLogout} className="admin-nav-item w-full text-left" style={{ color: 'var(--color-error)' }}>
          <span className="text-base w-5 text-center">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}