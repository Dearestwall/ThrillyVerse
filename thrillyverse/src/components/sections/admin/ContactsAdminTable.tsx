'use client';
import type { Contact } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function ContactsAdminTable({ initialData }: { initialData: Contact[] }) {
  return <BaseAdminTable title="Contacts" addLabel="Export Contacts" data={initialData} columns={[
    { label: 'Name', render: (row) => row.name },
    { label: 'Email', render: (row) => row.email },
    { label: 'Subject', render: (row) => row.subject ?? '—' },
    { label: 'Read', render: (row) => row.read ? 'Yes' : 'No' }
  ]} />;
}