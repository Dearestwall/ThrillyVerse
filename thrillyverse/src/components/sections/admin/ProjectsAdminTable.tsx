'use client';

import type { Project } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function ProjectsAdminTable({ initialData }: { initialData: Project[] }) {
  return (
    <BaseAdminTable
      title="Projects"
      addLabel="Add Project"
      createHref="/admin/projects/new"
      data={initialData}
      tableName="projects"
      deletePaths={['/', '/admin/projects']}
      searchKeys={['title', 'summary', 'slug']}
      filters={[
        { key: 'draft', label: 'Draft' },
        { key: 'published', label: 'Published' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Summary', render: (row) => row.summary ?? '—' },
        { label: 'Stack', render: (row) => row.tech_stack.join(', ') },
        { label: 'Status', render: (row) => row.status },
      ]}
    />
  );
}