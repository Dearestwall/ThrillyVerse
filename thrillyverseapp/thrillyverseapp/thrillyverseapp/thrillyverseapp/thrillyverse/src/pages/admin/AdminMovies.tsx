import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useMovies } from '../../hooks/resources'

export function AdminMovies() {
  const resource = useMovies()

  return (
    <AdminShell title="Manage movies and series" text="Publish entries for Hindi, Punjabi, Hollywood, and web-series updates.">
      <AdminResourcePage
        title="Movies"
        description="Poster cards, categories, and release-year fields are ready for future expansion."
        items={resource.items}
        loading={resource.loading}
        onCreate={resource.createItem}
        onUpdate={resource.updateItem}
        onDelete={resource.deleteItem}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'language', label: 'Language' },
          { key: 'type', label: 'Type' },
          { key: 'poster_url', label: 'Poster URL', type: 'url' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'release_year', label: 'Release year', type: 'number' },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ]}
      />
    </AdminShell>
  )
}