import { LibraryBig } from 'lucide-react'
import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useMaterials } from '../../hooks/resources'

export function AdminMaterials() {
  const resource = useMaterials()

  return (
    <AdminShell
      title="Manage materials"
      text="Organize study resources, subject folders, and important academic links."
    >
      <AdminResourcePage
        icon={<LibraryBig size={18} />}
        title="Materials"
        description="Each resource can include subject, description, Drive link, category, and featured status."
        resourceName="material"
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