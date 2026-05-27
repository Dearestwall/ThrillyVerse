'use client';

import type { Movie } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function MoviesAdminTable({ initialData }: { initialData: Movie[] }) {
  return (
    <BaseAdminTable
      title="Movies"
      addLabel="Add Movie"
      createHref="/admin/movies/new"
      data={initialData}
      tableName="movies"
      deletePaths={['/movies', '/admin/movies']}
      searchKeys={['title', 'category', 'language', 'rating', 'tags']}
      filters={[
        { key: 'published', label: 'Published' },
        { key: 'draft', label: 'Draft' },
        { key: 'featured', label: 'Featured' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Category', render: (row) => row.category ?? '—' },
        { label: 'Year', render: (row) => row.year ?? '—' },
        { label: 'Rating', render: (row) => row.rating ?? '—' },
        { label: 'Status', render: (row) => (row.published ? 'Published' : 'Draft') },
      ]}
    />
  );
}