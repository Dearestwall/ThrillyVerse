'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createBlogAction,
  updateBlogAction,
  toggleBlogPublishedAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Blog } from '@/types';
import { blogsBulkFields } from '@/lib/admin/bulkTemplates';

const schema = z.object({
  title: z.string().min(1, 'Required'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  cover_image: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  read_time: z.coerce.number().min(1).default(5),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

type FD = z.infer<typeof schema>;

function BlogForm({
  item,
  onClose,
  onSaved,
}: {
  item: Blog | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          slug: item.slug ?? '',
          excerpt: item.excerpt ?? '',
          content: item.content ?? '',
          cover_image: item.cover_image ?? '',
          category: item.category ?? '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
          read_time: item.read_time ?? 5,
          featured: !!item.featured,
          published: !!item.published,
        }
      : {
          title: '',
          slug: '',
          excerpt: '',
          content: '',
          cover_image: '',
          category: '',
          tags: '',
          read_time: 5,
          featured: false,
          published: false,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => fd.append(k, String(v ?? '')));
    if (data.featured) fd.set('featured', 'on');
    if (data.published) fd.set('published', 'on');

    try {
      if (item) await updateBlogAction(item.id, fd);
      else await createBlogAction(fd);
      toast.success(item ? 'Blog updated' : 'Blog created');
      onSaved();
    } catch (error: any) {
      toast.error(error.message || 'Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Blog' : 'New Blog'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...register('title')} />
          {errors.title && <p className="form-error">{errors.title.message}</p>}
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" {...register('slug')} />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input className="form-input" {...register('category')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Excerpt</label>
          <textarea rows={3} className="form-input" {...register('excerpt')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Content</label>
          <textarea rows={10} className="form-input" {...register('content')} />
        </div>

        <div className="form-group">
          <label className="form-label">Cover Image</label>
          <input className="form-input" {...register('cover_image')} />
        </div>

        <div className="form-group">
          <label className="form-label">Read Time</label>
          <input type="number" className="form-input" {...register('read_time')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Tags</label>
          <input className="form-input" {...register('tags')} />
        </div>

        <label className="check-row"><input type="checkbox" {...register('featured')} /> Featured</label>
        <label className="check-row"><input type="checkbox" {...register('published')} /> Published</label>
      </div>

      <div className="modal-form-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : item ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
    </form>
  );
}

export default function BlogsAdminTable({ initialData }: { initialData: Blog[] }) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, any>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([k, v]) => fd.append(k, String(v ?? '')));
      if (String(row.featured).toLowerCase() === 'true') fd.set('featured', 'on');
      if (String(row.published).toLowerCase() === 'true') fd.set('published', 'on');
      await createBlogAction(fd);
    }
  };

  return (
    <AdminShell<Blog>
      title="Blogs"
      initialData={initialData}
      searchKeys={['title', 'category', 'excerpt']}
      exportFields={['id', 'title', 'slug', 'category', 'read_time', 'cover_image', 'published']}
      onBulkUpload={bulkUpload}
      columns={[
        { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
        { key: 'category', label: 'Category' },
        { key: 'read_time', label: 'Read Time', render: (r) => `${r.read_time ?? 0} min` },
        { key: 'cover_image', label: 'Cover Image' },
        { key: 'excerpt',      label: 'Excerpt'  },
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
                await toggleBlogPublishedAction(row.id, !row.published);
                window.location.reload();
              })
            }
          >
            {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm danger"
            onClick={() =>
              startTransition(async () => {
                await deleteRowAction('blogs', row.id, ['/blogs', '/admin/blogs']);
                window.location.reload();
              })
            }
          >
            <Trash2 size={14} />
          </button>
        </>
      )}
       bulkTemplateFields={blogsBulkFields}
      renderForm={(item, onClose, onSaved) => <BlogForm item={item} onClose={onClose} onSaved={onSaved} />}
    />
  );
}