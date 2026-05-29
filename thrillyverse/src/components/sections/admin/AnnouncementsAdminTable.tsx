'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ToggleLeft, ToggleRight, Trash2, Megaphone } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createAnnouncementAction,
  updateAnnouncementAction,
  toggleAnnouncementActiveAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Announcement } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().optional(),
  cta_label: z.string().optional(),
  cta_url: z.string().optional(),
  badge: z.string().optional(),
  priority: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type FD = z.infer<typeof schema>;

function AnnouncementForm({
  item,
  onClose,
  onSaved,
}: {
  item: Announcement | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          body: item.body ?? '',
          cta_label: item.cta_label ?? '',
          cta_url: item.cta_url ?? '',
          badge: item.badge ?? '',
          priority: item.priority ?? 0,
          active: !!item.active,
        }
      : {
          title: '',
          body: '',
          cta_label: '',
          cta_url: '',
          badge: '',
          priority: 0,
          active: true,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.active) fd.set('active', 'on');

    try {
      if (item) await updateAnnouncementAction(item.id, fd);
      else await createAnnouncementAction(fd);

      toast.success(item ? 'Announcement updated' : 'Announcement created');
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save announcement');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <div className="admin-form-header">
        <div className="logo-circle">
          <Megaphone size={18} />
        </div>
        <div>
          <h2 className="modal-title">{item ? 'Edit Announcement' : 'New Announcement'}</h2>
          <p className="modal-subtitle">
            Create important banners with CTA, badge, and priority ordering.
          </p>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...register('title')} />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Body</label>
          <textarea className="form-input" rows={4} {...register('body')} />
        </div>

        <div className="form-group">
          <label className="form-label">CTA Label</label>
          <input className="form-input" {...register('cta_label')} />
        </div>

        <div className="form-group">
          <label className="form-label">CTA URL</label>
          <input className="form-input" {...register('cta_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Badge</label>
          <input className="form-input" {...register('badge')} />
        </div>

        <div className="form-group">
          <label className="form-label">Priority</label>
          <input type="number" className="form-input" {...register('priority')} />
        </div>

        <label className="check-row col-span-2">
          <input type="checkbox" {...register('active')} />
          Active
        </label>
      </div>

      <div className="modal-form-footer centered-button-row">
        <button type="button" className="btn btn-secondary btn-pill" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-pill" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : item ? 'Update Announcement' : 'Create Announcement'}
        </button>
      </div>
    </form>
  );
}

export default function AnnouncementsAdminTable({
  initialData,
}: {
  initialData: Announcement[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.active).toLowerCase() === 'true') fd.set('active', 'on');
      await createAnnouncementAction(fd);
    }
  };

  return (
    <AdminShell<Announcement>
      title="Announcements"
      initialData={initialData}
      searchKeys={['title', 'body', 'badge']}
      exportFields={['id', 'title', 'badge', 'priority', 'active', 'created_at']}
      onBulkUpload={bulkUpload}
      addLabel="New Announcement"
      stats={[
        { label: 'Total', value: (rows) => rows.length },
        { label: 'Active', value: (rows) => rows.filter((r) => !!r.active).length, tone: 'success' },
        { label: 'Inactive', value: (rows) => rows.filter((r) => !r.active).length, tone: 'warning' },
      ]}
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (r) => <span className="font-medium">{r.title}</span>,
        },
        {
          key: 'badge',
          label: 'Badge',
          render: (r) => r.badge || '—',
        },
        {
          key: 'priority',
          label: 'Priority',
          render: (r) => r.priority ?? 0,
        },
        {
          key: 'active',
          label: 'Status',
          render: (r) => (
            <span className={`badge ${r.active ? 'badge-success' : 'badge-muted'}`}>
              {r.active ? 'Active' : 'Inactive'}
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
                await toggleAnnouncementActiveAction(row.id, !row.active);
                window.location.reload();
              })
            }
            aria-label={row.active ? 'Deactivate announcement' : 'Activate announcement'}
          >
            {row.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('announcements', row.id, ['/', '/admin/announcements']);
                window.location.reload();
              })
            }
            aria-label="Delete announcement"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <AnnouncementForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}