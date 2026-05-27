'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createSlug } from '@/utils';

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) throw new Error('Unauthorized');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.is_active || !['super_admin', 'editor'].includes(profile.role)) {
    throw new Error('Forbidden');
  }

  return { supabase, user };
}

export async function createProjectAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '');
  const slug = createSlug(title);
  const tech_stack = String(formData.get('tech_stack') ?? '').split(',').map((v) => v.trim()).filter(Boolean);

  const { error } = await supabase.from('projects').insert({
    title,
    slug,
    summary: String(formData.get('summary') ?? '') || null,
    description: String(formData.get('description') ?? '') || null,
    image_url: String(formData.get('image_url') ?? '') || null,
    link: String(formData.get('link') ?? '') || null,
    github_url: String(formData.get('github_url') ?? '') || null,
    tech_stack,
    status: 'draft',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function createMovieAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '');
  const slug = createSlug(title);

  const { error } = await supabase.from('movies').insert({
    title,
    slug,
    description: String(formData.get('description') ?? '') || null,
    poster_url: String(formData.get('poster_url') ?? '') || null,
    trailer_url: String(formData.get('trailer_url') ?? '') || null,
    movie_link: String(formData.get('movie_link') ?? '') || null,
    download_link: String(formData.get('download_link') ?? '') || null,
    category: String(formData.get('category') ?? '') || null,
    year: Number(formData.get('year') || 0) || null,
    rating: String(formData.get('rating') ?? '') || null,
    language: String(formData.get('language') ?? '') || null,
    duration: String(formData.get('duration') ?? '') || null,
    tags: String(formData.get('tags') ?? '').split(',').map((v) => v.trim()).filter(Boolean),
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function createMaterialAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '');
  const slug = createSlug(title);

  const { error } = await supabase.from('materials').insert({
    title,
    slug,
    board: String(formData.get('board') ?? 'Other'),
    class_level: String(formData.get('class_level') ?? ''),
    subject: String(formData.get('subject') ?? ''),
    topic: String(formData.get('topic') ?? '') || null,
    description: String(formData.get('description') ?? '') || null,
    cover_image: String(formData.get('cover_image') ?? '') || null,
    resource_type: String(formData.get('resource_type') ?? 'notes'),
    resource_link: String(formData.get('resource_link') ?? '') || null,
    download_link: String(formData.get('download_link') ?? '') || null,
    file_size: String(formData.get('file_size') ?? '') || null,
    is_premium: formData.get('is_premium') === 'on',
    featured: formData.get('featured') === 'on',
    published: formData.get('published') === 'on',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function createBlogAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '');
  const slug = createSlug(title);
  const published = formData.get('published') === 'on';

  const { error } = await supabase.from('blogs').insert({
    title,
    slug,
    excerpt: String(formData.get('excerpt') ?? '') || null,
    content: String(formData.get('content') ?? '') || null,
    cover_image: String(formData.get('cover_image') ?? '') || null,
    category: String(formData.get('category') ?? '') || null,
    tags: String(formData.get('tags') ?? '').split(',').map((v) => v.trim()).filter(Boolean),
    read_time: Number(formData.get('read_time') || 5),
    featured: formData.get('featured') === 'on',
    published,
    published_at: published ? new Date().toISOString() : null,
    author_id: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function createAnnouncementAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('announcements').insert({
    title: String(formData.get('title') ?? ''),
    body: String(formData.get('body') ?? '') || null,
    cta_label: String(formData.get('cta_label') ?? '') || null,
    cta_url: String(formData.get('cta_url') ?? '') || null,
    badge: String(formData.get('badge') ?? '') || null,
    priority: Number(formData.get('priority') || 0),
    active: formData.get('active') === 'on',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function createNotificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('notifications').insert({
    title: String(formData.get('title') ?? ''),
    message: String(formData.get('message') ?? ''),
    type: String(formData.get('type') ?? 'info'),
    target_url: String(formData.get('target_url') ?? '') || null,
    audience: String(formData.get('audience') ?? 'all'),
    is_active: formData.get('is_active') === 'on',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/notifications');
}

export async function createQuizAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '');
  const slug = createSlug(title);

  const { error } = await supabase.from('quizzes').insert({
    title,
    slug,
    description: String(formData.get('description') ?? '') || null,
    board: String(formData.get('board') ?? '') || null,
    class_level: String(formData.get('class_level') ?? '') || null,
    subject: String(formData.get('subject') ?? '') || null,
    time_limit: Number(formData.get('time_limit') || 10),
    difficulty: String(formData.get('difficulty') ?? 'medium'),
    published: formData.get('published') === 'on',
    created_by: user.id
  });

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function deleteRowAction(table: string, id: string, paths: string[]) {
  const allowedTables = ['projects', 'movies', 'materials', 'blogs', 'announcements', 'notifications', 'quizzes', 'contacts'];
  if (!allowedTables.includes(table)) throw new Error('Invalid table');

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  paths.forEach((path) => revalidatePath(path));
}
export async function bulkDeleteAction(table: string, ids: string[], paths: string[]) {
  const allowedTables = ['projects', 'movies', 'materials', 'blogs', 'announcements', 'notifications', 'quizzes', 'contacts', 'partners', 'reviews', 'certifications'];
  if (!allowedTables.includes(table)) throw new Error('Invalid table');

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().in('id', ids);

  if (error) throw new Error(error.message);
  paths.forEach((path) => revalidatePath(path));
}

export async function toggleContactReadAction(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contacts').update({ read }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/contacts');
}

export async function toggleAnnouncementActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('announcements').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function toggleNotificationActiveAction(id: string, is_active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('notifications').update({ is_active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/notifications');
}

export async function toggleBlogPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('blogs').update({
    published,
    published_at: published ? new Date().toISOString() : null
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function toggleQuizPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('quizzes').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}
export async function createPartnerAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from('partners').insert({
    name:        String(formData.get('name') ?? ''),
    emoji:       String(formData.get('emoji') ?? 'ðŸ¤') || 'ðŸ¤',
    logo_url:    String(formData.get('logo_url') ?? '') || null,
    website_url: String(formData.get('website_url') ?? '') || null,
    sort_order:  Number(formData.get('sort_order') || 0),
    active:      formData.get('active') === 'on',
    created_by:  user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function updatePartnerAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('partners').update({
    name:        String(formData.get('name') ?? ''),
    emoji:       String(formData.get('emoji') ?? 'ðŸ¤') || 'ðŸ¤',
    logo_url:    String(formData.get('logo_url') ?? '') || null,
    website_url: String(formData.get('website_url') ?? '') || null,
    sort_order:  Number(formData.get('sort_order') || 0),
    active:      formData.get('active') === 'on',
    updated_at:  new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function createReviewAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const published = formData.get('published') === 'on';
  const { error } = await supabase.from('reviews').insert({
    name:       String(formData.get('name') ?? ''),
    role:       String(formData.get('role') ?? '') || null,
    emoji:      String(formData.get('emoji') ?? 'ðŸ‘¤') || 'ðŸ‘¤',
    avatar_url: String(formData.get('avatar_url') ?? '') || null,
    rating:     Number(formData.get('rating') || 5),
    text:       String(formData.get('text') ?? ''),
    featured:   formData.get('featured') === 'on',
    published,
    sort_order: Number(formData.get('sort_order') || 0),
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function updateReviewAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reviews').update({
    name:       String(formData.get('name') ?? ''),
    role:       String(formData.get('role') ?? '') || null,
    emoji:      String(formData.get('emoji') ?? 'ðŸ‘¤') || 'ðŸ‘¤',
    avatar_url: String(formData.get('avatar_url') ?? '') || null,
    rating:     Number(formData.get('rating') || 5),
    text:       String(formData.get('text') ?? ''),
    featured:   formData.get('featured') === 'on',
    published:  formData.get('published') === 'on',
    sort_order: Number(formData.get('sort_order') || 0),
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function createCertificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from('certifications').insert({
    title:      String(formData.get('title') ?? ''),
    subtitle:   String(formData.get('subtitle') ?? '') || null,
    emoji:      String(formData.get('emoji') ?? 'ðŸ…') || 'ðŸ…',
    color_from: String(formData.get('color_from') ?? '#7c3aed'),
    color_to:   String(formData.get('color_to') ?? '#06b6d4'),
    sort_order: Number(formData.get('sort_order') || 0),
    active:     formData.get('active') === 'on',
    created_by: user.id,
  });
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function updateCertificationAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('certifications').update({
    title:      String(formData.get('title') ?? ''),
    subtitle:   String(formData.get('subtitle') ?? '') || null,
    emoji:      String(formData.get('emoji') ?? 'ðŸ…') || 'ðŸ…',
    color_from: String(formData.get('color_from') ?? '#7c3aed'),
    color_to:   String(formData.get('color_to') ?? '#06b6d4'),
    sort_order: Number(formData.get('sort_order') || 0),
    active:     formData.get('active') === 'on',
    updated_at: new Date().toISOString(),
  }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function togglePartnerActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('partners').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function toggleReviewPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reviews').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function toggleCertificationActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('certifications').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}