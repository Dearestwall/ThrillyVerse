'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createReviewAction,
  updateReviewAction,
  toggleReviewPublishedAction,
  toggleReviewFeaturedAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Review } from '@/types';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().optional(),
  avatar_url: z.string().optional(),
  text: z.string().min(1, 'Review text is required'),
  rating: z.coerce.number().min(1).max(5).default(5),
  emoji: z.string().default('⭐'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.coerce.number().default(0),
});

type FD = z.infer<typeof schema>;

function ReviewForm({
  item,
  onClose,
  onSaved,
}: {
  item: Review | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          name: item.name ?? '',
          role: item.role ?? '',
          avatar_url: item.avatar_url ?? '',
          text: item.text ?? '',
          rating: item.rating ?? 5,
          emoji: item.emoji ?? '⭐',
          featured: !!item.featured,
          published: !!item.published,
          sort_order: item.sort_order ?? 0,
        }
      : {
          name: '',
          role: '',
          avatar_url: '',
          text: '',
          rating: 5,
          emoji: '⭐',
          featured: false,
          published: true,
          sort_order: 0,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.featured) fd.set('featured', 'on');
    if (data.published) fd.set('published', 'on');

    try {
      if (item) {
        await updateReviewAction(item.id, fd);
        toast.success('Review updated');
      } else {
        await createReviewAction(fd);
        toast.success('Review created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save review');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Review' : 'Add Review'}</h2>

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" {...form.register('name')} />
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
          <input className="form-input" {...form.register('role')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Avatar URL</label>
          <input className="form-input" {...form.register('avatar_url')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Text</label>
          <textarea rows={5} className="form-input" {...form.register('text')} />
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <input type="number" min={1} max={5} className="form-input" {...form.register('rating')} />
        </div>

        <div className="form-group">
          <label className="form-label">Emoji</label>
          <input className="form-input" {...form.register('emoji')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <label className="check-row">
          <input type="checkbox" {...form.register('featured')} />
          Featured
        </label>

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
          {form.formState.isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default function ReviewsAdminTable({
  initialReviews,
}: {
  initialReviews: Review[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.featured).toLowerCase() === 'true') fd.set('featured', 'on');
      if (String(row.published).toLowerCase() === 'true') fd.set('published', 'on');
      await createReviewAction(fd);
    }
  };

  return (
    <AdminShell<Review>
      title="Reviews"
      initialData={initialReviews}
      searchKeys={['name', 'role', 'text', 'emoji']}
      exportFields={['id', 'name', 'role', 'rating', 'featured', 'published', 'sort_order']}
      onBulkUpload={bulkUpload}
      columns={[
        { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
        { key: 'role', label: 'Role', render: (r) => r.role || '—' },
        { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
        { key: 'emoji', label: 'Emoji', render: (r) => r.emoji || '—' },
        {
          key: 'published',
          label: 'Status',
          render: (r) => (
            <span className={`badge ${r.published ? 'badge-success' : 'badge-muted'}`}>
              {r.published ? 'Published' : 'Draft'}
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
                await toggleReviewPublishedAction(row.id, !row.published);
                window.location.reload();
              })
            }
          >
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>

          <button
            type="button"
            className={`btn btn-ghost btn-sm ${row.featured ? 'text-yellow-500' : ''}`}
            onClick={() =>
              startTransition(async () => {
                await toggleReviewFeaturedAction(row.id, !row.featured);
                window.location.reload();
              })
            }
          >
            <Star size={14} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('reviews', row.id, ['/', '/admin/reviews']);
                window.location.reload();
              })
            }
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <ReviewForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}