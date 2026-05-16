import { FolderKanban } from 'lucide-react'
import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useProjects } from '../../hooks/resources'

export function AdminProjects() {
  const resource = useProjects()

  return (
    <AdminShell
      title="Manage projects"
      text="Control games, tools, calculators, and utilities shown across ThrillyVerse."
    >
      <AdminResourcePage
        icon={<FolderKanban size={18} />}
        title="Projects"
        description="Projects feed homepage highlights and future project hubs."
        resourceName="project"
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
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'url', label: 'Project URL', type: 'url' },
  { key: 'logo_url', label: 'Logo URL', type: 'image', required: false },
  { key: 'category', label: 'Category', required: false },
  { key: 'featured', label: 'Featured', type: 'checkbox', required: false }
]}
      />
    </AdminShell>
  )
}