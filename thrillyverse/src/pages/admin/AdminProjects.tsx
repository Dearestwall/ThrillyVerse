import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useProjects } from '../../hooks/resources'

export function AdminProjects() {
  const resource = useProjects()

  return (
    <AdminShell title="Manage projects" text="Add or update tools, utilities, and game cards that appear across the platform.">
      <AdminResourcePage
        title="Projects"
        description="Projects power the homepage showcase and can later feed a dedicated projects section."
        items={resource.items}
        loading={resource.loading}
        onCreate={resource.createItem}
        onUpdate={resource.updateItem}
        onDelete={resource.deleteItem}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'url', label: 'Project URL', type: 'url' },
          { key: 'logo_url', label: 'Logo URL', type: 'url' },
          { key: 'category', label: 'Category' },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ]}
      />
    </AdminShell>
  )
}