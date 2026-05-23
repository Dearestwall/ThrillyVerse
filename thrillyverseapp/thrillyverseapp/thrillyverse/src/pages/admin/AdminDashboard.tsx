import {
  ArrowRight,
  FileText,
  Film,
  FolderKanban,
  Inbox,
  LibraryBig,
  Settings2,
  Sparkles,
  TrendingUp,
  Wand2
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AdminShell } from '../../components/admin/AdminShell'
import { AdminKpiGrid } from '../../components/admin/AdminKpiGrid'
import { AdminPageSection } from '../../components/admin/AdminPageSection'
import { AdminEmptyState } from '../../components/admin/AdminEmptyState'
import {
  useBlogs,
  useContacts,
  useMaterials,
  useMovies,
  useProjects
} from '../../hooks/resources'
import { useHomepageSettings } from '../../hooks/useHomepageSettings'

export function AdminDashboard() {
  const { items: projects, loading: projectsLoading } = useProjects()
  const { items: materials, loading: materialsLoading } = useMaterials()
  const { items: movies, loading: moviesLoading } = useMovies()
  const { items: blogs, loading: blogsLoading } = useBlogs()
  const { items: contacts, loading: contactsLoading } = useContacts()
  const { settings, loading: settingsLoading } = useHomepageSettings()

  const publishedBlogs = blogs.filter((item: any) => item.published).length
  const featuredProjects = projects.filter((item: any) => item.featured).length
  const featuredMaterials = materials.filter((item: any) => item.featured).length
  const featuredMovies = movies.filter((item: any) => item.featured).length
  const latestContacts = contacts.slice(0, 5)

  const loading =
    projectsLoading ||
    materialsLoading ||
    moviesLoading ||
    blogsLoading ||
    contactsLoading ||
    settingsLoading

  const totalResources =
    projects.length + materials.length + movies.length + blogs.length

  return (
    <AdminShell
      title="ThrillyVerse control room"
      text="Manage the public experience, featured content, editorial flow, and incoming activity from one admin workspace."
      actions={
        <div className="admin-header-actions">
          <Link to="/admin/homepage" className="button button-secondary">
            Edit homepage
          </Link>
          <Link to="/admin/blogs" className="button button-primary">
            Write blog
          </Link>
        </div>
      }
    >
      <div className="admin-dashboard-grid">
        <section className="card admin-dashboard-hero">
          <div className="admin-dashboard-hero-top">
            <div className="admin-dashboard-hero-icon">
              <Sparkles size={20} />
            </div>
            <span className="badge">Live overview</span>
          </div>

          <h2>{settings.hero_title || 'Homepage title not set yet'}</h2>
          <p>
            {settings.hero_subtitle ||
              'Update the homepage copy to define the public-facing first impression.'}
          </p>

          <div className="admin-dashboard-hero-meta">
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
        </section>

        <section className="card admin-quick-actions-card">
          <div className="admin-card-top">
            <div>
              <h3>Quick actions</h3>
              <p>Go straight to the tasks that usually need updates.</p>
            </div>
            <Wand2 size={18} />
          </div>

          <div className="admin-quick-actions-list">
            <Link to="/admin/projects" className="admin-quick-action-link">
              <FolderKanban size={18} />
              <span>Add a project</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/admin/materials" className="admin-quick-action-link">
              <LibraryBig size={18} />
              <span>Update materials</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/admin/movies" className="admin-quick-action-link">
              <Film size={18} />
              <span>Publish movie entry</span>
              <ArrowRight size={16} />
            </Link>

            <Link to="/admin/blogs" className="admin-quick-action-link">
              <FileText size={18} />
              <span>Write a blog</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>

      <AdminKpiGrid
        items={[
          {
            label: 'Projects',
            value: String(projects.length),
            hint: `${featuredProjects} featured`,
            icon: <FolderKanban size={18} />,
            tone: 'primary'
          },
          {
            label: 'Materials',
            value: String(materials.length),
            hint: `${featuredMaterials} featured`,
            icon: <LibraryBig size={18} />,
            tone: 'default'
          },
          {
            label: 'Movies',
            value: String(movies.length),
            hint: `${featuredMovies} featured`,
            icon: <Film size={18} />,
            tone: 'warning'
          },
          {
            label: 'Blogs',
            value: String(blogs.length),
            hint: `${publishedBlogs} published`,
            icon: <FileText size={18} />,
            tone: 'success'
          },
          {
            label: 'Contacts',
            value: String(contacts.length),
            hint: 'Public inbox activity',
            icon: <Inbox size={18} />,
            tone: 'default'
          },
          {
            label: 'Sections',
            value: '6',
            hint: `${totalResources} total content items`,
            icon: <Settings2 size={18} />,
            tone: 'primary',
            trend: {
              value: '+12%',
              direction: 'up',
              label: 'this cycle'
            }
          }
        ]}
      />

      <div className="admin-two-col-grid">
        <AdminPageSection
          title="Publishing health"
          eyebrow="Content overview"
          icon={<TrendingUp size={18} />}
          text="See what is currently highlighted on the public site and where the next updates may be needed."
        >
          <div className="admin-health-grid">
            <div className="admin-health-item">
              <strong>{featuredProjects}</strong>
              <span>Featured projects</span>
            </div>
            <div className="admin-health-item">
              <strong>{featuredMaterials}</strong>
              <span>Featured materials</span>
            </div>
            <div className="admin-health-item">
              <strong>{featuredMovies}</strong>
              <span>Featured movies</span>
            </div>
            <div className="admin-health-item">
              <strong>{publishedBlogs}</strong>
              <span>Published blogs</span>
            </div>
          </div>
        </AdminPageSection>

        <AdminPageSection
          title="Recent contact messages"
          eyebrow="Inbox snapshot"
          icon={<Inbox size={18} />}
          text="Latest public enquiries appear here first so you can respond faster."
          actions={
            <Link to="/admin/contacts" className="inline-link">
              Open inbox <ArrowRight size={16} />
            </Link>
          }
        >
          {loading ? (
            <p className="muted-text">Loading recent messages...</p>
          ) : latestContacts.length === 0 ? (
            <AdminEmptyState
              title="No recent messages"
              text="Once visitors start using the contact form, their newest messages will appear here."
              note="Contact activity will appear in real time as new submissions come in."
            />
          ) : (
            <div className="admin-mini-card-grid">
              {latestContacts.map((item: any) => (
                <article key={item.id} className="mini-card">
                  <div className="mini-card-top">
                    <h3>{item.name}</h3>
                    <span className="badge">{item.subject}</span>
                  </div>
                  <p className="mini-card-meta">{item.email}</p>
                  <p>{item.message}</p>
                </article>
              ))}
            </div>
          )}
        </AdminPageSection>
      </div>
    </AdminShell>
  )
}