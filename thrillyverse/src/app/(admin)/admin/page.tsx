import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Film, BookOpen, FileText, Folder, HelpCircle, Megaphone, Bell, Mail, Award, Handshake, Star, TrendingUp } from 'lucide-react';
import { formatDate } from '@/utils';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const [movies, materials, blogs, projects, quizzes, announcements, notifications, contacts, certifications, partners, reviews] =
    await Promise.all([
      supabase.from('movies').select('id', { count: 'exact', head: true }),
      supabase.from('materials').select('id', { count: 'exact', head: true }),
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('quizzes').select('id', { count: 'exact', head: true }),
      supabase.from('announcements').select('id', { count: 'exact', head: true }),
      supabase.from('notifications').select('id', { count: 'exact', head: true }),
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
      supabase.from('certifications').select('id', { count: 'exact', head: true }),
      supabase.from('partners').select('id', { count: 'exact', head: true }),
      supabase.from('reviews').select('id', { count: 'exact', head: true }),
    ]);

  const { data: recentContacts } = await supabase.from('contacts').select('id,name,email,subject,read,created_at').order('created_at', { ascending: false }).limit(5);

  const stats = [
    { label: 'Movies', count: movies.count ?? 0, icon: Film, href: '/admin/movies', color: '#e11d48' },
    { label: 'Materials', count: materials.count ?? 0, icon: BookOpen, href: '/admin/materials', color: '#7c3aed' },
    { label: 'Blogs', count: blogs.count ?? 0, icon: FileText, href: '/admin/blogs', color: '#0891b2' },
    { label: 'Projects', count: projects.count ?? 0, icon: Folder, href: '/admin/projects', color: '#d97706' },
    { label: 'Quizzes', count: quizzes.count ?? 0, icon: HelpCircle, href: '/admin/quizzes', color: '#16a34a' },
    { label: 'Announcements', count: announcements.count ?? 0, icon: Megaphone, href: '/admin/announcements', color: '#ea580c' },
    { label: 'Notifications', count: notifications.count ?? 0, icon: Bell, href: '/admin/notifications', color: '#8b5cf6' },
    { label: 'Contacts', count: contacts.count ?? 0, icon: Mail, href: '/admin/contacts', color: '#06b6d4' },
    { label: 'Certifications', count: certifications.count ?? 0, icon: Award, href: '/admin/certifications', color: '#f59e0b' },
    { label: 'Partners', count: partners.count ?? 0, icon: Handshake, href: '/admin/partners', color: '#10b981' },
    { label: 'Reviews', count: reviews.count ?? 0, icon: Star, href: '/admin/reviews', color: '#f43f5e' },
  ];

  return (
    <div className="admin-page-root">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            <TrendingUp size={22} className="admin-page-title-icon" />
            Dashboard
          </h1>
          <p className="admin-page-subtitle">ThrillyVerse content overview</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats-grid">
        {stats.map(({ label, count, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="dashboard-stat-card" style={{ '--card-accent': color } as React.CSSProperties}>
            <div className="stat-card-icon" style={{ background: `${color}22` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div className="stat-card-body">
              <p className="stat-card-count">{count}</p>
              <p className="stat-card-label">{label}</p>
            </div>
            <div className="stat-card-bar" style={{ background: color }} />
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="admin-section-card">
        <h2 className="admin-section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {[
            { href: '/admin/movies', label: '+ Add Movie', color: '#e11d48' },
            { href: '/admin/materials', label: '+ Add Material', color: '#7c3aed' },
            { href: '/admin/blogs', label: '+ New Blog', color: '#0891b2' },
            { href: '/admin/announcements', label: '+ Announcement', color: '#ea580c' },
            { href: '/admin/notifications', label: '+ Notification', color: '#8b5cf6' },
            { href: '/admin/quizzes', label: '+ New Quiz', color: '#16a34a' },
            { href: '/admin/projects', label: '+ Add Project', color: '#d97706' },
            { href: '/admin/certifications', label: '+ Certification', color: '#f59e0b' },
          ].map(({ href, label, color }) => (
            <Link key={href} href={href} className="quick-action-btn" style={{ '--btn-color': color } as React.CSSProperties}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <h2 className="admin-section-title">Recent Messages</h2>
          <Link href="/admin/contacts" className="admin-section-link">View all →</Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {(recentContacts ?? []).map(c => (
                <tr key={c.id}>
                  <td className="font-medium text-sm">{c.name}</td>
                  <td className="text-sm text-muted">{c.email}</td>
                  <td className="text-sm text-muted">{c.subject ?? '—'}</td>
                  <td className="text-xs text-faint">{formatDate(c.created_at)}</td>
                  <td><span className={`badge ${c.read ? 'badge-muted' : 'badge-primary'} text-xs`}>{c.read ? 'Read' : 'New'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}