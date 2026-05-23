'use client';
import type { Movie } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function MoviesAdminTable({ initialData }: { initialData: Movie[] }) {
  return <BaseAdminTable title="Movies" addLabel="Add Movie" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Category', render: (row) => row.category ?? '—' },
    { label: 'Year', render: (row) => row.year ?? '—' },
    { label: 'Rating', render: (row) => row.rating ?? '—' },
    { label: 'Status', render: (row) => row.published ? 'Published' : 'Draft' }
  ]} />;
}