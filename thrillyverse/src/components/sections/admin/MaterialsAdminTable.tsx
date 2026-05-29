'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Star, Trash2, BookOpen } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createMaterialAction,
  updateMaterialAction,
  toggleMaterialPublishedAction,
  toggleMaterialFeaturedAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Board, Material, ResourceType } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  board: z.enum(['ICSE', 'CBSE', 'ISC', 'State', 'Other']),
  class_level: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  topic: z.string().optional(),
  description: z.string().optional(),
  cover_image: z.string().optional(),
  resource_type: z.enum(['notes', 'pdf', 'video', 'link', 'image', 'other']),
  resource_link: z.string().optional(),
  download_link: z.string().optional(),
  file_size: z.string().optional(),
  is_premium: z.boolean().default(false),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  view_count: z.coerce.number().default(0),
  sort_order: z.coerce.number().default(0),
});

type FD = z.infer<typeof schema>;

function MaterialForm({
  item,
  onClose,
  onSaved,
}: {
  item: Material | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          slug: item.slug ?? '',
          board: item.board ?? ('ICSE' as Board),
          class_level: item.class_level ?? '',
          subject: item.subject ?? '',
          topic: item.topic ?? '',
          description: item.description ?? '',
          cover_image: item.cover_image ?? '',
          resource_type: item.resource_type ?? ('pdf' as ResourceType),
          resource_link: item.resource_link ?? '',
          download_link: item.download_link ?? '',
          file_size: item.file_size ?? '',
          is_premium: !!item.is_premium,
          featured: !!item.featured,
          published: !!item.published,
          view_count: item.view_count ?? 0,
          sort_order: item.sort_order ?? 0,
        }
      : {
          title: '',
          slug: '',
          board: 'ICSE',
          class_level: '',
          subject: '',
          topic: '',
          description: '',
          cover_image: '',
          resource_type: 'pdf',
          resource_link: '',
          download_link: '',
          file_size: '',
          is_premium: false,
          featured: false,
          published: false,
          view_count: 0,
          sort_order: 0,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.is_premium) fd.set('is_premium', 'on');
    if (data.featured) fd.set('featured', 'on');
    if (data.published) fd.set('published', 'on');

    try {
      if (item) {
        await updateMaterialAction(item.id, fd);
        toast.success('Material updated');
      } else {
        await createMaterialAction(fd);
        toast.success('Material created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save material');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <div className="admin-form-header">
        <div className="logo-circle">
          <BookOpen size={18} />
        </div>
        <div>
          <h2 className="modal-title">{item ? 'Edit Material' : 'Add Material'}</h2>
          <p className="modal-subtitle">Manage notes, PDFs, videos, premium resources, and learning links.</p>
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
          <label className="form-label">Slug</label>
          <input className="form-input" {...form.register('slug')} />
        </div>

        <div className="form-group">
          <label className="form-label">Board</label>
          <select className="form-input" {...form.register('board')}>
            <option value="ICSE">ICSE</option>
            <option value="CBSE">CBSE</option>
            <option value="ISC">ISC</option>
            <option value="State">State</option>
            <option value="Other">Other</option>
          </select>
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
          <label className="form-label">Topic</label>
          <input className="form-input" {...form.register('topic')} />
        </div>

        <div className="form-group">
          <label className="form-label">Resource Type</label>
          <select className="form-input" {...form.register('resource_type')}>
            <option value="notes">Notes</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="link">Link</option>
            <option value="image">Image</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Description</label>
          <textarea rows={4} className="form-input" {...form.register('description')} />
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image</label>
          <input className="form-input" {...form.register('cover_image')} />
        </div>

        <div className="form-group">
          <label className="form-label">Resource Link</label>
          <input className="form-input" {...form.register('resource_link')} />
        </div>

        <div className="form-group">
          <label className="form-label">Download Link</label>
          <input className="form-input" {...form.register('download_link')} />
        </div>

        <div className="form-group">
          <label className="form-label">File Size</label>
          <input className="form-input" {...form.register('file_size')} />
        </div>

        <div className="form-group">
          <label className="form-label">Views</label>
          <input type="number" className="form-input" {...form.register('view_count')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <label className="check-row">
          <input type="checkbox" {...form.register('is_premium')} />
          Premium
        </label>

        <label className="check-row">
          <input type="checkbox" {...form.register('featured')} />
          Featured
        </label>

        <label className="check-row col-span-2">
          <input type="checkbox" {...form.register('published')} />
          Published
        </label>
      </div>

      <div className="modal-form-footer centered-button-row">
        <button type="button" className="btn btn-secondary btn-pill" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-pill" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}

export default function MaterialsAdminTable({ initialData }: { initialData: Material[] }) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.is_premium).toLowerCase() === 'true') fd.set('is_premium', 'on');
      if (String(row.featured).toLowerCase() === 'true') fd.set('featured', 'on');
      if (String(row.published).toLowerCase() === 'true') fd.set('published', 'on');
      await createMaterialAction(fd);
    }
  };

  return (
  <AdminShell<Material>
  title="Materials"
  initialData={initialData}
  searchKeys={['title', 'board', 'class_level', 'subject', 'topic']}
  exportFields={[
    'id',
    'title',
    'board',
    'class_level',
    'subject',
    'resource_type',
    'featured',
    'published',
    'sort_order',
  ]}
  onBulkUpload={bulkUpload}
  addLabel="Add Material"
  stats={[
    { label: 'Total', value: (rows) => rows.length },
    { label: 'Published', value: (rows) => rows.filter((r) => !!r.published).length, tone: 'success' },
    { label: 'Featured', value: (rows) => rows.filter((r) => !!r.featured).length, tone: 'warning' },
  ]}
  columns={[
    { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'board', label: 'Board' },
    { key: 'subject', label: 'Subject' },
    { key: 'resource_type', label: 'Type', mobileHidden: true },
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
                await toggleMaterialPublishedAction(row.id, !row.published);
                window.location.reload();
              })
            }
            aria-label={row.published ? 'Unpublish material' : 'Publish material'}
          >
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>

          <button
            type="button"
            className={`btn btn-ghost btn-sm ${row.featured ? 'text-yellow-500' : ''}`}
            onClick={() =>
              startTransition(async () => {
                await toggleMaterialFeaturedAction(row.id, !row.featured);
                window.location.reload();
              })
            }
            aria-label={row.featured ? 'Remove featured' : 'Mark featured'}
          >
            <Star size={14} />
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('materials', row.id, ['/materials', '/admin/materials']);
                window.location.reload();
              })
            }
            aria-label="Delete material"
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
      renderForm={(item, onClose, onSaved) => (
        <MaterialForm item={item} onClose={onClose} onSaved={onSaved} />
      )}
    />
  );
}