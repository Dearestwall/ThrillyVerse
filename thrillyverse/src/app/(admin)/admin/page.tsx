import { createClient } from '@/lib/supabase/server';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { SectionHeading } from '@/components/common/SectionHeading';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [
    blogs,
    movies,
    materials,
    quizzes,
    announcements,
    notifications,
    contacts,
    partners,
    reviews,
    certifications,
  ] = await Promise.all([
    supabase.from('blogs').select('id, published', { count: 'exact' }),
    supabase.from('movies').select('id, published', { count: 'exact' }),
    supabase.from('materials').select('id, published', { count: 'exact' }),
    supabase.from('quizzes').select('id, published', { count: 'exact' }),
    supabase.from('announcements').select('id, active', { count: 'exact' }),
    supabase.from('notifications').select('id, is_active', { count: 'exact' }),
    supabase.from('contacts').select('id, read', { count: 'exact' }),
    supabase.from('partners').select('id, active', { count: 'exact' }),
    supabase.from('reviews').select('id, published', { count: 'exact' }),
    supabase.from('certifications').select('id, active', { count: 'exact' }),
  ]);

  const stats = [
    {
      label: 'Blogs',
      total: blogs.count ?? 0,
      published: (blogs.data ?? []).filter((r) => r.published).length,
      color: 'from-violet-500 to-purple-600',
      icon: '✍️',
      href: '/admin/blogs',
      publishedLabel: 'Live',
      accent: 'violet',
    },
    {
      label: 'Movies',
      total: movies.count ?? 0,
      published: (movies.data ?? []).filter((r) => r.published).length,
      color: 'from-blue-500 to-cyan-600',
      icon: '🎬',
      href: '/admin/movies',
      publishedLabel: 'Live',
      accent: 'blue',
    },
    {
      label: 'Materials',
      total: materials.count ?? 0,
      published: (materials.data ?? []).filter((r) => r.published).length,
      color: 'from-emerald-500 to-teal-600',
      icon: '📚',
      href: '/admin/materials',
      publishedLabel: 'Live',
      accent: 'emerald',
    },
    {
      label: 'Quizzes',
      total: quizzes.count ?? 0,
      published: (quizzes.data ?? []).filter((r) => r.published).length,
      color: 'from-orange-500 to-amber-600',
      icon: '🧠',
      href: '/admin/quizzes',
      publishedLabel: 'Live',
      accent: 'orange',
    },
    {
      label: 'Announcements',
      total: announcements.count ?? 0,
      published: (announcements.data ?? []).filter((r) => r.active).length,
      color: 'from-pink-500 to-rose-600',
      icon: '📣',
      href: '/admin/announcements',
      publishedLabel: 'Active',
      accent: 'pink',
    },
    {
      label: 'Notifications',
      total: notifications.count ?? 0,
      published: (notifications.data ?? []).filter((r) => r.is_active).length,
      color: 'from-indigo-500 to-blue-600',
      icon: '🔔',
      href: '/admin/notifications',
      publishedLabel: 'Active',
      accent: 'indigo',
    },
    {
      label: 'Contacts',
      total: contacts.count ?? 0,
      published: (contacts.data ?? []).filter((r) => !r.read).length,
      color: 'from-red-500 to-pink-600',
      icon: '📬',
      href: '/admin/contacts',
      publishedLabel: 'Unread',
      accent: 'red',
    },
    {
      label: 'Partners',
      total: partners.count ?? 0,
      published: (partners.data ?? []).filter((r) => r.active).length,
      color: 'from-teal-500 to-cyan-600',
      icon: '🤝',
      href: '/admin/partners',
      publishedLabel: 'Active',
      accent: 'teal',
    },
    {
      label: 'Reviews',
      total: reviews.count ?? 0,
      published: (reviews.data ?? []).filter((r) => r.published).length,
      color: 'from-amber-500 to-yellow-600',
      icon: '⭐',
      href: '/admin/reviews',
      publishedLabel: 'Live',
      accent: 'amber',
    },
    {
      label: 'Certifications',
      total: certifications.count ?? 0,
      published: (certifications.data ?? []).filter((r) => r.active).length,
      color: 'from-rose-500 to-red-600',
      icon: '🏅',
      href: '/admin/certifications',
      publishedLabel: 'Active',
      accent: 'rose',
    },
  ];

  const liveCount = stats.reduce((acc, s) => acc + s.published, 0);
  const totalCount = stats.reduce((acc, s) => acc + s.total, 0);
  const unreadContacts = (contacts.data ?? []).filter((r) => !r.read).length;
  const activeItems = stats.filter((s) => s.published > 0).length;

  return (
    <div className="space-y-10 page-enter">
      <div className="fade-up flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Admin Dashboard"
          title="Welcome to ThrillyVerse Admin"
          description="Manage content, users, and platform settings from a single control center."
        />

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/blogs" className="btn btn-secondary btn-sm">New Blog</Link>
          <Link href="/admin/movies" className="btn btn-secondary btn-sm">New Movie</Link>
          <Link href="/admin/materials" className="btn btn-secondary btn-sm">New Material</Link>
          <Link href="/admin/quizzes" className="btn btn-secondary btn-sm">New Quiz</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <div className="admin-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-text-muted mb-2">Total Content</div>
          <div className="text-3xl font-display font-bold tabular-nums">
            <AnimatedCounter value={totalCount} />
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-text-muted mb-2">Live / Active</div>
          <div className="text-3xl font-display font-bold tabular-nums">
            <AnimatedCounter value={liveCount} />
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-text-muted mb-2">Sections Online</div>
          <div className="text-3xl font-display font-bold tabular-nums">
            <AnimatedCounter value={activeItems} />
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-text-muted mb-2">Unread Contacts</div>
          <div className="text-3xl font-display font-bold tabular-nums">
            <AnimatedCounter value={unreadContacts} />
          </div>
        </div>
        <div className="admin-card p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-text-muted mb-2">Platform Health</div>
          <div className="text-3xl font-display font-bold tabular-nums">100%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat, i) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="admin-card group relative overflow-hidden p-6 transition-transform duration-200 hover:-translate-y-1"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`badge bg-gradient-to-r ${stat.color} text-white text-[11px] px-2.5 py-1`}>
                {stat.publishedLabel}: {stat.published}
              </span>
            </div>
            <div className="font-display text-3xl font-bold tabular-nums mb-1">
              <AnimatedCounter value={stat.total} />
            </div>
            <div className="text-sm text-text-muted font-medium">{stat.label}</div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="admin-card p-6 xl:col-span-2">
          <h3 className="font-display font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'New Blog', href: '/admin/blogs', icon: '✍️' },
              { label: 'New Movie', href: '/admin/movies', icon: '🎬' },
              { label: 'New Material', href: '/admin/materials', icon: '📚' },
              { label: 'New Quiz', href: '/admin/quizzes', icon: '🧠' },
              { label: 'Announce', href: '/admin/announcements', icon: '📣' },
              { label: 'Notify', href: '/admin/notifications', icon: '🔔' },
              { label: 'Partners', href: '/admin/partners', icon: '🤝' },
              { label: 'Reviews', href: '/admin/reviews', icon: '⭐' },
              { label: 'Contacts', href: '/admin/contacts', icon: '📬' },
            ].map((q) => (
              <Link key={q.label} href={q.href} className="btn btn-secondary flex items-center gap-2 justify-center text-sm">
                <span>{q.icon}</span> {q.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="admin-card p-6">
          <h3 className="font-display font-bold text-lg mb-4">Platform Overview</h3>
          <ul className="space-y-3">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-between text-sm gap-3">
                <span className="text-text-muted">{s.icon} {s.label}</span>
                <span className="font-semibold tabular-nums text-right">
                  {s.total} total · {s.published} {s.publishedLabel?.toLowerCase() ?? 'live'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card p-5">
          <div className="text-sm text-text-muted mb-2">Blogs</div>
          <div className="text-2xl font-bold tabular-nums">{blogs.count ?? 0}</div>
        </div>
        <div className="admin-card p-5">
          <div className="text-sm text-text-muted mb-2">Movies</div>
          <div className="text-2xl font-bold tabular-nums">{movies.count ?? 0}</div>
        </div>
        <div className="admin-card p-5">
          <div className="text-sm text-text-muted mb-2">Materials</div>
          <div className="text-2xl font-bold tabular-nums">{materials.count ?? 0}</div>
        </div>
      </div>
    </div>
  );
}