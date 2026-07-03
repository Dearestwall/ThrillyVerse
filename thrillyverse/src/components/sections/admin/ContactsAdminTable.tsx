'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { MailOpen, Mail, Trash2, MessageSquareMore } from 'lucide-react';
import { AdminBulkTemplateField, AdminShell } from './AdminShell';
import { updateContactAction, deleteRowAction, toggleContactReadAction } from '@/app/actions/admin';
import type { Contact } from '@/types';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
  source: z.string().default('website'),
  read: z.boolean().default(false),
});

export const contactsBulkFields: AdminBulkTemplateField[] = [
  { key: 'name',    label: 'Name',    type: 'text',     required: true  },
  { key: 'email',   label: 'Email',   type: 'email',    required: true  },
  { key: 'phone',   label: 'Phone',   type: 'text'                      }, // ADD
  { key: 'subject', label: 'Subject', type: 'text'                      },
  { key: 'message', label: 'Message', type: 'textarea'                  },
  { key: 'source',  label: 'Source',  type: 'text'                      }, // ADD
  { key: 'read',    label: 'Is Read', type: 'checkbox', helpText: 'true/false' }, // was 'is_read'
];

type FD = z.infer<typeof schema>;

function ContactForm({
  item,
  onClose,
  onSaved,
}: {
  item: Contact | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          name: item.name ?? '',
          email: item.email ?? '',
          phone: item.phone ?? '',
          subject: item.subject ?? '',
          message: item.message ?? '',
          source: item.source ?? 'website',
          read: !!item.read,
        }
      : {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          source: 'website',
          read: false,
        },
  });

  const onSubmit = async (data: FD) => {
    if (!item) return;

    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.read) fd.set('read', 'on');

    try {
      await updateContactAction(item.id, fd);
      toast.success('Contact updated');
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update contact');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <div className="admin-form-header">
        <div className="logo-circle">
          <MessageSquareMore size={18} />
        </div>
        <div>
          <h2 className="modal-title">Contact Details</h2>
          <p className="modal-subtitle">Review sender details, source, and message content.</p>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input className="form-input" {...form.register('name')} />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" {...form.register('email')} />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input className="form-input" {...form.register('phone')} />
        </div>

        <div className="form-group">
          <label className="form-label">Subject</label>
          <input className="form-input" {...form.register('subject')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Source</label>
          <input className="form-input" {...form.register('source')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Message</label>
          <textarea rows={8} className="form-input admin-editor" {...form.register('message')} />
        </div>

        <label className="check-row col-span-2">
          <input type="checkbox" {...form.register('read')} />
          Mark as read
        </label>
      </div>

      <div className="modal-form-footer centered-button-row">
        <button type="button" className="btn btn-secondary btn-pill" onClick={onClose}>
          Close
        </button>
        <button type="submit" className="btn btn-primary btn-pill" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Update Contact'}
        </button>
      </div>
    </form>
  );
}

export default function ContactsAdminTable({ initialData }: { initialData: Contact[] }) {
  const [, startTransition] = useTransition();

 return (
  <AdminShell<Contact>
    title="Contacts"
    initialData={initialData}
    searchKeys={['name', 'email', 'subject', 'message', 'source']}
    exportFields={['id', 'name', 'email', 'phone', 'subject', 'source', 'read', 'created_at']}
    addLabel="Open Contact"
    stats={[
      { label: 'Total', value: (rows) => rows.length },
      { label: 'Unread', value: (rows) => rows.filter((r) => !r.read).length, tone: 'warning' },
      { label: 'Read', value: (rows) => rows.filter((r) => !!r.read).length, tone: 'success' },
    ]}
    columns={[
      { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone', mobileHidden: true, render: (r) => r.phone ?? '—' },
      { key: 'subject', label: 'Subject', render: (r) => r.subject ?? '—' },
      { key: 'source', label: 'Source', mobileHidden: true },
      {
        key: 'read',
        label: 'Status',
        render: (r) => (
          <span className={`badge ${r.read ? 'badge-success' : 'badge-muted'}`}>
            {r.read ? 'Read' : 'Unread'}
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
              await toggleContactReadAction(row.id, !row.read);
              window.location.reload();
            })
          }
          aria-label={row.read ? 'Mark unread' : 'Mark read'}
        >
          {row.read ? <MailOpen size={14} /> : <Mail size={14} />}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm danger"
          onClick={() =>
            startTransition(async () => {
              await deleteRowAction('contacts', row.id, ['/admin/contacts']);
              window.location.reload();
            })
          }
          aria-label="Delete contact"
        >
          <Trash2 size={14} />
        </button>
      </>
    )}
    renderForm={(item, onClose, onSaved) => <ContactForm item={item} onClose={onClose} onSaved={onSaved} />}
  />
);
}