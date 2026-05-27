'use client';

import type { Contact } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function ContactsAdminTable({ initialData }: { initialData: Contact[] }) {
  return (
    <BaseAdminTable
      title="Contacts"
      addLabel="Export Contacts"
      data={initialData}
      tableName="contacts"
      deletePaths={['/admin/contacts']}
      searchKeys={['name', 'email', 'subject', 'message']}
      filters={[
        { key: 'read', label: 'Read' },
        { key: 'unread', label: 'Unread' },
      ]}
      columns={[
        { label: 'Name', render: (row) => row.name },
        { label: 'Email', render: (row) => row.email },
        { label: 'Subject', render: (row) => row.subject ?? '—' },
        { label: 'Read', render: (row) => (row.read ? 'Yes' : 'No') },
      ]}
      onExport={() => {
        const csv = [
          ['Name', 'Email', 'Subject', 'Message', 'Read'].join(','),
          ...initialData.map((r) =>
            [
              r.name,
              r.email,
              r.subject ?? '',
              (r.message ?? '').replace(/"/g, '""'),
              r.read ? 'Yes' : 'No',
            ]
              .map((v) => `"${String(v)}"`)
              .join(',')
          ),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        a.click();
        URL.revokeObjectURL(url);
      }}
    />
  );
}