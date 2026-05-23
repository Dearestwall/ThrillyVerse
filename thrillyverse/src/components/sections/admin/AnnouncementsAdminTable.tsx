'use client';
import type { Announcement } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function AnnouncementsAdminTable({ initialData }: { initialData: Announcement[] }) {
  return <BaseAdminTable title="Announcements" addLabel="Add Announcement" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Badge', render: (row) => row.badge ?? '—' },
    { label: 'CTA', render: (row) => row.cta_label ?? '—' },
    { label: 'Status', render: (row) => row.active ? 'Active' : 'Inactive' }
  ]} />;
}