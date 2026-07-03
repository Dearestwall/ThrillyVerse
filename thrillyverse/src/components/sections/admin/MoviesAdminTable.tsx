'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, Star, Trash2 } from 'lucide-react';
import { AdminShell } from './AdminShell';
import {
  createMovieAction,
  updateMovieAction,
  toggleMoviePublishedAction,
  toggleMovieFeaturedAction,
  deleteRowAction,
} from '@/app/actions/admin';
import type { Movie } from '@/types';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
  poster_url: z.string().optional(),
  trailer_url: z.string().optional(),
  movie_link: z.string().optional(),
  download_link: z.string().optional(),
  category: z.string().optional(),
  year: z.coerce.number().nullable().optional(),
  rating: z.string().optional(),
  tags: z.string().optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

type FD = z.infer<typeof schema>;

function MovieForm({
  item,
  onClose,
  onSaved,
}: {
  item: Movie | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const form = useForm<FD>({
    resolver: zodResolver(schema),
    defaultValues: item
      ? {
          title: item.title ?? '',
          slug: item.slug ?? '',
          description: item.description ?? '',
          poster_url: item.poster_url ?? '',
          trailer_url: item.trailer_url ?? '',
          movie_link: item.movie_link ?? '',
          download_link: item.download_link ?? '',
          category: item.category ?? '',
          year: item.year ?? null,
          rating: item.rating ?? '',
          tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
          featured: !!item.featured,
          published: !!item.published,
          sort_order: item.sort_order ?? 0,
        }
      : {
          title: '',
          slug: '',
          description: '',
          poster_url: '',
          trailer_url: '',
          movie_link: '',
          download_link: '',
          category: '',
          year: null,
          rating: '',
          tags: '',
          featured: false,
          published: false,
          sort_order: 0,
        },
  });

  const onSubmit = async (data: FD) => {
    const fd = new FormData();
    Object.entries(data).forEach(([key, value]) => fd.append(key, String(value ?? '')));
    if (data.featured) fd.set('featured', 'on');
    if (data.published) fd.set('published', 'on');

    try {
      if (item) {
        await updateMovieAction(item.id, fd);
        toast.success('Movie updated');
      } else {
        await createMovieAction(fd);
        toast.success('Movie created');
      }
      onSaved();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save movie');
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="admin-form">
      <h2 className="modal-title">{item ? 'Edit Movie' : 'Add Movie'}</h2>

      <div className="form-grid-2">
        <div className="form-group col-span-2">
          <label className="form-label">Title</label>
          <input className="form-input" {...form.register('title')} />
        </div>

        <div className="form-group">
          <label className="form-label">Slug</label>
          <input className="form-input" {...form.register('slug')} />
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <input className="form-input" {...form.register('category')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Description</label>
          <textarea rows={5} className="form-input" {...form.register('description')} />
        </div>

        <div className="form-group">
          <label className="form-label">Poster URL</label>
          <input className="form-input" {...form.register('poster_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Trailer URL</label>
          <input className="form-input" {...form.register('trailer_url')} />
        </div>

        <div className="form-group">
          <label className="form-label">Movie Link</label>
          <input className="form-input" {...form.register('movie_link')} />
        </div>

        <div className="form-group">
          <label className="form-label">Download Link</label>
          <input className="form-input" {...form.register('download_link')} />
        </div>

        <div className="form-group">
          <label className="form-label">Year</label>
          <input type="number" className="form-input" {...form.register('year')} />
        </div>

        <div className="form-group">
          <label className="form-label">Rating</label>
          <input className="form-input" {...form.register('rating')} />
        </div>

        <div className="form-group col-span-2">
          <label className="form-label">Tags</label>
          <input className="form-input" {...form.register('tags')} />
        </div>

        <div className="form-group">
          <label className="form-label">Sort Order</label>
          <input type="number" className="form-input" {...form.register('sort_order')} />
        </div>

        <label className="check-row">
          <input type="checkbox" {...form.register('featured')} />
          Featured
        </label>

        <label className="check-row">
          <input type="checkbox" {...form.register('published')} />
          Published
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

export default function MoviesAdminTable({ initialData }: { initialData: Movie[] }) {
  const [, startTransition] = useTransition();

  const bulkUpload = async (rows: Record<string, string>[]) => {
    for (const row of rows) {
      const fd = new FormData();
      Object.entries(row).forEach(([key, value]) => fd.append(key, String(value ?? '')));
      if (String(row.featured).toLowerCase() === 'true') fd.set('featured', 'on');
      if (String(row.published).toLowerCase() === 'true') fd.set('published', 'on');
      await createMovieAction(fd);
    }
  };

 return (
  <AdminShell<Movie>
    title="Movies"
    initialData={initialData}
    searchKeys={['title', 'category', 'rating']}
    exportFields={[
      'id', 'title', 'slug', 'category', 'year', 'rating',
      'language', 'featured', 'published', 'sort_order',
    ]}
    onBulkUpload={bulkUpload}
    stats={[
      { label: 'Total', value: (rows) => rows.length },
      { label: 'Published', value: (rows) => rows.filter((r) => !!r.published).length, tone: 'success' },
      { label: 'Featured', value: (rows) => rows.filter((r) => !!r.featured).length, tone: 'warning' },
    ]}
    columns={[
      { key: 'title', label: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
      { key: 'slug', label: 'Slug', mobileHidden: true },
      { key: 'category', label: 'Category' },
      { key: 'year', label: 'Year', render: (r) => r.year ?? '—', mobileHidden: true },
      { key: 'rating', label: 'Rating', mobileHidden: true },
      { key: 'tags', label: 'Genre', mobileHidden: true, render: (r) => Array.isArray(r.tags) ? r.tags.join(', ') : (r.tags ?? '—') },
      { key: 'sort_order', label: 'Order', mobileHidden: true, render: (r) => r.sort_order ?? 0 },
      {
        key: 'featured',
        label: 'Featured',
        mobileHidden: true,
        render: (r) => (
          <span className={`badge ${r.featured ? 'badge-success' : 'badge-muted'}`}>
            {r.featured ? 'Yes' : 'No'}
          </span>
        ),
      },
      {
        key: 'published',
        label: 'Status',
        render: (r) => (
          <span className={`badge ${r.published ? 'badge-success' : 'badge-muted'}`}>
            {r.published ? 'Published' : 'Draft'}
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
              await toggleMoviePublishedAction(row.id, !row.published);
              window.location.reload();
            })
          }
          aria-label={row.published ? 'Unpublish movie' : 'Publish movie'}
        >
          {row.published ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          type="button"
          className={`btn btn-ghost btn-sm ${row.featured ? 'text-yellow-500' : ''}`}
          onClick={() =>
            startTransition(async () => {
              await toggleMovieFeaturedAction(row.id, !row.featured);
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
              await deleteRowAction('movies', row.id, ['/movies', '/admin/movies']);
              window.location.reload();
            })
          }
          aria-label="Delete movie"
        >
          <Trash2 size={14} />
        </button>
      </>
    )}
    renderForm={(item, onClose, onSaved) => <MovieForm item={item} onClose={onClose} onSaved={onSaved} />}
  />
);
}