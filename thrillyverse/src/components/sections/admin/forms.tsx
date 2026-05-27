'use client';

import {
  createAnnouncementAction,
  createBlogAction,
  createCertificationAction,
  createMaterialAction,
  createMovieAction,
  createNotificationAction,
  createPartnerAction,
  createProjectAction,
  createQuizAction,
  createReviewAction,
} from '@/app/actions/admin';
import { useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

function FormCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card p-5 md:p-6 space-y-4">
      <div className="space-y-1">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function PreviewImage({ url, label }: { url: string; label?: string }) {
  if (!url) return null;
  return (
    <div className="rounded-2xl overflow-hidden border border-divider bg-black/20">
      {label && <div className="px-3 py-2 text-xs text-text-muted border-b border-divider">{label}</div>}
      <img
        src={url}
        alt={label ?? 'Preview'}
        className="w-full h-52 object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

function useSmartFormSubmit(action: (fd: FormData) => Promise<void>, successMsg: string) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    startTransition(async () => {
      try {
        await action(fd);
        toast.success(successMsg);
        form.reset();
      } catch (err: any) {
        toast.error(err?.message ?? 'Something went wrong');
      }
    });
  };

  return { pending, onSubmit };
}

export function CreateProjectForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createProjectAction, 'Project created!');
  const [imageUrl, setImageUrl] = useState('');

  return (
    <FormCard title="Create Project" subtitle="Add a new project with live link, GitHub, and stack details.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Project title" className="form-input" required />
        <input name="summary" placeholder="Summary" className="form-input" />
        <input
          name="image_url"
          placeholder="Image URL"
          className="form-input"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input name="link" placeholder="Live link" className="form-input" />
        <input name="github_url" placeholder="GitHub URL" className="form-input" />
        <input name="tech_stack" placeholder="Next.js, Supabase, Tailwind" className="form-input" />
        <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />

        <div className="md:col-span-2">
          <PreviewImage url={imageUrl} label="Image preview" />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateMovieForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createMovieAction, 'Movie created!');
  const [poster, setPoster] = useState('');

  return (
    <FormCard title="Create Movie" subtitle="Create a movie entry with links, tags, and publish flags.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Movie title" className="form-input" required />
        <input name="category" placeholder="Category" className="form-input" />
        <input
          name="poster_url"
          placeholder="Poster URL"
          className="form-input"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
        />
        <input name="movie_link" placeholder="Watch link" className="form-input" />
        <input name="download_link" placeholder="Download link" className="form-input" />
        <input name="trailer_url" placeholder="Trailer URL" className="form-input" />
        <input name="year" placeholder="Year" className="form-input" />
        <input name="rating" placeholder="Rating" className="form-input" />
        <input name="language" placeholder="Language" className="form-input" />
        <input name="duration" placeholder="Duration" className="form-input" />
        <input name="tags" placeholder="Action, Thriller" className="form-input md:col-span-2" />
        <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />

        <div className="md:col-span-2">
          <PreviewImage url={poster} label="Poster preview" />
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" />
          Published
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Movie'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateMaterialForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createMaterialAction, 'Material created!');
  const [cover, setCover] = useState('');

  return (
    <FormCard title="Create Material" subtitle="Add notes, PDFs, videos, links, or images.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Material title" className="form-input" required />
        <select name="board" className="form-input">
          <option>ICSE</option>
          <option>CBSE</option>
          <option>ISC</option>
          <option>State</option>
          <option>Other</option>
        </select>
        <input name="class_level" placeholder="Class" className="form-input" required />
        <input name="subject" placeholder="Subject" className="form-input" required />
        <input name="topic" placeholder="Topic" className="form-input" />
        <input
          name="cover_image"
          placeholder="Cover image URL"
          className="form-input"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        <select name="resource_type" className="form-input">
          <option>notes</option>
          <option>pdf</option>
          <option>video</option>
          <option>link</option>
          <option>image</option>
          <option>other</option>
        </select>
        <input name="resource_link" placeholder="Resource link" className="form-input" />
        <input name="download_link" placeholder="Download link" className="form-input" />
        <input name="file_size" placeholder="File size" className="form-input" />
        <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />

        <div className="md:col-span-2">
          <PreviewImage url={cover} label="Cover preview" />
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_premium" />
          Premium
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" />
          Published
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Material'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateBlogForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createBlogAction, 'Blog created!');
  const [cover, setCover] = useState('');

  return (
    <FormCard title="Create Blog" subtitle="Write a blog with featured and published flags.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Blog title" className="form-input" required />
        <input name="category" placeholder="Category" className="form-input" />
        <input
          name="cover_image"
          placeholder="Cover image URL"
          className="form-input"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
        />
        <input name="tags" placeholder="Tag1, Tag2" className="form-input" />
        <input name="read_time" placeholder="Read time" className="form-input" />
        <input name="excerpt" placeholder="Excerpt" className="form-input md:col-span-2" />
        <textarea name="content" placeholder="Full content" className="form-input min-h-40 md:col-span-2" />

        <div className="md:col-span-2">
          <PreviewImage url={cover} label="Cover preview" />
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" />
          Published
        </label>

        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateAnnouncementForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createAnnouncementAction, 'Announcement created!');

  return (
    <FormCard title="Create Announcement" subtitle="Announcements can be active or inactive.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Announcement title" className="form-input md:col-span-2" required />
        <input name="badge" placeholder="Badge" className="form-input" />
        <input name="priority" placeholder="Priority" className="form-input" />
        <input name="cta_label" placeholder="CTA label" className="form-input" />
        <input name="cta_url" placeholder="CTA URL" className="form-input" />
        <textarea name="body" placeholder="Announcement body" className="form-input min-h-32 md:col-span-2" />
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="active" defaultChecked />
          Active
        </label>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Announcement'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateNotificationForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createNotificationAction, 'Notification created!');

  return (
    <FormCard title="Create Notification" subtitle="Send notifications by audience and type.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Notification title" className="form-input" required />
        <select name="type" className="form-input">
          <option>info</option>
          <option>success</option>
          <option>warning</option>
          <option>alert</option>
          <option>new_material</option>
          <option>new_movie</option>
          <option>new_blog</option>
          <option>quiz</option>
        </select>
        <select name="audience" className="form-input">
          <option>all</option>
          <option>students</option>
          <option>viewers</option>
        </select>
        <input name="target_url" placeholder="Target URL" className="form-input" />
        <textarea name="message" placeholder="Message" className="form-input min-h-32 md:col-span-2" required />
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="is_active" defaultChecked />
          Active
        </label>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Notification'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateQuizForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createQuizAction, 'Quiz created!');

  return (
    <FormCard title="Create Quiz" subtitle="Add a quiz with board, class, difficulty and duration.">
      <form onSubmit={onSubmit} className="admin-form-grid">
        <input name="title" placeholder="Quiz title" className="form-input" required />
        <input name="board" placeholder="Board" className="form-input" />
        <input name="class_level" placeholder="Class" className="form-input" />
        <input name="subject" placeholder="Subject" className="form-input" />
        <input name="time_limit" placeholder="Time limit" className="form-input" />
        <select name="difficulty" className="form-input">
          <option>easy</option>
          <option>medium</option>
          <option>hard</option>
        </select>
        <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="published" />
          Published
        </label>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Creating...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreatePartnerForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createPartnerAction, 'Partner added!');
  const [emoji, setEmoji] = useState('🤝');
  const [logoUrl, setLogoUrl] = useState('');

  const preview = useMemo(() => logoUrl.trim(), [logoUrl]);

  return (
    <FormCard title="Create Partner" subtitle="Add partners with logo, website and visibility control.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Google for Education" />
          </div>
          <div>
            <label className="form-label">Emoji / Icon</label>
            <input
              name="emoji"
              className="form-input"
              placeholder="🤝"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Logo URL</label>
            <input
              name="logo_url"
              type="url"
              className="form-input"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Website URL</label>
            <input name="website_url" type="url" className="form-input" placeholder="https://partner.com" />
          </div>
          <div>
            <label className="form-label">Sort Order</label>
            <input name="sort_order" type="number" className="form-input" defaultValue={0} />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input name="active" type="checkbox" id="partner-active" defaultChecked />
            <label htmlFor="partner-active" className="form-label mb-0 cursor-pointer">
              Active (visible on homepage)
            </label>
          </div>
        </div>

        <PreviewImage url={preview} label="Logo preview" />

        <div className="centered-button-row flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? 'Adding...' : 'Add Partner'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateReviewForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createReviewAction, 'Review added!');
  const [emoji, setEmoji] = useState('👤');
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <FormCard title="Create Review" subtitle="Add testimonials with rating and featured flags.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Name *</label>
            <input name="name" required className="form-input" placeholder="Priya S." />
          </div>
          <div>
            <label className="form-label">Role / Description</label>
            <input name="role" className="form-input" placeholder="Class 12, CBSE" />
          </div>
          <div>
            <label className="form-label">Emoji Avatar</label>
            <input
              name="emoji"
              className="form-input"
              placeholder="👩‍🎓"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Avatar URL (optional)</label>
            <input
              name="avatar_url"
              type="url"
              className="form-input"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">Rating (1–5)</label>
            <select name="rating" className="form-input">
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </div>
          <div>
            <label className="form-label">Sort Order</label>
            <input name="sort_order" type="number" className="form-input" defaultValue={0} />
          </div>
        </div>

        <PreviewImage url={avatarUrl} label="Avatar preview" />

        <div>
          <label className="form-label">Review Text *</label>
          <textarea name="text" required rows={3} className="form-input" placeholder="Write the testimonial here..." />
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input name="published" type="checkbox" id="review-published" />
            <span className="form-label mb-0 cursor-pointer">Published</span>
          </label>
          <label className="flex items-center gap-2">
            <input name="featured" type="checkbox" id="review-featured" />
            <span className="form-label mb-0 cursor-pointer">Featured</span>
          </label>
        </div>

        <div className="centered-button-row flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? 'Adding...' : 'Add Review'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateCertificationForm() {
  const { pending, onSubmit } = useSmartFormSubmit(createCertificationAction, 'Certification added!');

  return (
    <FormCard title="Create Certification" subtitle="Add certifications with gradient branding.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="admin-form-grid">
          <div>
            <label className="form-label">Title *</label>
            <input name="title" required className="form-input" placeholder="ISO 27001" />
          </div>
          <div>
            <label className="form-label">Subtitle</label>
            <input name="subtitle" className="form-input" placeholder="Information Security" />
          </div>
          <div>
            <label className="form-label">Emoji / Icon</label>
            <input name="emoji" className="form-input" placeholder="🏅" />
          </div>
          <div>
            <label className="form-label">Sort Order</label>
            <input name="sort_order" type="number" className="form-input" defaultValue={0} />
          </div>
          <div>
            <label className="form-label">Gradient From</label>
            <input name="color_from" type="color" className="form-input h-11 p-1" defaultValue="#7c3aed" />
          </div>
          <div>
            <label className="form-label">Gradient To</label>
            <input name="color_to" type="color" className="form-input h-11 p-1" defaultValue="#06b6d4" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input name="active" type="checkbox" id="cert-active" defaultChecked />
          <label htmlFor="cert-active" className="form-label mb-0 cursor-pointer">
            Active (visible on homepage)
          </label>
        </div>

        <div className="centered-button-row flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary">
            {pending ? 'Adding...' : 'Add Certification'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}