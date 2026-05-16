import { FileText } from 'lucide-react'
import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useBlogs } from '../../hooks/resources'

export function AdminBlogs() {
  const resource = useBlogs()

  return (
    <AdminShell
      title="Manage blogs"
      text="Draft, edit, publish, and organize articles with a cleaner editorial workflow."
    >
      <AdminResourcePage
        icon={<FileText size={18} />}
        title="Blogs"
        description="Use structured fields for titles, slugs, content, and covers while preparing for richer editorial tools later."
        resourceName="blog"
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
          { key: 'slug', label: 'Slug' },
          {
            key: 'excerpt',
            label: 'Excerpt',
            type: 'textarea',
            required: false
          },
          {
            key: 'content',
            label: 'Content',
            type: 'textarea',
            required: false
          },
          {
            key: 'cover_url',
            label: 'Cover URL',
            type: 'image',
            required: false
          },
          {
            key: 'category',
            label: 'Category',
            required: false
          },
          {
            key: 'published',
            label: 'Published',
            type: 'checkbox',
            required: false
          }
        ]}
      />
    </AdminShell>
  )
}