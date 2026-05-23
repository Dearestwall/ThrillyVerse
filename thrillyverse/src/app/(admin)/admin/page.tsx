import { createClient } from '@/lib/supabase/server';
import { AnimatedCounter } from '@/components/common/AnimatedCounter';
import { SectionHeading } from '@/components/common/SectionHeading';


export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [blogs, movies, materials, quizzes, announcements, notifications, contacts] = await Promise.all([
    supabase.from('blogs').select('id, published', { count: 'exact' }),
    supabase.from('movies').select('id, published', { count: 'exact' }),
    supabase.from('materials').select('id, published', { count: 'exact' }),
    supabase.from('quizzes').select('id, published', { count: 'exact' }),
    supabase.from('announcements').select('id, active', { count: 'exact' }),
    supabase.from('notifications').select('id, is_active', { count: 'exact' }),
    supabase.from('contacts').select('id, read', { count: 'exact' }),
  ]);
const [partners, reviews, certifications] = await Promise.all([
  supabase.from('partners').select('id, active', { count: 'exact' }),
  supabase.from('reviews').select('id, published', { count: 'exact' }),
  supabase.from('certifications').select('id, active', { count: 'exact' }),
]);

  const stats = [
    { label: 'Blogs', total: blogs.count ?? 0, published: (blogs.data ?? []).filter(r => r.published).length, color: 'from-violet-500 to-purple-600', icon: 'âœï¸', href: '/admin/blogs' },
    { label: 'Movies', total: movies.count ?? 0, published: (movies.data ?? []).filter(r => r.published).length, color: 'from-blue-500 to-cyan-600', icon: 'ðŸŽ¬', href: '/admin/movies' },
    { label: 'Materials', total: materials.count ?? 0, published: (materials.data ?? []).filter(r => r.published).length, color: 'from-emerald-500 to-teal-600', icon: 'ðŸ“š', href: '/admin/materials' },
    { label: 'Quizzes', total: quizzes.count ?? 0, published: (quizzes.data ?? []).filter(r => r.published).length, color: 'from-orange-500 to-amber-600', icon: 'ðŸ§ ', href: '/admin/quizzes' },
    { label: 'Announcements', total: announcements.count ?? 0, published: (announcements.data ?? []).filter(r => r.active).length, color: 'from-pink-500 to-rose-600', icon: 'ðŸ“£', href: '/admin/announcements' },
    { label: 'Notifications', total: notifications.count ?? 0, published: (notifications.data ?? []).filter(r => r.is_active).length, color: 'from-indigo-500 to-blue-600', icon: 'ðŸ””', href: '/admin/notifications' },
    { label: 'Contacts', total: contacts.count ?? 0, published: (contacts.data ?? []).filter(r => !r.read).length, color: 'from-red-500 to-pink-600', icon: 'ðŸ“¬', href: '/admin/contacts', publishedLabel: 'Unread' },
    { label: 'Partners',         total: partners.count ?? 0,        published: (partners.data ?? []).filter(r => r.active).length,      color: 'from-teal-500 to-cyan-600',     icon: 'ðŸ¤', href: '/admin/partners',       publishedLabel: 'Active' },
   { label: 'Reviews',          total: reviews.count ?? 0,         published: (reviews.data ?? []).filter(r => r.published).length,    color: 'from-amber-500 to-yellow-600',  icon: 'â­', href: '/admin/reviews'  },
   { label: 'Certifications',   total: certifications.count ?? 0,  published: (certifications.data ?? []).filter(r => r.active).length, color: 'from-rose-500 to-red-600',      icon: 'ðŸ…', href: '/admin/certifications',  publishedLabel: 'Active' },
 ];

  return (
    <div className="space-y-10 page-enter">
      <div className="fade-up">
        <SectionHeading eyebrow="Admin Dashboard" title="Welcome to ThrillyVerse Admin" description="Manage content, users, and platform settings from here." />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <a
            key={stat.label}
            href={stat.href}
            className="card stat-card group relative overflow-hidden p-6 cursor-pointer"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`badge bg-gradient-to-r ${stat.color} text-white text-[11px] px-2.5 py-1`}>
                {stat.publishedLabel ?? 'Live'}: {stat.published}
              </span>
            </div>
            <div className="font-display text-3xl font-bold tabular-nums mb-1">
              <AnimatedCounter value={stat.total} />
            </div>
            <div className="text-sm text-text-muted font-medium">{stat.label}</div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r {stat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 section-reveal">
          <h3 className="font-display font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'New Blog', href: '/admin/blogs', icon: 'âœï¸' },
              { label: 'New Movie', href: '/admin/movies', icon: 'ðŸŽ¬' },
              { label: 'New Material', href: '/admin/materials', icon: 'ðŸ“š' },
              { label: 'New Quiz', href: '/admin/quizzes', icon: 'ðŸ§ ' },
              { label: 'Announce', href: '/admin/announcements', icon: 'ðŸ“£' },
              { label: 'Notify', href: '/admin/notifications', icon: 'ðŸ””' },
            ].map((q) => (
              <a key={q.label} href={q.href} className="btn btn-secondary flex items-center gap-2 justify-center text-sm">
                <span>{q.icon}</span> {q.label}
              </a>
            ))}
          </div>
        </div>
        <div className="card p-6 section-reveal">
          <h3 className="font-display font-bold text-lg mb-4">Platform Overview</h3>
          <ul className="space-y-3">
            {stats.map((s) => (
              <li key={s.label} className="flex items-center justify-between text-sm">
                <span className="text-text-muted">{s.icon} {s.label}</span>
                <span className="font-semibold tabular-nums">{s.total} total Â· {s.published} {s.publishedLabel ?? 'live'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


