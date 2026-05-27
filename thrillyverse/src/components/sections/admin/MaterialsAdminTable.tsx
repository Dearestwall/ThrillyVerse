'use client';

import type { Material } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function MaterialsAdminTable({ initialData }: { initialData: Material[] }) {
  return (
    <BaseAdminTable
      title="Materials"
      addLabel="Add Material"
      createHref="/admin/materials/new"
      data={initialData}
      tableName="materials"
      deletePaths={['/materials', '/admin/materials']}
      searchKeys={['title', 'board', 'class_level', 'subject', 'topic', 'resource_type']}
      filters={[
        { key: 'published', label: 'Published' },
        { key: 'featured', label: 'Featured' },
        { key: 'premium', label: 'Premium' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Board', render: (row) => row.board },
        { label: 'Class', render: (row) => row.class_level },
        { label: 'Subject', render: (row) => row.subject },
        { label: 'Type', render: (row) => row.resource_type },
      ]}
    />
  );
}