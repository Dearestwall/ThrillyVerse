'use client';
import type { Notification } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function NotificationsAdminTable({ initialData }: { initialData: Notification[] }) {
  return <BaseAdminTable title="Notifications" addLabel="Add Notification" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Type', render: (row) => row.type },
    { label: 'Audience', render: (row) => row.audience },
    { label: 'Status', render: (row) => row.is_active ? 'Active' : 'Inactive' }
  ]} />;
}