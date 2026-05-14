import { FileText, Film, FolderKanban, Inbox, LibraryBig, Settings2 } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { StatCard } from '../../components/ui/StatCard'
import { useBlogs, useContacts, useMaterials, useMovies, useProjects } from '../../hooks/resources'

export function AdminDashboard() {
  const { items: projects } = useProjects()
  const { items: materials } = useMaterials()
  const { items: movies } = useMovies()
  const { items: blogs } = useBlogs()
  const { items: contacts } = useContacts()

  return (
    <AdminShell
      title="Dashboard overview"
      text="Use this control center to keep every section of ThrillyVerse updated from one place."
    >
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
          <h2>What this admin already covers</h2>
          <ul className="clean-list">
            <li>Project cards and external links</li>
            <li>Material folders and categories</li>
            <li>Movie and series listings</li>
            <li>Blog creation and publish status</li>
            <li>Contact inbox reviews</li>
            <li>Homepage hero and announcement settings</li>
          </ul>
        </section>

        <section className="card admin-list-card">
          <h2>Best next integrations</h2>
          <ul className="clean-list">
            <li>Supabase storage uploads for logos, posters, and blog covers</li>
            <li>Rich blog editor and slug detail pages</li>
            <li>Admin role policies with row-level security</li>
            <li>Search and analytics modules</li>
            <li>Featured ordering and scheduling tools</li>
          </ul>
        </section>
      </div>
    </AdminShell>
  )
}