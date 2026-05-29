'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { MailOpen, Mail, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
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
      <h2 className="modal-title">Contact Details</h2>

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
          <textarea rows={8} className="form-input" {...form.register('message')} />
        </div>

        <label className="check-row col-span-2">
          <input type="checkbox" {...form.register('read')} />
          Mark as read
        </label>
      </div>

      <div className="modal-form-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
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
      addLabel="View Contact"
      columns={[
        { key: 'name', label: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
        { key: 'email', label: 'Email' },
        { key: 'subject', label: 'Subject', render: (r) => r.subject || '—' },
        { key: 'source', label: 'Source' },
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
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <ContactForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}