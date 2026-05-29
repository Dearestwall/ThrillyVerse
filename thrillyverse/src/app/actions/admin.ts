'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_TABLES = [
  'projects',
  'movies',
  'materials',
  'blogs',
  'announcements',
  'notifications',
  'quizzes',
  'contacts',
  'reviews',
  'partners',
  'certifications',
] as const;

type AllowedTable = (typeof ALLOWED_TABLES)[number];

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toBool(value: FormDataEntryValue | null) {
  return value === 'on' || value === 'true' || value === '1';
}

function toNum(value: FormDataEntryValue | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toText(value: FormDataEntryValue | null) {
  const v = String(value ?? '').trim();
  return v ? v : null;
}

function toTags(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,is_active')
    .eq('id', user.id)
    .single();

  if (!profile?.is_active || !['admin', 'super_admin', 'editor'].includes(profile.role)) {
    redirect('/admin/login');
  }

  return { supabase, user };
}

export async function deleteRowAction(table: AllowedTable, id: string, paths: string[] = []) {
  if (!ALLOWED_TABLES.includes(table)) throw new Error('Invalid table');

  const { supabase } = await requireAdmin();
  const { error } = await supabase.from(table).delete().eq('id', id);

  if (error) throw new Error(error.message);

  paths.forEach((path) => revalidatePath(path));
}

export async function updateContactAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    name: toText(formData.get('name')),
    email: toText(formData.get('email')),
    phone: toText(formData.get('phone')),
    subject: toText(formData.get('subject')),
    message: toText(formData.get('message')),
    read: toBool(formData.get('read')),
  };

  const { error } = await supabase.from('contacts').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/admin/contacts');
}

export async function toggleContactReadAction(id: string, read: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('contacts').update({ read }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/contacts');
}

export async function createMovieAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    description: toText(formData.get('description')),
    poster_url: toText(formData.get('poster_url')),
    trailer_url: toText(formData.get('trailer_url')),
    movie_link: toText(formData.get('movie_link')),
    download_link: toText(formData.get('download_link')),
    category: toText(formData.get('category')),
    year: toNum(formData.get('year'), 0) || null,
    rating: toText(formData.get('rating')),
    language: toText(formData.get('language')),
    duration: toText(formData.get('duration')),
    tags: toTags(formData.get('tags')),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
    created_by: user.id,
  };

  const { error } = await supabase.from('movies').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function updateMovieAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    description: toText(formData.get('description')),
    poster_url: toText(formData.get('poster_url')),
    trailer_url: toText(formData.get('trailer_url')),
    movie_link: toText(formData.get('movie_link')),
    download_link: toText(formData.get('download_link')),
    category: toText(formData.get('category')),
    year: toNum(formData.get('year'), 0) || null,
    rating: toText(formData.get('rating')),
    language: toText(formData.get('language')),
    duration: toText(formData.get('duration')),
    tags: toTags(formData.get('tags')),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
  };

  const { error } = await supabase.from('movies').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function toggleMoviePublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('movies').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function toggleMovieFeaturedAction(id: string, featured: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('movies').update({ featured }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/movies');
  revalidatePath('/admin/movies');
}

export async function createMaterialAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    board: toText(formData.get('board')),
    class_level: toText(formData.get('class_level')),
    subject: toText(formData.get('subject')),
    topic: toText(formData.get('topic')),
    description: toText(formData.get('description')),
    cover_image: toText(formData.get('cover_image')),
    resource_type: toText(formData.get('resource_type')),
    resource_link: toText(formData.get('resource_link')),
    download_link: toText(formData.get('download_link')),
    file_size: toText(formData.get('file_size')),
    is_premium: toBool(formData.get('is_premium')),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
    created_by: user.id,
  };

  const { error } = await supabase.from('materials').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function updateMaterialAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    board: toText(formData.get('board')),
    class_level: toText(formData.get('class_level')),
    subject: toText(formData.get('subject')),
    topic: toText(formData.get('topic')),
    description: toText(formData.get('description')),
    cover_image: toText(formData.get('cover_image')),
    resource_type: toText(formData.get('resource_type')),
    resource_link: toText(formData.get('resource_link')),
    download_link: toText(formData.get('download_link')),
    file_size: toText(formData.get('file_size')),
    is_premium: toBool(formData.get('is_premium')),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
  };

  const { error } = await supabase.from('materials').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function toggleMaterialPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('materials').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function toggleMaterialFeaturedAction(id: string, featured: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('materials').update({ featured }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/materials');
}

export async function createBlogAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const published = toBool(formData.get('published'));

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    excerpt: toText(formData.get('excerpt')),
    content: toText(formData.get('content')),
    cover_image: toText(formData.get('cover_image')),
    category: toText(formData.get('category')),
    tags: toTags(formData.get('tags')),
    read_time: toNum(formData.get('read_time'), 5),
    featured: toBool(formData.get('featured')),
    published,
    published_at: published ? new Date().toISOString() : null,
    author_id: user.id,
  };

  const { error } = await supabase.from('blogs').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function updateBlogAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();
  const published = toBool(formData.get('published'));

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    excerpt: toText(formData.get('excerpt')),
    content: toText(formData.get('content')),
    cover_image: toText(formData.get('cover_image')),
    category: toText(formData.get('category')),
    tags: toTags(formData.get('tags')),
    read_time: toNum(formData.get('read_time'), 5),
    featured: toBool(formData.get('featured')),
    published,
    published_at: published ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from('blogs').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function toggleBlogPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase
    .from('blogs')
    .update({ published, published_at: published ? new Date().toISOString() : null })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/blogs');
  revalidatePath('/admin/blogs');
}

export async function createAnnouncementAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    body: toText(formData.get('body')),
    cta_label: toText(formData.get('cta_label')),
    cta_url: toText(formData.get('cta_url')),
    badge: toText(formData.get('badge')),
    priority: toNum(formData.get('priority'), 0),
    active: toBool(formData.get('active')),
    created_by: user.id,
  };

  const { error } = await supabase.from('announcements').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function updateAnnouncementAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    body: toText(formData.get('body')),
    cta_label: toText(formData.get('cta_label')),
    cta_url: toText(formData.get('cta_url')),
    badge: toText(formData.get('badge')),
    priority: toNum(formData.get('priority'), 0),
    active: toBool(formData.get('active')),
  };

  const { error } = await supabase.from('announcements').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function toggleAnnouncementActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('announcements').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/announcements');
}

export async function createNotificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
    type: String(formData.get('type') ?? 'info'),
    target_url: toText(formData.get('target_url')),
    audience: toText(formData.get('audience')) ?? 'all',
    is_active: toBool(formData.get('is_active')),
    created_by: user.id,
  };

  const { error } = await supabase.from('notifications').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/notifications');
}

export async function updateNotificationAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    message: String(formData.get('message') ?? '').trim(),
    type: String(formData.get('type') ?? 'info'),
    target_url: toText(formData.get('target_url')),
    audience: toText(formData.get('audience')) ?? 'all',
    is_active: toBool(formData.get('is_active')),
  };

  const { error } = await supabase.from('notifications').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/notifications');
}

export async function toggleNotificationActiveAction(id: string, isActive: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('notifications').update({ is_active: isActive }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/notifications');
}

export async function createQuizAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    description: toText(formData.get('description')),
    board: toText(formData.get('board')),
    class_level: toText(formData.get('class_level')),
    subject: toText(formData.get('subject')),
    time_limit: toNum(formData.get('time_limit'), 10),
    difficulty: String(formData.get('difficulty') ?? 'medium'),
    published: toBool(formData.get('published')),
    created_by: user.id,
  };

  const { error } = await supabase.from('quizzes').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function updateQuizAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    description: toText(formData.get('description')),
    board: toText(formData.get('board')),
    class_level: toText(formData.get('class_level')),
    subject: toText(formData.get('subject')),
    time_limit: toNum(formData.get('time_limit'), 10),
    difficulty: String(formData.get('difficulty') ?? 'medium'),
    published: toBool(formData.get('published')),
  };

  const { error } = await supabase.from('quizzes').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function toggleQuizPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('quizzes').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/materials');
  revalidatePath('/admin/quizzes');
}

export async function createReviewAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    role: toText(formData.get('role')),
    text: String(formData.get('text') ?? '').trim(),
    avatar_url: toText(formData.get('avatar_url')),
    emoji: toText(formData.get('emoji')) ?? '⭐',
    rating: toNum(formData.get('rating'), 5),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
    created_by: user.id,
  };

  const { error } = await supabase.from('reviews').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function updateReviewAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    role: toText(formData.get('role')),
    text: String(formData.get('text') ?? '').trim(),
    avatar_url: toText(formData.get('avatar_url')),
    emoji: toText(formData.get('emoji')) ?? '⭐',
    rating: toNum(formData.get('rating'), 5),
    featured: toBool(formData.get('featured')),
    published: toBool(formData.get('published')),
    sort_order: toNum(formData.get('sort_order'), 0),
  };

  const { error } = await supabase.from('reviews').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function toggleReviewPublishedAction(id: string, published: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reviews').update({ published }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function toggleReviewFeaturedAction(id: string, featured: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('reviews').update({ featured }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/reviews');
}

export async function createProjectAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    summary: toText(formData.get('summary')),
    description: toText(formData.get('description')),
    image_url: toText(formData.get('image_url')),
    link: toText(formData.get('link')),
    github_url: toText(formData.get('github_url')),
    tech_stack: toTags(formData.get('tech_stack')),
    featured: toBool(formData.get('featured')),
    status: String(formData.get('status') ?? 'draft'),
    sort_order: toNum(formData.get('sort_order'), 0),
    created_by: user.id,
  };

  const { error } = await supabase.from('projects').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function updateProjectAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const title = String(formData.get('title') ?? '').trim();

  const payload = {
    title,
    slug: createSlug(String(formData.get('slug') || title)),
    summary: toText(formData.get('summary')),
    description: toText(formData.get('description')),
    image_url: toText(formData.get('image_url')),
    link: toText(formData.get('link')),
    github_url: toText(formData.get('github_url')),
    tech_stack: toTags(formData.get('tech_stack')),
    featured: toBool(formData.get('featured')),
    status: String(formData.get('status') ?? 'draft'),
    sort_order: toNum(formData.get('sort_order'), 0),
  };

  const { error } = await supabase.from('projects').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/projects');
}

export async function createPartnerAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    emoji: toText(formData.get('emoji')),
    logo_url: toText(formData.get('logo_url')),
    website_url: toText(formData.get('website_url')),
    sort_order: toNum(formData.get('sort_order'), 0),
    active: toBool(formData.get('active')),
    created_by: user.id,
  };

  const { error } = await supabase.from('partners').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function updatePartnerAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    name: String(formData.get('name') ?? '').trim(),
    emoji: toText(formData.get('emoji')),
    logo_url: toText(formData.get('logo_url')),
    website_url: toText(formData.get('website_url')),
    sort_order: toNum(formData.get('sort_order'), 0),
    active: toBool(formData.get('active')),
  };

  const { error } = await supabase.from('partners').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function togglePartnerActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('partners').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/partners');
}

export async function createCertificationAction(formData: FormData) {
  const { supabase, user } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    subtitle: toText(formData.get('subtitle')),
    emoji: toText(formData.get('emoji')),
    color_from: toText(formData.get('color_from')),
    color_to: toText(formData.get('color_to')),
    sort_order: toNum(formData.get('sort_order'), 0),
    active: toBool(formData.get('active')),
    created_by: user.id,
  };

  const { error } = await supabase.from('certifications').insert(payload);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function updateCertificationAction(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();

  const payload = {
    title: String(formData.get('title') ?? '').trim(),
    subtitle: toText(formData.get('subtitle')),
    emoji: toText(formData.get('emoji')),
    color_from: toText(formData.get('color_from')),
    color_to: toText(formData.get('color_to')),
    sort_order: toNum(formData.get('sort_order'), 0),
    active: toBool(formData.get('active')),
  };

  const { error } = await supabase.from('certifications').update(payload).eq('id', id);
  if (error) throw new Error(error.message);

  revalidatePath('/');
  revalidatePath('/admin/certifications');
}

export async function toggleCertificationActiveAction(id: string, active: boolean) {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from('certifications').update({ active }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
  revalidatePath('/admin/certifications');
}