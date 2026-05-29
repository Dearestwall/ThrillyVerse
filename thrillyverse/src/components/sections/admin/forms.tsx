'use client';

import { useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
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
    <div className="admin-card p-5 md:p-6 space-y-5 border border-divider/70 bg-surface/90 shadow-2xl rounded-3xl">
      <div className="space-y-1">
        <h3 className="text-lg md:text-xl font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-sm text-text-muted max-w-2xl">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="form-label mb-1.5 block">{children}</label>;
}

function PreviewImage({ url, label }: { url: string; label?: string }) {
  if (!url?.trim()) return null;

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

function HelpText({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-xs text-text-muted">{children}</p>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
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

function ToggleRow({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-divider/80 bg-black/10 px-3 py-2.5">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span className="text-sm text-white">{label}</span>
    </label>
  );
}

function SelectField({
  name,
  label,
  defaultValue,
  options,
  help,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: string[];
  help?: string;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <select name={name} className="form-input" defaultValue={defaultValue ?? options[0]}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {help && <HelpText>{help}</HelpText>}
    </div>
  );
}

function InputField({
  name,
  label,
  placeholder,
  type = 'text',
  defaultValue,
  required,
  help,
}: {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  help?: string;
}) {
  return (
    <div>
      <FieldLabel>
        {label}
        {required ? ' *' : ''}
      </FieldLabel>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue as any}
        placeholder={placeholder}
        className="form-input"
        required={required}
      />
      {help && <HelpText>{help}</HelpText>}
    </div>
  );
}

function TextAreaField({
  name,
  label,
  placeholder,
  defaultValue,
  rows = 4,
  required,
  help,
}: {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
  required?: boolean;
  help?: string;
}) {
  return (
    <div className="md:col-span-2">
      <FieldLabel>
        {label}
        {required ? ' *' : ''}
      </FieldLabel>
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="form-input min-h-32"
        required={required}
      />
      {help && <HelpText>{help}</HelpText>}
    </div>
  );
}

function submitButton(pending: boolean, label: string) {
  return (
    <div className="md:col-span-2 flex justify-end pt-2">
      <button type="submit" className="btn btn-primary min-w-[160px]" disabled={pending}>
        {pending ? 'Saving...' : label}
      </button>
    </div>
  );
}

function parseCommaList(v: unknown) {
  if (!v) return '';
  if (Array.isArray(v)) return v.join(', ');
  return String(v);
}

export function CreateProjectForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createProjectAction, 'Project created!');
  const [imageUrl, setImageUrl] = useState('');

  return (
    <FormCard title="Create Project" subtitle="Add a new project with live link, GitHub, and stack details.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Project title" placeholder="Project title" required />
        <InputField name="slug" label="Slug" placeholder="project-slug" />
        <TextAreaField name="summary" label="Summary" placeholder="Short summary" rows={3} />
        <InputField name="image_url" label="Image URL" placeholder="https://..." defaultValue="" />
        <InputField name="link" label="Live link" placeholder="https://..." />
        <InputField name="github_url" label="GitHub URL" placeholder="https://github.com/..." />
        <InputField name="sort_order" label="Sort Order" type="number" defaultValue={0} />
        <InputField
          name="tech_stack"
          label="Tech Stack"
          placeholder="Next.js, Supabase, Tailwind"
          help="Comma-separated stack items are best."
        />
        <SelectField
          name="status"
          label="Status"
          options={['draft', 'published', 'archived']}
          help="Projects use status instead of published."
        />
        <TextAreaField name="description" label="Description" placeholder="Detailed description" rows={6} />

        <div className="md:col-span-2 space-y-3">
          <FieldLabel>Image preview</FieldLabel>
          <PreviewImage url={imageUrl} label="Project image preview" />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="featured" label="Featured" />
        </div>

        {submitButton(pending, 'Create Project')}
      </form>
    </FormCard>
  );
}

export function CreateMovieForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createMovieAction, 'Movie created!');
  const [poster, setPoster] = useState('');

  return (
    <FormCard title="Create Movie" subtitle="Create a movie entry with links, tags, and publish flags.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Movie title" placeholder="Movie title" required />
        <InputField name="slug" label="Slug" placeholder="movie-slug" />
        <InputField name="category" label="Category" placeholder="Action" />
        <InputField name="poster_url" label="Poster URL" placeholder="https://..." />
        <InputField name="movie_link" label="Watch link" placeholder="https://..." />
        <InputField name="download_link" label="Download link" placeholder="https://..." />
        <InputField name="trailer_url" label="Trailer URL" placeholder="https://..." />
        <InputField name="year" label="Year" type="number" />
        <InputField name="rating" label="Rating" placeholder="8.5" />
        <InputField name="language" label="Language" placeholder="Hindi" />
        <InputField name="duration" label="Duration" placeholder="2h 10m" />
        <InputField name="tags" label="Tags" placeholder="Action, Thriller" help="Comma-separated tags." />
        <TextAreaField name="description" label="Description" placeholder="Movie description" rows={5} />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="featured" label="Featured" />
          <ToggleRow name="published" label="Published" />
        </div>

        <div className="md:col-span-2 space-y-3">
          <FieldLabel>Poster preview</FieldLabel>
          <PreviewImage url={poster} label="Poster preview" />
        </div>

        {submitButton(pending, 'Create Movie')}
      </form>
    </FormCard>
  );
}

export function CreateMaterialForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createMaterialAction, 'Material created!');

  return (
    <FormCard title="Create Material" subtitle="Add notes, PDFs, videos, links, or images.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Material title" placeholder="Material title" required />
        <SelectField name="board" label="Board" options={['ICSE', 'CBSE', 'ISC', 'State', 'Other']} />
        <InputField name="class_level" label="Class" placeholder="10" required />
        <InputField name="subject" label="Subject" placeholder="Maths" required />
        <InputField name="topic" label="Topic" placeholder="Algebra" />
        <InputField name="cover_image" label="Cover image URL" placeholder="https://..." />
        <SelectField name="resource_type" label="Resource type" options={['notes', 'pdf', 'video', 'link', 'image', 'other']} />
        <InputField name="resource_link" label="Resource link" placeholder="https://..." />
        <InputField name="download_link" label="Download link" placeholder="https://..." />
        <InputField name="file_size" label="File size" placeholder="12 MB" />
        <TextAreaField name="description" label="Description" placeholder="Describe the material" rows={5} />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="is_premium" label="Premium" />
          <ToggleRow name="featured" label="Featured" />
          <ToggleRow name="published" label="Published" />
        </div>

        {submitButton(pending, 'Create Material')}
      </form>
    </FormCard>
  );
}

export function CreateBlogForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createBlogAction, 'Blog created!');

  return (
    <FormCard title="Create Blog" subtitle="Write a blog with featured and published flags.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Blog title" placeholder="Blog title" required />
        <InputField name="slug" label="Slug" placeholder="blog-slug" />
        <InputField name="category" label="Category" placeholder="News" />
        <InputField name="cover_image" label="Cover image URL" placeholder="https://..." />
        <InputField name="tags" label="Tags" placeholder="Tag1, Tag2" />
        <InputField name="read_time" label="Read time" placeholder="5 min" />
        <TextAreaField name="excerpt" label="Excerpt" placeholder="Short excerpt" rows={3} />
        <TextAreaField name="content" label="Full content" placeholder="Full article content" rows={8} />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="featured" label="Featured" />
          <ToggleRow name="published" label="Published" />
        </div>

        {submitButton(pending, 'Create Blog')}
      </form>
    </FormCard>
  );
}

export function CreateAnnouncementForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createAnnouncementAction, 'Announcement created!');

  return (
    <FormCard title="Create Announcement" subtitle="Announcements can be active or inactive.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Announcement title" placeholder="Important update" required />
        <InputField name="badge" label="Badge" placeholder="New" />
        <InputField name="priority" label="Priority" type="number" defaultValue={0} />
        <InputField name="cta_label" label="CTA label" placeholder="Read more" />
        <InputField name="cta_url" label="CTA URL" placeholder="https://..." />
        <TextAreaField name="body" label="Body" placeholder="Announcement body" rows={5} />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="active" label="Active" defaultChecked />
        </div>

        {submitButton(pending, 'Create Announcement')}
      </form>
    </FormCard>
  );
}

export function CreateNotificationForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createNotificationAction, 'Notification created!');

  return (
    <FormCard title="Create Notification" subtitle="Send notifications by audience and type.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Notification title" placeholder="New quiz available" required />
        <SelectField
          name="type"
          label="Type"
          options={['info', 'success', 'warning', 'alert', 'new_material', 'new_movie', 'new_blog', 'quiz']}
        />
        <SelectField name="audience" label="Audience" options={['all', 'students', 'viewers']} />
        <InputField name="target_url" label="Target URL" placeholder="https://..." />
        <TextAreaField name="message" label="Message" placeholder="Notification message" rows={5} required />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="is_active" label="Active" defaultChecked />
        </div>

        {submitButton(pending, 'Create Notification')}
      </form>
    </FormCard>
  );
}

export function CreateQuizForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createQuizAction, 'Quiz created!');

  return (
    <FormCard title="Create Quiz" subtitle="Add a quiz with board, class, difficulty and duration.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="admin-form-grid"
      >
        <InputField name="title" label="Quiz title" placeholder="Quiz title" required />
        <InputField name="slug" label="Slug" placeholder="quiz-slug" />
        <InputField name="board" label="Board" placeholder="ICSE" />
        <InputField name="class_level" label="Class" placeholder="10" />
        <InputField name="subject" label="Subject" placeholder="Maths" />
        <InputField name="time_limit" label="Time limit" placeholder="30" />
        <SelectField name="difficulty" label="Difficulty" options={['easy', 'medium', 'hard']} />
        <TextAreaField name="description" label="Description" placeholder="Quiz description" rows={4} />

        <div className="md:col-span-2 flex flex-wrap gap-3">
          <ToggleRow name="published" label="Published" />
        </div>

        {submitButton(pending, 'Create Quiz')}
      </form>
    </FormCard>
  );
}

export function CreatePartnerForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createPartnerAction, 'Partner added!');
  const [logoUrl, setLogoUrl] = useState('');

  return (
    <FormCard title="Create Partner" subtitle="Add partners with logo, website and visibility control.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="space-y-4"
      >
        <div className="admin-form-grid">
          <InputField name="name" label="Name" placeholder="Google for Education" required />
          <InputField name="emoji" label="Emoji / Icon" placeholder="🤝" defaultValue="🤝" />
          <InputField name="logo_url" label="Logo URL" placeholder="https://..." />
          <InputField name="website_url" label="Website URL" placeholder="https://partner.com" />
          <InputField name="sort_order" label="Sort Order" type="number" defaultValue={0} />
        </div>

        <div className="md:col-span-2 flex items-center gap-3 rounded-xl border border-divider/80 bg-black/10 px-3 py-2.5">
          <input name="active" type="checkbox" id="partner-active" defaultChecked />
          <label htmlFor="partner-active" className="text-sm text-white cursor-pointer">
            Active (visible on homepage)
          </label>
        </div>

        <PreviewImage url={logoUrl} label="Logo preview" />

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary min-w-[160px]">
            {pending ? 'Adding...' : 'Add Partner'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateReviewForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createReviewAction, 'Review added!');
  const [avatarUrl, setAvatarUrl] = useState('');

  return (
    <FormCard title="Create Review" subtitle="Add testimonials with rating and featured flags.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="space-y-4"
      >
        <div className="admin-form-grid">
          <InputField name="name" label="Name" placeholder="Priya S." required />
          <InputField name="role" label="Role / Description" placeholder="Class 12, CBSE" />
          <InputField name="emoji" label="Emoji Avatar" placeholder="👩‍🎓" defaultValue="👤" />
          <InputField name="avatar_url" label="Avatar URL" placeholder="https://..." />
          <InputField name="rating" label="Rating (1–5)" type="number" defaultValue={5} />
          <InputField name="sort_order" label="Sort Order" type="number" defaultValue={0} />
        </div>

        <PreviewImage url={avatarUrl} label="Avatar preview" />

        <TextAreaField name="text" label="Review Text" placeholder="Write the testimonial here..." rows={5} required />

        <div className="flex flex-wrap gap-3">
          <ToggleRow name="published" label="Published" />
          <ToggleRow name="featured" label="Featured" />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary min-w-[160px]">
            {pending ? 'Adding...' : 'Add Review'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}

export function CreateCertificationForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { pending, onSubmit } = useSmartFormSubmit(createCertificationAction, 'Certification added!');

  return (
    <FormCard title="Create Certification" subtitle="Add certifications with gradient branding.">
      <form
        onSubmit={async (e) => {
          onSubmit(e);
          onSuccess?.();
        }}
        className="space-y-4"
      >
        <div className="admin-form-grid">
          <InputField name="title" label="Title" placeholder="ISO 27001" required />
          <InputField name="subtitle" label="Subtitle" placeholder="Information Security" />
          <InputField name="emoji" label="Emoji / Icon" placeholder="🏅" defaultValue="🏅" />
          <InputField name="sort_order" label="Sort Order" type="number" defaultValue={0} />
          <InputField name="color_from" label="Gradient From" type="color" defaultValue="#7c3aed" />
          <InputField name="color_to" label="Gradient To" type="color" defaultValue="#06b6d4" />
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-divider/80 bg-black/10 px-3 py-2.5">
          <input name="active" type="checkbox" id="cert-active" defaultChecked />
          <label htmlFor="cert-active" className="text-sm text-white cursor-pointer">
            Active (visible on homepage)
          </label>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={pending} className="btn btn-primary min-w-[180px]">
            {pending ? 'Adding...' : 'Add Certification'}
          </button>
        </div>
      </form>
    </FormCard>
  );
}