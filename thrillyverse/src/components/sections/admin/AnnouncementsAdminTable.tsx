'use client';

import type { Announcement } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function AnnouncementsAdminTable({ initialData }: { initialData: Announcement[] }) {
  return (
    <BaseAdminTable
      title="Announcements"
      addLabel="Add Announcement"
      createHref="/admin/announcements/new"
      data={initialData}
      tableName="announcements"
      deletePaths={['/', '/admin/announcements']}
      searchKeys={['title', 'badge', 'cta_label']}
      filters={[
        { key: 'active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Badge', render: (row) => row.badge ?? '—' },
        { label: 'CTA', render: (row) => row.cta_label ?? '—' },
        { label: 'Status', render: (row) => (row.active ? 'Active' : 'Inactive') },
      ]}
    />
  );
}