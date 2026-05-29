'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createSlug } from '@/utils';

type AnyObject = Record<string, any>;

async function requireAdmin() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

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

async function uniqueSlug(supabase: any, table: string, baseTitle: string) {
  const base = createSlug(baseTitle);
  let slug = base || 'item';
  let i = 1;

  while (true) {
    const { data } = await supabase.from(table).select('id').eq('slug', slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
  }
}

function asString(fd: FormData, key: string, fallback = '') {
  const v = fd.get(key);
  return typeof v === 'string' ? v.trim() : fallback;
}

function asNumber(fd: FormData, key: string, fallback = 0) {
  const n = Number(fd.get(key) ?? fallback);
  return Number.isFinite(n) ? n : fallback;
}

function asBool(fd: FormData, key: string) {
  return fd.get(key) === 'on';
}

function asArray(fd: FormData, key: string) {
  return asString(fd, key)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function publishState(fd: FormData, key = 'published') {
  return asBool(fd, key);
}

function projectStatus(fd: FormData) {
  const status = asString(fd, 'status', '').toLowerCase();
  if (status === 'published') return 'published';
  if (status === 'archived') return 'archived';
  if (publishState(fd, 'published')) return 'published';
  return 'draft';
}

function nullIfEmpty(value: string) {
  return value.trim() ? value : null;
}

export async function createProjectAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slug = await uniqueSlug(supabase, 'projects', title);

  const { error } = await supabase.from('projects').insert({
    title,
    slug,
    summary: nullIfEmpty(asString(formData, 'summary')),
    description: nullIfEmpty(asString(formData, 'description')),
    image_url: nullIfEmpty(asString(formData, 'image_url')),
    link: nullIfEmpty(asString(formData, 'link')),
    github_url: nullIfEmpty(asString(formData, 'github_url')),
    tech_stack: asArray(formData, 'tech_stack'),
    sort_order: asNumber(formData, 'sort_order', 0),
    featured: asBool(formData, 'featured'),
    status: projectStatus(formData),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function updateProjectAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slugInput = asString(formData, 'slug');
  const slug = slugInput || (await uniqueSlug(supabase, 'projects', title));

  const { error } = await supabase.from('projects').update({
    title,
    slug,
    summary: nullIfEmpty(asString(formData, 'summary')),
    description: nullIfEmpty(asString(formData, 'description')),
    image_url: nullIfEmpty(asString(formData, 'image_url')),
    link: nullIfEmpty(asString(formData, 'link')),
    github_url: nullIfEmpty(asString(formData, 'github_url')),
    tech_stack: asArray(formData, 'tech_stack'),
    sort_order: asNumber(formData, 'sort_order', 0),
    featured: asBool(formData, 'featured'),
    status: projectStatus(formData),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function createMovieAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slug = await uniqueSlug(supabase, 'movies', title);

  const { error } = await supabase.from('movies').insert({
    title,
    slug,
    description: nullIfEmpty(asString(formData, 'description')),
    poster_url: nullIfEmpty(asString(formData, 'poster_url')),
    trailer_url: nullIfEmpty(asString(formData, 'trailer_url')),
    movie_link: nullIfEmpty(asString(formData, 'movie_link')),
    download_link: nullIfEmpty(asString(formData, 'download_link')),
    category: nullIfEmpty(asString(formData, 'category')),
    year: asNumber(formData, 'year', 0) || null,
    rating: nullIfEmpty(asString(formData, 'rating')),
    language: nullIfEmpty(asString(formData, 'language')),
    duration: nullIfEmpty(asString(formData, 'duration')),
    tags: asArray(formData, 'tags'),
    featured: asBool(formData, 'featured'),
    published: publishState(formData),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function updateMovieAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('movies').update({
    title: asString(formData, 'title'),
    description: nullIfEmpty(asString(formData, 'description')),
    poster_url: nullIfEmpty(asString(formData, 'poster_url')),
    trailer_url: nullIfEmpty(asString(formData, 'trailer_url')),
    movie_link: nullIfEmpty(asString(formData, 'movie_link')),
    download_link: nullIfEmpty(asString(formData, 'download_link')),
    category: nullIfEmpty(asString(formData, 'category')),
    year: asNumber(formData, 'year', 0) || null,
    rating: nullIfEmpty(asString(formData, 'rating')),
    language: nullIfEmpty(asString(formData, 'language')),
    duration: nullIfEmpty(asString(formData, 'duration')),
    tags: asArray(formData, 'tags'),
    featured: asBool(formData, 'featured'),
    published: publishState(formData),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function createMaterialAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slug = await uniqueSlug(supabase, 'materials', title);

  const { error } = await supabase.from('materials').insert({
    title,
    slug,
    board: asString(formData, 'board') || 'Other',
    class_level: asString(formData, 'class_level') || '',
    subject: asString(formData, 'subject') || '',
    topic: nullIfEmpty(asString(formData, 'topic')),
    description: nullIfEmpty(asString(formData, 'description')),
    cover_image: nullIfEmpty(asString(formData, 'cover_image')),
    resource_type: asString(formData, 'resource_type') || 'notes',
    resource_link: nullIfEmpty(asString(formData, 'resource_link')),
    download_link: nullIfEmpty(asString(formData, 'download_link')),
    file_size: nullIfEmpty(asString(formData, 'file_size')),
    is_premium: asBool(formData, 'is_premium'),
    featured: asBool(formData, 'featured'),
    published: publishState(formData),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function updateMaterialAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('materials').update({
    title: asString(formData, 'title'),
    board: asString(formData, 'board') || 'Other',
    class_level: asString(formData, 'class_level') || '',
    subject: asString(formData, 'subject') || '',
    topic: nullIfEmpty(asString(formData, 'topic')),
    description: nullIfEmpty(asString(formData, 'description')),
    cover_image: nullIfEmpty(asString(formData, 'cover_image')),
    resource_type: asString(formData, 'resource_type') || 'notes',
    resource_link: nullIfEmpty(asString(formData, 'resource_link')),
    download_link: nullIfEmpty(asString(formData, 'download_link')),
    file_size: nullIfEmpty(asString(formData, 'file_size')),
    is_premium: asBool(formData, 'is_premium'),
    featured: asBool(formData, 'featured'),
    published: publishState(formData),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function toggleAnnouncementActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('announcements').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function toggleBlogPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('blogs')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function toggleCertificationActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('certifications').update({ active, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function toggleNotificationActiveAction(id: string, is_active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('notifications').update({ is_active, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/notifications');
}

export async function togglePartnerActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('partners').update({ active, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function toggleQuizPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('quizzes').update({ published, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function toggleReviewPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reviews').update({ published, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function createBlogAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slug = await uniqueSlug(supabase, 'blogs', title);
  const published = publishState(formData);

  const { error } = await supabase.from('blogs').insert({
    title,
    slug,
    excerpt: nullIfEmpty(asString(formData, 'excerpt')),
    content: nullIfEmpty(asString(formData, 'content')),
    cover_image: nullIfEmpty(asString(formData, 'cover_image')),
    category: nullIfEmpty(asString(formData, 'category')),
    tags: asArray(formData, 'tags'),
    read_time: asNumber(formData, 'read_time', 5),
    featured: asBool(formData, 'featured'),
    published,
    published_at: published ? new Date().toISOString() : null,
    author_id: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function updateBlogAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const published = publishState(formData);

  const { error } = await supabase.from('blogs').update({
    title: asString(formData, 'title'),
    slug: asString(formData, 'slug') || undefined,
    excerpt: nullIfEmpty(asString(formData, 'excerpt')),
    content: nullIfEmpty(asString(formData, 'content')),
    cover_image: nullIfEmpty(asString(formData, 'cover_image')),
    category: nullIfEmpty(asString(formData, 'category')),
    tags: asArray(formData, 'tags'),
    read_time: asNumber(formData, 'read_time', 5),
    featured: asBool(formData, 'featured'),
    published,
    published_at: published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function createAnnouncementAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('announcements').insert({
    title: asString(formData, 'title'),
    body: nullIfEmpty(asString(formData, 'body')),
    cta_label: nullIfEmpty(asString(formData, 'cta_label')),
    cta_url: nullIfEmpty(asString(formData, 'cta_url')),
    badge: nullIfEmpty(asString(formData, 'badge')),
    priority: asNumber(formData, 'priority', 0),
    active: asBool(formData, 'active'),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('announcements').update({
    title: asString(formData, 'title'),
    body: nullIfEmpty(asString(formData, 'body')),
    cta_label: nullIfEmpty(asString(formData, 'cta_label')),
    cta_url: nullIfEmpty(asString(formData, 'cta_url')),
    badge: nullIfEmpty(asString(formData, 'badge')),
    priority: asNumber(formData, 'priority', 0),
    active: asBool(formData, 'active'),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function createNotificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('notifications').insert({
    title: asString(formData, 'title'),
    message: asString(formData, 'message'),
    type: asString(formData, 'type') || 'info',
    target_url: nullIfEmpty(asString(formData, 'target_url')),
    audience: asString(formData, 'audience') || 'all',
    is_active: asBool(formData, 'is_active'),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/admin/notifications');
}

export async function updateNotificationAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('notifications').update({
    title: asString(formData, 'title'),
    message: asString(formData, 'message'),
    type: asString(formData, 'type') || 'info',
    target_url: nullIfEmpty(asString(formData, 'target_url')),
    audience: asString(formData, 'audience') || 'all',
    is_active: asBool(formData, 'is_active'),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/admin/notifications');
}

export async function createQuizAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = asString(formData, 'title');
  if (!title) throw new Error('Title is required');

  const slug = await uniqueSlug(supabase, 'quizzes', title);

  const { error } = await supabase.from('quizzes').insert({
    title,
    slug,
    description: nullIfEmpty(asString(formData, 'description')),
    board: nullIfEmpty(asString(formData, 'board')),
    class_level: nullIfEmpty(asString(formData, 'class_level')),
    subject: nullIfEmpty(asString(formData, 'subject')),
    time_limit: asNumber(formData, 'time_limit', 10),
    difficulty: asString(formData, 'difficulty') || 'medium',
    published: publishState(formData),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function updateQuizAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('quizzes').update({
    title: asString(formData, 'title'),
    description: nullIfEmpty(asString(formData, 'description')),
    board: nullIfEmpty(asString(formData, 'board')),
    class_level: nullIfEmpty(asString(formData, 'class_level')),
    subject: nullIfEmpty(asString(formData, 'subject')),
    time_limit: asNumber(formData, 'time_limit', 10),
    difficulty: asString(formData, 'difficulty') || 'medium',
    published: publishState(formData),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function createPartnerAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('partners').insert({
    name: asString(formData, 'name'),
    emoji: asString(formData, 'emoji') || '🤝',
    logo_url: nullIfEmpty(asString(formData, 'logo_url')),
    website_url: nullIfEmpty(asString(formData, 'website_url')),
    sort_order: asNumber(formData, 'sort_order', 0),
    active: asBool(formData, 'active'),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function updatePartnerAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('partners').update({
    name: asString(formData, 'name'),
    emoji: asString(formData, 'emoji') || '🤝',
    logo_url: nullIfEmpty(asString(formData, 'logo_url')),
    website_url: nullIfEmpty(asString(formData, 'website_url')),
    sort_order: asNumber(formData, 'sort_order', 0),
    active: asBool(formData, 'active'),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function createReviewAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('reviews').insert({
    name: asString(formData, 'name'),
    role: nullIfEmpty(asString(formData, 'role')),
    emoji: asString(formData, 'emoji') || '👤',
    avatar_url: nullIfEmpty(asString(formData, 'avatar_url')),
    rating: asNumber(formData, 'rating', 5),
    text: asString(formData, 'text'),
    featured: asBool(formData, 'featured'),
    published: asBool(formData, 'published'),
    sort_order: asNumber(formData, 'sort_order', 0),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function updateReviewAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('reviews').update({
    name: asString(formData, 'name'),
    role: nullIfEmpty(asString(formData, 'role')),
    emoji: asString(formData, 'emoji') || '👤',
    avatar_url: nullIfEmpty(asString(formData, 'avatar_url')),
    rating: asNumber(formData, 'rating', 5),
    text: asString(formData, 'text'),
    featured: asBool(formData, 'featured'),
    published: asBool(formData, 'published'),
    sort_order: asNumber(formData, 'sort_order', 0),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function createCertificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const { error } = await supabase.from('certifications').insert({
    title: asString(formData, 'title'),
    subtitle: nullIfEmpty(asString(formData, 'subtitle')),
    emoji: asString(formData, 'emoji') || '🏅',
    color_from: asString(formData, 'color_from') || '#7c3aed',
    color_to: asString(formData, 'color_to') || '#06b6d4',
    sort_order: asNumber(formData, 'sort_order', 0),
    active: asBool(formData, 'active'),
    created_by: user.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function updateCertificationAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('certifications').update({
    title: asString(formData, 'title'),
    subtitle: nullIfEmpty(asString(formData, 'subtitle')),
    emoji: asString(formData, 'emoji') || '🏅',
    color_from: asString(formData, 'color_from') || '#7c3aed',
    color_to: asString(formData, 'color_to') || '#06b6d4',
    sort_order: asNumber(formData, 'sort_order', 0),
    active: asBool(formData, 'active'),
    updated_at: new Date().toISOString(),
  }).eq('id', id);

  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function toggleContactReadAction(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contacts').update({ read }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/contacts');
}

export async function deleteRowAction(table: string, id: string, paths: string[]) {
  const allowedTables = ['projects', 'movies', 'materials', 'blogs', 'announcements', 'notifications', 'quizzes', 'contacts', 'partners', 'reviews', 'certifications'];
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