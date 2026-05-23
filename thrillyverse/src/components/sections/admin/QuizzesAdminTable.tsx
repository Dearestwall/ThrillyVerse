'use client';
import type { Quiz } from '@/types';
import { BaseAdminTable } from './BaseAdminTable';
export function QuizzesAdminTable({ initialData }: { initialData: Quiz[] }) {
  return <BaseAdminTable title="Quizzes" addLabel="Add Quiz" data={initialData} columns={[
    { label: 'Title', render: (row) => row.title },
    { label: 'Board', render: (row) => row.board ?? '—' },
    { label: 'Class', render: (row) => row.class_level ?? '—' },
    { label: 'Difficulty', render: (row) => row.difficulty },
    { label: 'Time', render: (row) => `${row.time_limit} min` }
  ]} />;
}