'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createCertificationAction,
  updateCertificationAction,
  toggleCertificationActiveAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Certification } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  emoji: z.string().optional(),
  image_url: z.string().optional(),
  verify_url: z.string().optional(),
  issuer: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type FD = z.infer<typeof schema>;

function CertificationForm({
  item,
  onClose,
  onSaved,
}: {
  item: Certification | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          subtitle: item.subtitle ?? '',
          emoji: item.emoji ?? '',
          image_url: (item as any).image_url ?? '',
          verify_url: (item as any).verify_url ?? '',
          issuer: (item as any).issuer ?? '',
          sort_order: item.sort_order ?? 0,
          active: (item as any).active ?? true,
        }
      : {
          title: '',
          subtitle: '',
          emoji: '🏆',
          image_url: '',
          verify_url: '',
          issuer: '',
          sort_order: 0,
          active: true,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      fd.append(key, String(value ?? ''));
    });
    if (data.active) fd.set('active', 'on');

    try {
      if (item) {
        await updateCertificationAction(item.id, fd);
        toast.success('Certification updated');
      } else {
        await createCertificationAction(fd);
        toast.success('Certification created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save certification');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Certification' : 'Add Certification'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="form-error">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Subtitle</label>
          <textarea rows={3} className="form-input" {...form.register('subtitle')} />
        </div>

        <div className="form-group">
          <label className="form-label">Emoji</label>
          <input className="form-input" {...form.register('emoji')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" {...form.register('image_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Verify URL</label>
          <input className="form-input" {...form.register('verify_url')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Issuer</label>
          <input className="form-input" {...form.register('issuer')} />
        </div>

        <label className="check-row col-span-2">
          <input type="checkbox" {...form.register('active')} />
          Active
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

export default function CertificationsAdminTable({
  initialCertifications,
}: {
  initialCertifications: Certification[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.active).toLowerCase() === 'true') fd.set('active', 'on');
      await createCertificationAction(fd);
    }
  };

  return (
    <AdminShell<Certification>
      title="Certifications"
      initialData={initialCertifications}
      searchKeys={['title', 'subtitle', 'emoji']}
      exportFields={['id', 'title', 'subtitle', 'emoji', 'sort_order']}
      onBulkUpload={bulkUpload}
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (r) => <span className="font-medium">{r.title}</span>,
        },
        {
          key: 'subtitle',
          label: 'Subtitle',
          render: (r) => r.subtitle || '—',
        },
        {
          key: 'emoji',
          label: 'Emoji',
          render: (r) => r.emoji || '—',
        },
        {
          key: 'sort_order',
          label: 'Order',
          render: (r) => r.sort_order ?? 0,
        },
        {
          key: 'active',
          label: 'Status',
          render: (r) => (
            <span className={`badge ${(r as any).active ? 'badge-success' : 'badge-muted'}`}>
              {(r as any).active ? 'Active' : 'Inactive'}
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
                await toggleCertificationActiveAction(row.id, !(row as any).active);
                window.location.reload();
              })
            }
          >
            {(row as any).active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('certifications', row.id, ['/', '/admin/certifications']);
                window.location.reload();
              })
            }
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <CertificationForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}