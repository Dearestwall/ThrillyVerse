'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createQuizAction,
  updateQuizAction,
  toggleQuizPublishedAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Quiz } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional(),
  board: z.string().optional(),
  class_level: z.string().optional(),
  subject: z.string().optional(),
  time_limit: z.coerce.number().min(1).default(10),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  published: z.boolean().default(false),
});

type FD = z.infer<typeof schema>;

function QuizForm({
  item,
  onClose,
  onSaved,
}: {
  item: Quiz | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          description: item.description ?? '',
          board: item.board ?? '',
          class_level: item.class_level ?? '',
          subject: item.subject ?? '',
          time_limit: item.time_limit ?? 10,
          difficulty: (item.difficulty ?? 'medium') as 'easy' | 'medium' | 'hard',
          published: !!item.published,
        }
      : {
          title: '',
          description: '',
          board: '',
          class_level: '',
          subject: '',
          time_limit: 10,
          difficulty: 'medium',
          published: false,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    if (data.published) fd.set('published', 'on');

    try {
      if (item) await updateQuizAction(item.id, fd);
      else await createQuizAction(fd);
      toast.success(item ? 'Quiz updated' : 'Quiz created');
      onSaved();
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Quiz' : 'Create Quiz'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="form-error">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={3} {...form.register('description')} />
        </div>

        <div className="form-group">
          <label className="form-label">Board</label>
          <input className="form-input" {...form.register('board')} />
        </div>

        <div className="form-group">
          <label className="form-label">Class Level</label>
          <input className="form-input" {...form.register('class_level')} />
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input className="form-input" {...form.register('subject')} />
        </div>

        <div className="form-group">
          <label className="form-label">Time Limit</label>
          <input type="number" className="form-input" {...form.register('time_limit')} />
        </div>

        <div className="form-group">
          <label className="form-label">Difficulty</label>
          <select className="form-input" {...form.register('difficulty')}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <label className="check-row">
          <input type="checkbox" {...form.register('published')} />
          Published
        </label>
      </div>

      <div className="modal-form-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : item ? 'Update Quiz' : 'Create Quiz'}
        </button>
      </div>
    </form>
  );
}

export default function QuizzesAdminTable({ initialData }: { initialData: Quiz[] }) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([k, v]) => fd.append(k, String(v ?? '')));
      if (String(row.published).toLowerCase() === 'true') fd.set('published', 'on');
      await createQuizAction(fd);
    }
  };

 return (
  <AdminShell<Quiz>
    title="Quizzes"
    initialData={initialData}
    searchKeys={['title', 'subject', 'board']}
    exportFields={['id', 'title', 'board', 'class_level', 'subject', 'difficulty', 'time_limit', 'published']}
    onBulkUpload={bulkUpload}
    stats={[
      { label: 'Total', value: (rows) => rows.length },
      { label: 'Published', value: (rows) => rows.filter((r) => !!r.published).length, tone: 'success' },
    ]}
    columns={[
      { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
      { key: 'board', label: 'Board', mobileHidden: true },
      { key: 'class_level', label: 'Class', mobileHidden: true },
      { key: 'subject', label: 'Subject' },
      { key: 'difficulty', label: 'Difficulty', mobileHidden: true },
      { key: 'time_limit', label: 'Time', mobileHidden: true, render: (r) => `${r.time_limit ?? 10} min` },
      {
        key: 'published',
        label: 'Status',
        render: (r) => (
          <span className={`badge ${r.published ? 'badge-success' : 'badge-muted'}`}>
            {r.published ? 'Live' : 'Draft'}
          </span>
        ),
      },
    ]}
    extraActions={(row) => (
      <>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() =>
            startTransition(async () => {
              await toggleQuizPublishedAction(row.id, !row.published);
              window.location.reload();
            })
          }
          aria-label={row.published ? 'Unpublish quiz' : 'Publish quiz'}
        >
          {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm danger"
          onClick={() =>
            startTransition(async () => {
              await deleteRowAction('quizzes', row.id, ['/materials', '/admin/quizzes']);
              window.location.reload();
            })
          }
          aria-label="Delete quiz"
        >
          <Trash2 size={14} />
        </button>
      </>
    )}
    renderForm={(item, onClose, onSaved) => <QuizForm item={item} onClose={onClose} onSaved={onSaved} />}
  />
);
}