'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createNotificationAction,
  updateNotificationAction,
  toggleNotificationActiveAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Notification } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  message: z.string().min(1, 'Required'),
  type: z.string().default('info'),
  target_url: z.string().optional(),
  audience: z.string().default('all'),
  is_active: z.boolean().default(true),
});

type FD = z.infer<typeof schema>;

function NotificationForm({
  item,
  onClose,
  onSaved,
}: {
  item: Notification | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          message: item.message ?? '',
          type: item.type ?? 'info',
          target_url: item.target_url ?? '',
          audience: item.audience ?? 'all',
          is_active: !!item.is_active,
        }
      : {
          title: '',
          message: '',
          type: 'info',
          target_url: '',
          audience: 'all',
          is_active: true,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.is_active) fd.set('is_active', 'on');

    try {
      if (item) await updateNotificationAction(item.id, fd);
      else await createNotificationAction(fd);

      toast.success(item ? 'Notification updated' : 'Notification created');
      onSaved();
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Notification' : 'New Notification'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...register('title')} />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Message</label>
          <textarea className="form-input" rows={4} {...register('message')} />
          {errors.message && <p className="form-error">{errors.message.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <input className="form-input" {...register('type')} />
        </div>

        <div className="form-group">
          <label className="form-label">Audience</label>
          <input className="form-input" {...register('audience')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Target URL</label>
          <input className="form-input" {...register('target_url')} />
        </div>

        <label className="check-row col-span-2">
          <input type="checkbox" {...register('is_active')} />
          Active
        </label>
      </div>

      <div className="modal-form-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : item ? 'Update Notification' : 'Create Notification'}
        </button>
      </div>
    </form>
  );
}

export default function NotificationsAdminTable({
  initialNotifications,
}: {
  initialNotifications: Notification[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.is_active).toLowerCase() === 'true') fd.set('is_active', 'on');
      await createNotificationAction(fd);
    }
  };

  return (
    <AdminShell<Notification>
      title="Notifications"
      initialData={initialNotifications}
      searchKeys={['title', 'message', 'type', 'audience']}
      exportFields={['id', 'title', 'type', 'audience', 'is_active', 'created_at']}
      onBulkUpload={bulkUpload}
      columns={[
        { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
        { key: 'type', label: 'Type' },
        { key: 'audience', label: 'Audience' },
        {
          key: 'is_active',
          label: 'Status',
          render: (r) => (
            <span className={`badge ${r.is_active ? 'badge-success' : 'badge-muted'}`}>
              {r.is_active ? 'Active' : 'Inactive'}
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
                await toggleNotificationActiveAction(row.id, !row.is_active);
                window.location.reload();
              })
            }
            aria-label={row.is_active ? 'Deactivate' : 'Activate'}
          >
            {row.is_active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('notifications', row.id, ['/admin/notifications']);
                window.location.reload();
              })
            }
            aria-label="Delete notification"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <NotificationForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}