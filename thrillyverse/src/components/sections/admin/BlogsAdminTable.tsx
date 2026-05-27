'use client';

import type { Blog } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function BlogsAdminTable({ initialData }: { initialData: Blog[] }) {
  return (
    <BaseAdminTable
      title="Blogs"
      addLabel="Add Blog"
      createHref="/admin/blogs/new"
      data={initialData}
      tableName="blogs"
      deletePaths={['/blogs', '/admin/blogs']}
      searchKeys={['title', 'category', 'excerpt', 'slug']}
      filters={[
        { key: 'published', label: 'Published' },
        { key: 'draft', label: 'Draft' },
        { key: 'featured', label: 'Featured' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Category', render: (row) => row.category ?? '—' },
        { label: 'Read Time', render: (row) => `${row.read_time} min` },
        { label: 'Status', render: (row) => (row.published ? 'Published' : 'Draft') },
      ]}
    />
  );
}