import {
  ArrowRight,
  FileText,
  Film,
  FolderKanban,
  Inbox,
  LibraryBig,
  Settings2,
  Sparkles
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminShell } from '../../components/admin/AdminShell'
import { StatCard } from '../../components/ui/StatCard'
import { useBlogs, useContacts, useMaterials, useMovies, useProjects } from '../../hooks/resources'
import { useHomepageSettings } from '../../hooks/useHomepageSettings'

export function AdminDashboard() {
  const { items: projects } = useProjects()
  const { items: materials } = useMaterials()
  const { items: movies } = useMovies()
  const { items: blogs } = useBlogs()
  const { items: contacts } = useContacts()
  const { settings } = useHomepageSettings()

  const publishedBlogs = blogs.filter(item => item.published).length
  const featuredProjects = projects.filter(item => item.featured).length
  const featuredMaterials = materials.filter(item => item.featured).length
  const featuredMovies = movies.filter(item => item.featured).length
  const latestContacts = contacts.slice(0, 5)

  return (
    <AdminShell
      title="ThrillyVerse control room"
      text="Manage the public experience, featured content, and fresh updates from one clean dashboard."
      actions={
        <Link to="/admin/homepage" className="button button-primary">
          Homepage settings
        </Link>
      }
    >
      <div className="admin-hero-strip">
        <div className="card admin-hero-card">
          <div className="admin-hero-head">
            <div className="admin-hero-icon">
              <Sparkles size={20} />
            </div>
            <span className="badge">Live overview</span>
          </div>

          <h2>{settings.hero_title}</h2>
          <p>{settings.hero_subtitle}</p>

          <div className="admin-hero-meta">
            <div>
              <strong>{featuredProjects}</strong>
              <span>Featured projects</span>
            </div>
            <div>
              <strong>{publishedBlogs}</strong>
              <span>Published blogs</span>
            </div>
            <div>
              <strong>{contacts.length}</strong>
              <span>Contact leads</span>
            </div>
          </div>
        </div>

        <div className="card admin-quick-actions">
          <h3>Quick actions</h3>
          <div className="quick-actions-list">
            <Link to="/admin/projects" className="quick-action-link">
              <FolderKanban size={18} />
              <span>Add a project</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/admin/materials" className="quick-action-link">
              <LibraryBig size={18} />
              <span>Update materials</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/admin/movies" className="quick-action-link">
              <Film size={18} />
              <span>Publish movie entry</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/admin/blogs" className="quick-action-link">
              <FileText size={18} />
              <span>Write a blog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Projects" value={String(projects.length)} icon={<FolderKanban size={20} />} />
        <StatCard label="Materials" value={String(materials.length)} icon={<LibraryBig size={20} />} />
        <StatCard label="Movies" value={String(movies.length)} icon={<Film size={20} />} />
        <StatCard label="Blogs" value={String(blogs.length)} icon={<FileText size={20} />} />
        <StatCard label="Contacts" value={String(contacts.length)} icon={<Inbox size={20} />} />
        <StatCard label="Sections" value="6" icon={<Settings2 size={20} />} />
      </div>

      <div className="admin-overview-grid">
        <section className="card admin-list-card">
          <div className="admin-section-head">
            <div>
              <h2>Feature status</h2>
              <p>See what is highlighted on the public site right now.</p>
            </div>
          </div>

          <div className="feature-status-grid">
            <div className="feature-status-item">
              <strong>{featuredProjects}</strong>
              <span>Featured projects</span>
            </div>
            <div className="feature-status-item">
              <strong>{featuredMaterials}</strong>
              <span>Featured materials</span>
            </div>
            <div className="feature-status-item">
              <strong>{featuredMovies}</strong>
              <span>Featured movies</span>
            </div>
            <div className="feature-status-item">
              <strong>{publishedBlogs}</strong>
              <span>Published blogs</span>
            </div>
          </div>
        </section>

        <section className="card admin-list-card">
          <div className="admin-section-head">
            <div>
              <h2>Recent contact messages</h2>
              <p>The latest public enquiries show up here first.</p>
            </div>
            <Link to="/admin/contacts" className="inline-link">
              Open inbox <ArrowRight size={16} />
            </Link>
          </div>

          <div className="admin-grid-cards">
            {latestContacts.length === 0 ? (
              <p className="muted-text">No recent messages yet.</p>
            ) : (
              latestContacts.map(item => (
                <article key={item.id} className="mini-card">
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.email}</p>
                    <p><strong>{item.subject}</strong></p>
                    <p>{item.message}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </AdminShell>
  )
}