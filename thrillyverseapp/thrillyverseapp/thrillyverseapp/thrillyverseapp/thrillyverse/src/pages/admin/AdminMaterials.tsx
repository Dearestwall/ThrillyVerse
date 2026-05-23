import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useMaterials } from '../../hooks/resources'

export function AdminMaterials() {
  const resource = useMaterials()

  return (
    <AdminShell title="Manage materials" text="Keep school resources, folders, and subject categories organized from one screen.">
      <AdminResourcePage
        title="Materials"
        description="Every resource can carry a subject, title, category, and Drive link."
        items={resource.items}
        loading={resource.loading}
        onCreate={resource.createItem}
        onUpdate={resource.updateItem}
        onDelete={resource.deleteItem}
        fields={[
          { key: 'subject', label: 'Subject' },
          { key: 'title', label: 'Title' },
          { key: 'description', label: 'Description', type: 'textarea' },
          { key: 'drive_url', label: 'Drive URL', type: 'url' },
          { key: 'category', label: 'Category' },
          { key: 'featured', label: 'Featured', type: 'checkbox' }
        ]}
      />
    </AdminShell>
  )
}