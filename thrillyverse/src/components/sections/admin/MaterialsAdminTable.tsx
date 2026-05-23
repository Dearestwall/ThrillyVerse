'use client';
import type { Material } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function MaterialsAdminTable({ initialData }: { initialData: Material[] }) {
  return <BaseAdminTable title="Materials" addLabel="Add Material" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Board', render: (row) => row.board },
    { label: 'Class', render: (row) => row.class_level },
    { label: 'Subject', render: (row) => row.subject },
    { label: 'Type', render: (row) => row.resource_type }
  ]} />;
}