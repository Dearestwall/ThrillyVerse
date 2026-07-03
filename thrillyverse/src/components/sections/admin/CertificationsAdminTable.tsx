'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { ToggleLeft, ToggleRight, Trash2, Award } from 'lucide-react';
import { AdminBulkTemplateField, AdminShell } from './AdminShell';
import {
  createCertificationAction,
  updateCertificationAction,
  toggleCertificationActiveAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Certification } from '@/types';

type CertificationLike = Certification & {
  issuer?: string | null;
  issue_date?: string | null;
  credential_url?: string | null;
  image_url?: string | null;
  description?: string | null;
  active?: boolean | null;
};

export const certificationsBulkFields: AdminBulkTemplateField[] = [
  { key: 'title',          label: 'Title',          type: 'text',     required: true             },
  { key: 'issuer',         label: 'Issuer',         type: 'text'                                 },
  { key: 'issue_date',     label: 'Issue Date',     type: 'date'                                 },
  { key: 'credential_url', label: 'Credential URL', type: 'url'                                  },
  { key: 'image_url',      label: 'Image URL',      type: 'url'                                  },
  { key: 'description',    label: 'Description',    type: 'textarea'                             },
  { key: 'sort_order',     label: 'Sort Order',     type: 'number'                               },
  { key: 'active',         label: 'Active',         type: 'checkbox', helpText: 'true/false'     },
];

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().optional(),
  issue_date: z.string().optional(),
  credential_url: z.string().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
  sort_order: z.coerce.number().default(0),
  active: z.boolean().default(true),
});

type FD = z.infer<typeof schema>;

function CertificationForm({
  item,
  onClose,
  onSaved,
}: {
  item: CertificationLike | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          issuer: item.issuer ?? '',
          issue_date: item.issue_date ?? '',
          credential_url: item.credential_url ?? '',
          image_url: item.image_url ?? '',
          description: item.description ?? '',
          sort_order: item.sort_order ?? 0,
          active: item.active ?? true,
        }
      : {
          title: '',
          issuer: '',
          issue_date: '',
          credential_url: '',
          image_url: '',
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
      <div className="admin-form-header">
        <div className="logo-circle">
          <Award size={18} />
        </div>
        <div>
          <h2 className="modal-title">{item ? 'Edit Certification' : 'Add Certification'}</h2>
          <p className="modal-subtitle">
            Manage titles, issuers, verification links, and showcase order.
          </p>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="form-error">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Issuer</label>
          <input className="form-input" {...form.register('issuer')} />
        </div>

        <div className="form-group">
          <label className="form-label">Issue Date</label>
          <input type="date" className="form-input" {...form.register('issue_date')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Credential URL</label>
          <input className="form-input" {...form.register('credential_url')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Image URL</label>
          <input className="form-input" {...form.register('image_url')} />
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

export default function CertificationsAdminTable({
  initialData,
}: {
  initialData: CertificationLike[];
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
  <AdminShell<CertificationLike>
    title="Certifications"
    initialData={initialData}
    searchKeys={['title', 'issuer', 'description']}
    exportFields={['id', 'title', 'issuer', 'issue_date', 'credential_url', 'sort_order', 'active']}
    onBulkUpload={bulkUpload}
    addLabel="Add Certification"
    stats={[
      { label: 'Total', value: (rows) => rows.length },
      { label: 'Active', value: (rows) => rows.filter((r) => !!r.active).length, tone: 'success' },
      { label: 'Inactive', value: (rows) => rows.filter((r) => !r.active).length, tone: 'warning' },
    ]}
    columns={[
      { key: 'title', label: 'Title', render: (row) => <span className="font-medium">{row.title}</span> },
      { key: 'issuer', label: 'Issuer', render: (row) => row.issuer ?? '—' },
      { key: 'issue_date', label: 'Date', mobileHidden: true, render: (row) => row.issue_date ?? '—' },
      { key: 'credential_url', label: 'Credential', mobileHidden: true, render: (row) => row.credential_url ?? '—' },
      { key: 'image_url', label: 'Image', mobileHidden: true, render: (row) => row.image_url ?? '—' },
      { key: 'sort_order', label: 'Order', mobileHidden: true, render: (row) => row.sort_order ?? 0 },
      {
        key: 'active',
        label: 'Status',
        render: (row) => (
          <span className={`badge ${row.active ? 'badge-success' : 'badge-muted'}`}>
            {row.active ? 'Active' : 'Inactive'}
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
              await toggleCertificationActiveAction(row.id, !row.active);
              window.location.reload();
            })
          }
          aria-label={row.active ? 'Deactivate certification' : 'Activate certification'}
        >
          {row.active ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
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
          aria-label="Delete certification"
        >
          <Trash2 size={14} />
        </button>
      </>
    )}
    renderForm={(item, onClose, onSaved) => <CertificationForm item={item} onClose={onClose} onSaved={onSaved} />}
  />
);
}