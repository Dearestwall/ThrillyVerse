'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createPartnerAction,
  updatePartnerAction,
  togglePartnerActiveAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Partner } from '@/types';

type PartnerLike = Partner & {
  website_url?: string | null;
  description?: string | null;
  active?: boolean | null;
};

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  emoji: z.string().optional(),
  logo_url: z.string().optional(),
  website_url: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type FD = z.infer<typeof schema>;

function PartnerForm({
  item,
  onClose,
  onSaved,
}: {
  item: PartnerLike | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          name: item.name ?? '',
          emoji: item.emoji ?? '',
          logo_url: item.logo_url ?? '',
          website_url: item.website_url ?? '',
          description: item.description ?? '',
          sort_order: item.sort_order ?? 0,
          active: item.active ?? true,
        }
      : {
          name: '',
          emoji: '🤝',
          logo_url: '',
          website_url: '',
          description: '',
          sort_order: 0,
          active: true,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.active) fd.set('active', 'on');

    try {
      if (item) {
        await updatePartnerAction(item.id, fd);
        toast.success('Partner updated');
      } else {
        await createPartnerAction(fd);
        toast.success('Partner created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save partner');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Partner' : 'Add Partner'}</h2>

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" {...form.register('name')} />
          {form.formState.errors.name && (
            <p className="form-error">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Emoji</label>
          <input className="form-input" {...form.register('emoji')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Logo URL</label>
          <input className="form-input" {...form.register('logo_url')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Website URL</label>
          <input className="form-input" {...form.register('website_url')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Description</label>
          <textarea rows={4} className="form-input" {...form.register('description')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <label className="check-row">
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

export default function PartnersAdminTable({
  initialData,
}: {
  initialData: PartnerLike[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.active).toLowerCase() === 'true') fd.set('active', 'on');
      await createPartnerAction(fd);
    }
  };

 return (
  <AdminShell<PartnerLike>
    title="Partners"
    initialData={initialData}
    searchKeys={['name', 'emoji', 'description']}
    exportFields={['id', 'name', 'emoji', 'logo_url', 'website_url', 'sort_order', 'active']}
    onBulkUpload={bulkUpload}
    stats={[
      { label: 'Total', value: (rows) => rows.length },
      { label: 'Active', value: (rows) => rows.filter((r) => !!r.active).length, tone: 'success' },
    ]}
    columns={[
      { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
      { key: 'emoji', label: 'Emoji', mobileHidden: true, render: (r) => r.emoji ?? '—' },
      { key: 'logo_url', label: 'Logo', mobileHidden: true, render: (r) => r.logo_url ?? '—' },
      { key: 'website_url', label: 'Website', mobileHidden: true, render: (r) => r.website_url ?? '—' },
      { key: 'description', label: 'Description', mobileHidden: true, render: (r) => r.description ?? '—' },
      { key: 'sort_order', label: 'Order', mobileHidden: true, render: (r) => r.sort_order ?? 0 },
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
              await togglePartnerActiveAction(row.id, !row.active);
              window.location.reload();
            })
          }
          aria-label={row.active ? 'Deactivate partner' : 'Activate partner'}
        >
          {row.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm danger"
          onClick={() =>
            startTransition(async () => {
              await deleteRowAction('partners', row.id, ['/', '/admin/partners']);
              window.location.reload();
            })
          }
          aria-label="Delete partner"
        >
          <Trash2 size={14} />
        </button>
      </>
    )}
    renderForm={(item, onClose, onSaved) => <PartnerForm item={item} onClose={onClose} onSaved={onSaved} />}
  />
);
}