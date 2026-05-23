'use client';
import type { Blog } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function BlogsAdminTable({ initialData }: { initialData: Blog[] }) {
  return <BaseAdminTable title="Blogs" addLabel="Add Blog" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Category', render: (row) => row.category ?? '—' },
    { label: 'Read Time', render: (row) => `${row.read_time} min` },
    { label: 'Status', render: (row) => row.published ? 'Published' : 'Draft' }
  ]} />;
}