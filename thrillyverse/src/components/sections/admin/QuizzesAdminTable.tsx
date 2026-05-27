'use client';

import type { Quiz } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';

export function QuizzesAdminTable({ initialData }: { initialData: Quiz[] }) {
  return (
    <BaseAdminTable
      title="Quizzes"
      addLabel="Add Quiz"
      createHref="/admin/quizzes/new"
      data={initialData}
      tableName="quizzes"
      deletePaths={['/materials', '/admin/quizzes']}
      searchKeys={['title', 'board', 'class_level', 'subject', 'difficulty']}
      filters={[
        { key: 'published', label: 'Published' },
        { key: 'draft', label: 'Draft' },
      ]}
      columns={[
        { label: 'Title', render: (row) => row.title },
        { label: 'Board', render: (row) => row.board ?? '—' },
        { label: 'Class', render: (row) => row.class_level ?? '—' },
        { label: 'Difficulty', render: (row) => row.difficulty },
        { label: 'Time', render: (row) => `${row.time_limit} min` },
      ]}
    />
  );
}