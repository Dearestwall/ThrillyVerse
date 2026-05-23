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
  createReviewAction
} from '@/app/actions/admin';
import { useTransition } from 'react';
import toast from 'react-hot-toast';


export function CreateProjectForm() {
  return (
    <form action={createProjectAction} className="admin-form-grid">
      <input name="title" placeholder="Project title" className="form-input" required />
      <input name="summary" placeholder="Summary" className="form-input" />
      <input name="image_url" placeholder="Image URL" className="form-input" />
      <input name="link" placeholder="Live link" className="form-input" />
      <input name="github_url" placeholder="GitHub URL" className="form-input" />
      <input name="tech_stack" placeholder="Next.js, Supabase, Tailwind" className="form-input" />
      <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />
      <button className="btn btn-primary md:col-span-2">Create Project</button>
    </form>
  );
}

export function CreateMovieForm() {
  return (
    <form action={createMovieAction} className="admin-form-grid">
      <input name="title" placeholder="Movie title" className="form-input" required />
      <input name="category" placeholder="Category" className="form-input" />
      <input name="poster_url" placeholder="Poster URL" className="form-input" />
      <input name="movie_link" placeholder="Watch link" className="form-input" />
      <input name="download_link" placeholder="Download link" className="form-input" />
      <input name="trailer_url" placeholder="Trailer URL" className="form-input" />
      <input name="year" placeholder="Year" className="form-input" />
      <input name="rating" placeholder="Rating" className="form-input" />
      <input name="language" placeholder="Language" className="form-input" />
      <input name="duration" placeholder="Duration" className="form-input" />
      <input name="tags" placeholder="Action, Thriller" className="form-input md:col-span-2" />
      <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" /> Featured</label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="published" /> Published</label>
      <button className="btn btn-primary md:col-span-2">Create Movie</button>
    </form>
  );
}

export function CreateMaterialForm() {
  return (
    <form action={createMaterialAction} className="admin-form-grid">
      <input name="title" placeholder="Material title" className="form-input" required />
      <select name="board" className="form-input"><option>ICSE</option><option>CBSE</option><option>ISC</option><option>State</option><option>Other</option></select>
      <input name="class_level" placeholder="Class" className="form-input" required />
      <input name="subject" placeholder="Subject" className="form-input" required />
      <input name="topic" placeholder="Topic" className="form-input" />
      <input name="cover_image" placeholder="Cover image URL" className="form-input" />
      <select name="resource_type" className="form-input"><option>notes</option><option>pdf</option><option>video</option><option>link</option><option>image</option><option>other</option></select>
      <input name="resource_link" placeholder="Resource link" className="form-input" />
      <input name="download_link" placeholder="Download link" className="form-input" />
      <input name="file_size" placeholder="File size" className="form-input" />
      <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_premium" /> Premium</label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" /> Featured</label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="published" /> Published</label>
      <button className="btn btn-primary md:col-span-2">Create Material</button>
    </form>
  );
}

export function CreateBlogForm() {
  return (
    <form action={createBlogAction} className="admin-form-grid">
      <input name="title" placeholder="Blog title" className="form-input" required />
      <input name="category" placeholder="Category" className="form-input" />
      <input name="cover_image" placeholder="Cover image URL" className="form-input" />
      <input name="tags" placeholder="Tag1, Tag2" className="form-input" />
      <input name="read_time" placeholder="Read time" className="form-input" />
      <input name="excerpt" placeholder="Excerpt" className="form-input md:col-span-2" />
      <textarea name="content" placeholder="Full content" className="form-input min-h-40 md:col-span-2" />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="featured" /> Featured</label>
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="published" /> Published</label>
      <button className="btn btn-primary md:col-span-2">Create Blog</button>
    </form>
  );
}

export function CreateAnnouncementForm() {
  return (
    <form action={createAnnouncementAction} className="admin-form-grid">
      <input name="title" placeholder="Announcement title" className="form-input md:col-span-2" required />
      <input name="badge" placeholder="Badge" className="form-input" />
      <input name="priority" placeholder="Priority" className="form-input" />
      <input name="cta_label" placeholder="CTA label" className="form-input" />
      <input name="cta_url" placeholder="CTA URL" className="form-input" />
      <textarea name="body" placeholder="Announcement body" className="form-input min-h-32 md:col-span-2" />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="active" defaultChecked /> Active</label>
      <button className="btn btn-primary md:col-span-2">Create Announcement</button>
    </form>
  );
}

export function CreateNotificationForm() {
  return (
    <form action={createNotificationAction} className="admin-form-grid">
      <input name="title" placeholder="Notification title" className="form-input" required />
      <select name="type" className="form-input"><option>info</option><option>success</option><option>warning</option><option>alert</option><option>new_material</option><option>new_movie</option><option>new_blog</option><option>quiz</option></select>
      <select name="audience" className="form-input"><option>all</option><option>students</option><option>viewers</option></select>
      <input name="target_url" placeholder="Target URL" className="form-input" />
      <textarea name="message" placeholder="Message" className="form-input min-h-32 md:col-span-2" required />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="is_active" defaultChecked /> Active</label>
      <button className="btn btn-primary md:col-span-2">Create Notification</button>
    </form>
  );
}


export function CreateQuizForm() {
  return (
    <form action={createQuizAction} className="admin-form-grid">
      <input name="title" placeholder="Quiz title" className="form-input" required />
      <input name="board" placeholder="Board" className="form-input" />
      <input name="class_level" placeholder="Class" className="form-input" />
      <input name="subject" placeholder="Subject" className="form-input" />
      <input name="time_limit" placeholder="Time limit" className="form-input" />
      <select name="difficulty" className="form-input"><option>easy</option><option>medium</option><option>hard</option></select>
      <textarea name="description" placeholder="Description" className="form-input min-h-32 md:col-span-2" />
      <label className="inline-flex items-center gap-2"><input type="checkbox" name="published" /> Published</label>
      <button className="btn btn-primary md:col-span-2">Create Quiz</button>
    </form>
  );
}

/* ------ Create Partner Form ------ */
export function CreatePartnerForm() {
  const [pending, startT] = useTransition();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startT(async () => {
      try { await createPartnerAction(fd); toast.success('Partner added!'); (e.target as HTMLFormElement).reset(); }
      catch (err: any) { toast.error(err.message); }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="admin-form-grid">
        <div>
          <label className="form-label">Name *</label>
          <input name="name" required className="form-input" placeholder="Google for Education" />
        </div>
        <div>
          <label className="form-label">Emoji / Icon</label>
          <input name="emoji" className="form-input" placeholder="ðŸŽ“" defaultValue="ðŸ¤" />
        </div>
        <div>
          <label className="form-label">Logo URL</label>
          <input name="logo_url" type="url" className="form-input" placeholder="https://..." />
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
          <label htmlFor="partner-active" className="form-label mb-0 cursor-pointer">Active (visible on homepage)</label>
        </div>
      </div>
      <div className="centered-button-row">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Adding...' : 'Add Partner'}
        </button>
      </div>
    </form>
  );
}


/* ------ Create Review Form ------ */
export function CreateReviewForm() {
  const [pending, startT] = useTransition();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startT(async () => {
      try { await createReviewAction(fd); toast.success('Review added!'); (e.target as HTMLFormElement).reset(); }
      catch (err: any) { toast.error(err.message); }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <input name="emoji" className="form-input" placeholder="ðŸ‘©â€ðŸŽ“" defaultValue="ðŸ‘¤" />
        </div>
        <div>
          <label className="form-label">Avatar URL (optional)</label>
          <input name="avatar_url" type="url" className="form-input" placeholder="https://..." />
        </div>
        <div>
          <label className="form-label">Rating (1â€“5)</label>
          <select name="rating" className="form-input">
            <option value="5">â­â­â­â­â­ (5)</option>
            <option value="4">â­â­â­â­ (4)</option>
            <option value="3">â­â­â­ (3)</option>
            <option value="2">â­â­ (2)</option>
            <option value="1">â­ (1)</option>
          </select>
        </div>
        <div>
          <label className="form-label">Sort Order</label>
          <input name="sort_order" type="number" className="form-input" defaultValue={0} />
        </div>
      </div>
      <div>
        <label className="form-label">Review Text *</label>
        <textarea name="text" required rows={3} className="form-input" placeholder="Write the testimonial here..." />
      </div>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <input name="published" type="checkbox" id="review-published" />
          <label htmlFor="review-published" className="form-label mb-0 cursor-pointer">Published</label>
        </div>
        <div className="flex items-center gap-2">
          <input name="featured" type="checkbox" id="review-featured" />
          <label htmlFor="review-featured" className="form-label mb-0 cursor-pointer">Featured</label>
        </div>
      </div>
      <div className="centered-button-row">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Adding...' : 'Add Review'}
        </button>
      </div>
    </form>
  );
}


/* ------ Create Certification Form ------ */
export function CreateCertificationForm() {
  const [pending, startT] = useTransition();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startT(async () => {
      try { await createCertificationAction(fd); toast.success('Certification added!'); (e.target as HTMLFormElement).reset(); }
      catch (err: any) { toast.error(err.message); }
    });
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <input name="emoji" className="form-input" placeholder="ðŸ”’" defaultValue="ðŸ…" />
        </div>
        <div>
          <label className="form-label">Sort Order</label>
          <input name="sort_order" type="number" className="form-input" defaultValue={0} />
        </div>
        <div>
          <label className="form-label">Gradient From (hex)</label>
          <div className="flex gap-2 items-center">
            <input name="color_from" type="color" className="w-10 h-10 rounded cursor-pointer border border-divider" defaultValue="#7c3aed" />
            <input type="text" className="form-input flex-1" defaultValue="#7c3aed" readOnly />
          </div>
        </div>
        <div>
          <label className="form-label">Gradient To (hex)</label>
          <div className="flex gap-2 items-center">
            <input name="color_to" type="color" className="w-10 h-10 rounded cursor-pointer border border-divider" defaultValue="#06b6d4" />
            <input type="text" className="form-input flex-1" defaultValue="#06b6d4" readOnly />
          </div>
        </div>
        <div className="flex items-center gap-3 pt-6">
          <input name="active" type="checkbox" id="cert-active" defaultChecked />
          <label htmlFor="cert-active" className="form-label mb-0 cursor-pointer">Active (visible on homepage)</label>
        </div>
      </div>
      <div className="centered-button-row">
        <button type="submit" disabled={pending} className="btn btn-primary">
          {pending ? 'Adding...' : 'Add Certification'}
        </button>
      </div>
    </form>
  );
}
