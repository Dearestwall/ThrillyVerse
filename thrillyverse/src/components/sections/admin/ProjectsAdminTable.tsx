'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import { createProjectAction, updateProjectAction, deleteRowAction } from '@/app/actions/admin';
import type { Project } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  tech_stack: z.string().optional(),
  link: z.string().optional(),
  github_url: z.string().optional(),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
  status: z.enum(['published', 'draft', 'archived']).default('draft'),
});

type FD = z.infer<typeof schema>;

function ProjectForm({
  item,
  onClose,
  onSaved,
}: {
  item: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          slug: item.slug ?? '',
          summary: item.summary ?? '',
          description: item.description ?? '',
          image_url: item.image_url ?? '',
          tech_stack: Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : '',
          link: item.link ?? '',
          github_url: item.github_url ?? '',
          featured: !!item.featured,
          sort_order: item.sort_order ?? 0,
          status: (item.status ?? 'draft') as 'published' | 'draft' | 'archived',
        }
      : {
          title: '',
          slug: '',
          summary: '',
          description: '',
          image_url: '',
          tech_stack: '',
          link: '',
          github_url: '',
          featured: false,
          sort_order: 0,
          status: 'draft',
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.featured) fd.set('featured', 'on');

    try {
      if (item) {
        await updateProjectAction(item.id, fd);
        toast.success('Project updated');
      } else {
        await createProjectAction(fd);
        toast.success('Project created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Project' : 'New Project'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...form.register('title')} />
          {form.formState.errors.title && (
            <p className="form-error">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" {...form.register('slug')} />
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input" {...form.register('status')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Summary</label>
          <input className="form-input" {...form.register('summary')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Description</label>
          <textarea rows={5} className="form-input" {...form.register('description')} />
        </div>

        <div className="form-group">
          <label className="form-label">Image URL</label>
          <input className="form-input" {...form.register('image_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Tech Stack</label>
          <input className="form-input" {...form.register('tech_stack')} />
        </div>

        <div className="form-group">
          <label className="form-label">Live Link</label>
          <input className="form-input" {...form.register('link')} />
        </div>

        <div className="form-group">
          <label className="form-label">GitHub URL</label>
          <input className="form-input" {...form.register('github_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <label className="check-row">
          <input type="checkbox" {...form.register('featured')} />
          Featured
        </label>
      </div>

      <div className="modal-form-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? 'Saving...'
            : item
              ? 'Update Project'
              : 'Create Project'}
        </button>
      </div>
    </form>
  );
}

export default function ProjectsAdminTable({
  initialData,
}: {
  initialData: Project[];
}) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.featured).toLowerCase() === 'true') fd.set('featured', 'on');
      await createProjectAction(fd);
    }
  };

  return (
    <AdminShell<Project>
      title="Projects"
      initialData={initialData}
      searchKeys={['title', 'summary', 'status']}
      exportFields={['id', 'title', 'slug', 'status', 'featured', 'sort_order']}
      onBulkUpload={bulkUpload}
      columns={[
        {
          key: 'title',
          label: 'Title',
          render: (r) => <span className="font-medium">{r.title}</span>,
        },
        {
          key: 'tech_stack',
          label: 'Stack',
          render: (r) =>
            Array.isArray(r.tech_stack) && r.tech_stack.length ? r.tech_stack.join(', ') : '—',
        },
        { key: 'status', label: 'Status' },
        {
          key: 'featured',
          label: 'Featured',
          render: (r) => (
            <span className={`badge ${r.featured ? 'badge-success' : 'badge-muted'}`}>
              {r.featured ? 'Yes' : 'No'}
            </span>
          ),
        },
        { key: 'sort_order', label: 'Order' },
      ]}
      extraActions={(row) => (
        <button
          type="button"
          className="btn btn-ghost btn-sm danger"
          onClick={() =>
            startTransition(async () => {
              await deleteRowAction('projects', row.id, ['/', '/admin/projects']);
              window.location.reload();
            })
          }
          aria-label="Delete project"
        >
          <Trash2 size={14} />
        </button>
      )}
      renderForm={(item, onClose, onSaved) => (
        <ProjectForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}