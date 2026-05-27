'use client';

import type { Notification } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function NotificationsAdminTable({ initialData }: { initialData: Notification[] }) {
  return (
    <BaseAdminTable
      title="Notifications"
      addLabel="Add Notification"
      createHref="/admin/notifications/new"
      data={initialData}
      tableName="notifications"
      deletePaths={['/materials', '/admin/notifications']}
      searchKeys={['title', 'message', 'type', 'audience']}
      filters={[
        { key: 'is_active', label: 'Active' },
        { key: 'inactive', label: 'Inactive' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Type', render: (row) => row.type },
        { label: 'Audience', render: (row) => row.audience },
        { label: 'Status', render: (row) => (row.is_active ? 'Active' : 'Inactive') },
      ]}
    />
  );
}