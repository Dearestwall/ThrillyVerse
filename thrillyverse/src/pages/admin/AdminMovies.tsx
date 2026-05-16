import { Film } from 'lucide-react'
import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useMovies } from '../../hooks/resources'

export function AdminMovies() {
  const resource = useMovies()

  return (
    <AdminShell
      title="Manage movies and series"
      text="Publish entertainment entries for Hindi, Punjabi, Hollywood, and web-series updates."
    >
      <AdminResourcePage
        icon={<Film size={18} />}
        title="Movies"
        description="Add posters, categories, release year, type, and featured placement."
        resourceName="movie"
        items={resource.items}
        filteredItems={resource.filteredItems}
        loading={resource.loading}
        saving={resource.saving}
        error={resource.error}
        query={resource.query}
        setQuery={resource.setQuery}
        total={resource.total}
        onRefresh={resource.refresh}
        onCreate={resource.createItem}
        onUpdate={resource.updateItem}
        onDelete={resource.deleteItem}
       fields={[
  { key: 'title', label: 'Title' },
  { key: 'language', label: 'Language', required: false },
  { key: 'type', label: 'Type', required: false },
  { key: 'poster_url', label: 'Poster URL', type: 'image', required: false },
  { key: 'status', label: 'Status', required: false },
  { key: 'description', label: 'Description', type: 'textarea', required: false },
  { key: 'release_year', label: 'Release year', type: 'number', required: false },
  { key: 'featured', label: 'Featured', type: 'checkbox', required: false }
]}
      />
    </AdminShell>
  )
}