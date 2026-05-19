import { AdminResourcePage } from '../../components/admin/AdminResourcePage'
import { AdminShell } from '../../components/admin/AdminShell'
import { useBlogs } from '../../hooks/resources'

export function AdminBlogs() {
  const resource = useBlogs()

  return (
    <AdminShell title="Manage blogs" text="Draft, edit, and publish articles from a cleaner editorial workflow.">
      <AdminResourcePage
        title="Blogs"
        description="This starter uses simple fields now, but it is ready to expand into a richer editor later."
        items={resource.items}
        loading={resource.loading}
        onCreate={resource.createItem}
        onUpdate={resource.updateItem}
        onDelete={resource.deleteItem}
        fields={[
          { key: 'title', label: 'Title' },
          { key: 'slug', label: 'Slug' },
          { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
          { key: 'content', label: 'Content', type: 'textarea' },
          { key: 'cover_url', label: 'Cover URL', type: 'url' },
          { key: 'category', label: 'Category' },
          { key: 'published', label: 'Published', type: 'checkbox' }
        ]}
      />
    </AdminShell>
  )
}