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

type BulkRow = Record<string, string | number | boolean | null | string[]>;

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toBool(value: FormDataEntryValue | string | number | boolean | null) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase();
  return ['on', 'true', '1', 'yes', 'y'].includes(normalized);
}

function toNum(value: FormDataEntryValue | string | number | null, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toText(value: FormDataEntryValue | string | number | null) {
  const v = String(value ?? '').trim();
  return v ? v : null;
}

function toTags(value: FormDataEntryValue | string | string[] | null) {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }

  return String(value ?? '')
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function normalizeProjectStatus(value: FormDataEntryValue | string | null) {
  const raw = String(value ?? '')
    .trim()
    .toLowerCase();

  if (['published', 'live', 'active'].includes(raw)) return 'published';
  if (['archived', 'archive'].includes(raw)) return 'archived';

  return 'published';
}

function normalizeNotificationType(value: FormDataEntryValue | string | null) {
  const raw = String(value ?? 'info')
    .trim()
    .toLowerCase();

  if (['success', 'warning', 'error', 'info'].includes(raw)) return raw;
  return 'info';
}

function normalizeQuizDifficulty(value: FormDataEntryValue | string | null) {
  const raw = String(value ?? 'medium')
    .trim()
    .toLowerCase();

  if (['easy', 'medium', 'hard'].includes(raw)) return raw;
  return 'medium';
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

async function generateUniqueSlug(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: AllowedTable,
  input: string,
  excludeId?: string
) {
  const baseSlug = createSlug(input) || `item-${Date.now()}`;
  let slug = baseSlug;
  let counter = 2;

  for (;;) {
    let query = supabase.from(table).select('id').eq('slug', slug).limit(1);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
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
    type: normalizeNotificationType(formData.get('type')),
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
    type: normalizeNotificationType(formData.get('type')),
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
    difficulty: normalizeQuizDifficulty(formData.get('difficulty')),
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
    difficulty: normalizeQuizDifficulty(formData.get('difficulty')),
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
  const requestedSlug = String(formData.get('slug') || title).trim();
  const slug = await generateUniqueSlug(supabase, 'projects', requestedSlug);

  const payload = {
    title,
    slug,
    summary: toText(formData.get('summary')),
    description: toText(formData.get('description')),
    image_url: toText(formData.get('image_url')),
    link: toText(formData.get('link')),
    github_url: toText(formData.get('github_url')),
    tech_stack: toTags(formData.get('tech_stack')),
    featured: toBool(formData.get('featured')),
    status: normalizeProjectStatus(formData.get('status')),
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
  const requestedSlug = String(formData.get('slug') || title).trim();
  const slug = await generateUniqueSlug(supabase, 'projects', requestedSlug, id);

  const payload = {
    title,
    slug,
    summary: toText(formData.get('summary')),
    description: toText(formData.get('description')),
    image_url: toText(formData.get('image_url')),
    link: toText(formData.get('link')),
    github_url: toText(formData.get('github_url')),
    tech_stack: toTags(formData.get('tech_stack')),
    featured: toBool(formData.get('featured')),
    status: normalizeProjectStatus(formData.get('status')),
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

function mapBulkRow(table: AllowedTable, row: Record<string, string>, userId: string): BulkRow {
  switch (table) {
    case 'projects': {
      const title = String(row.title ?? '').trim();
      return {
        title,
        slug: createSlug(String(row.slug || title)),
        summary: toText(row.summary),
        description: toText(row.description),
        image_url: toText(row.image_url),
        link: toText(row.link),
        github_url: toText(row.github_url),
        tech_stack: toTags(row.tech_stack),
        featured: toBool(row.featured),
        status: normalizeProjectStatus(row.status),
        sort_order: toNum(row.sort_order, 0),
        created_by: userId,
      };
    }

    case 'movies': {
      const title = String(row.title ?? '').trim();
      return {
        title,
        slug: createSlug(String(row.slug || title)),
        description: toText(row.description),
        poster_url: toText(row.poster_url),
        trailer_url: toText(row.trailer_url),
        movie_link: toText(row.movie_link),
        download_link: toText(row.download_link),
        category: toText(row.category),
        year: toNum(row.year, 0) || null,
        rating: toText(row.rating),
        language: toText(row.language),
        duration: toText(row.duration),
        tags: toTags(row.tags),
        featured: toBool(row.featured),
        published: toBool(row.published),
        sort_order: toNum(row.sort_order, 0),
        created_by: userId,
      };
    }

    case 'materials': {
      const title = String(row.title ?? '').trim();
      return {
        title,
        slug: createSlug(String(row.slug || title)),
        board: toText(row.board),
        class_level: toText(row.class_level),
        subject: toText(row.subject),
        topic: toText(row.topic),
        description: toText(row.description),
        cover_image: toText(row.cover_image),
        resource_type: toText(row.resource_type),
        resource_link: toText(row.resource_link),
        download_link: toText(row.download_link),
        file_size: toText(row.file_size),
        is_premium: toBool(row.is_premium),
        featured: toBool(row.featured),
        published: toBool(row.published),
        sort_order: toNum(row.sort_order, 0),
        created_by: userId,
      };
    }

    case 'blogs': {
      const title = String(row.title ?? '').trim();
      const published = toBool(row.published);
      return {
        title,
        slug: createSlug(String(row.slug || title)),
        excerpt: toText(row.excerpt),
        content: toText(row.content),
        cover_image: toText(row.cover_image),
        category: toText(row.category),
        tags: toTags(row.tags),
        read_time: toNum(row.read_time, 5),
        featured: toBool(row.featured),
        published,
        published_at: published ? new Date().toISOString() : null,
        author_id: userId,
      };
    }

    case 'announcements':
      return {
        title: String(row.title ?? '').trim(),
        body: toText(row.body),
        cta_label: toText(row.cta_label),
        cta_url: toText(row.cta_url),
        badge: toText(row.badge),
        priority: toNum(row.priority, 0),
        active: toBool(row.active),
        created_by: userId,
      };

    case 'notifications':
      return {
        title: String(row.title ?? '').trim(),
        message: String(row.message ?? '').trim(),
        type: normalizeNotificationType(row.type),
        target_url: toText(row.target_url),
        audience: toText(row.audience) ?? 'all',
        is_active: toBool(row.is_active),
        created_by: userId,
      };

    case 'quizzes': {
      const title = String(row.title ?? '').trim();
      return {
        title,
        slug: createSlug(String(row.slug || title)),
        description: toText(row.description),
        board: toText(row.board),
        class_level: toText(row.class_level),
        subject: toText(row.subject),
        time_limit: toNum(row.time_limit, 10),
        difficulty: normalizeQuizDifficulty(row.difficulty),
        published: toBool(row.published),
        created_by: userId,
      };
    }

    case 'contacts':
      return {
        name: toText(row.name),
        email: toText(row.email),
        phone: toText(row.phone),
        subject: toText(row.subject),
        message: toText(row.message),
        read: toBool(row.read),
      };

    case 'reviews':
      return {
        name: String(row.name ?? '').trim(),
        role: toText(row.role),
        text: String(row.text ?? '').trim(),
        avatar_url: toText(row.avatar_url),
        emoji: toText(row.emoji) ?? '⭐',
        rating: toNum(row.rating, 5),
        featured: toBool(row.featured),
        published: toBool(row.published),
        sort_order: toNum(row.sort_order, 0),
        created_by: userId,
      };

    case 'partners':
      return {
        name: String(row.name ?? '').trim(),
        emoji: toText(row.emoji),
        logo_url: toText(row.logo_url),
        website_url: toText(row.website_url),
        sort_order: toNum(row.sort_order, 0),
        active: toBool(row.active),
        created_by: userId,
      };

    case 'certifications':
      return {
        title: String(row.title ?? '').trim(),
        subtitle: toText(row.subtitle),
        emoji: toText(row.emoji),
        color_from: toText(row.color_from),
        color_to: toText(row.color_to),
        sort_order: toNum(row.sort_order, 0),
        active: toBool(row.active),
        created_by: userId,
      };

    default:
      throw new Error('Unsupported bulk upload table');
  }
}

async function mapBulkRowsWithSlugSupport(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: AllowedTable,
  rows: Record<string, string>[],
  userId: string
) {
  const usedSlugs = new Set<string>();

  const results: BulkRow[] = [];

  for (const row of rows) {
    const mapped = mapBulkRow(table, row, userId);

    if ('slug' in mapped && typeof mapped.slug === 'string' && mapped.slug.trim()) {
      let candidate = mapped.slug;
      let counter = 2;

      for (;;) {
        const alreadyUsedInBatch = usedSlugs.has(candidate);

        let existsInDb = false;
        if (!alreadyUsedInBatch) {
          const { data, error } = await supabase
            .from(table)
            .select('id')
            .eq('slug', candidate)
            .limit(1);

          if (error) throw new Error(error.message);
          existsInDb = Boolean(data && data.length);
        }

        if (!alreadyUsedInBatch && !existsInDb) {
          mapped.slug = candidate;
          usedSlugs.add(candidate);
          break;
        }

        candidate = `${String(mapped.slug)}-${counter}`;
        counter += 1;
      }
    }

    results.push(mapped);
  }

  return results;
}

function validateBulkRow(table: AllowedTable, row: BulkRow, index: number) {
  const rowNumber = index + 2;

  const requireField = (field: string) => {
    const value = row[field];
    if (value === null || value === undefined || value === '') {
      throw new Error(`Row ${rowNumber}: "${field}" is required for ${table}.`);
    }
  };

  switch (table) {
    case 'projects':
    case 'movies':
    case 'materials':
    case 'blogs':
    case 'quizzes':
      requireField('title');
      requireField('slug');
      break;
    case 'announcements':
    case 'notifications':
    case 'certifications':
      requireField('title');
      break;
    case 'partners':
    case 'reviews':
      requireField('name');
      break;
    case 'contacts':
      requireField('name');
      requireField('email');
      break;
  }
}

export async function bulkUploadRowsAction(table: AllowedTable, rows: Record<string, string>[]) {
  if (!ALLOWED_TABLES.includes(table)) throw new Error('Invalid table');

  const { supabase, user } = await requireAdmin();

  if (!Array.isArray(rows) || !rows.length) {
    throw new Error('No rows were provided for bulk upload.');
  }

  const mappedRows = await mapBulkRowsWithSlugSupport(supabase, table, rows, user.id);

  mappedRows.forEach((row, index) => {
    validateBulkRow(table, row, index);
  });

  const chunkSize = 100;

  for (let i = 0; i < mappedRows.length; i += chunkSize) {
    const chunk = mappedRows.slice(i, i + chunkSize);
    const { error } = await supabase.from(table).insert(chunk);
    if (error) {
      throw new Error(error.message);
    }
  }

  switch (table) {
    case 'projects':
      revalidatePath('/');
      revalidatePath('/admin/projects');
      break;
    case 'movies':
      revalidatePath('/movies');
      revalidatePath('/admin/movies');
      break;
    case 'materials':
      revalidatePath('/materials');
      revalidatePath('/admin/materials');
      break;
    case 'blogs':
      revalidatePath('/blogs');
      revalidatePath('/admin/blogs');
      break;
    case 'announcements':
      revalidatePath('/');
      revalidatePath('/admin/announcements');
      break;
    case 'notifications':
      revalidatePath('/materials');
      revalidatePath('/admin/notifications');
      break;
    case 'quizzes':
      revalidatePath('/materials');
      revalidatePath('/admin/quizzes');
      break;
    case 'contacts':
      revalidatePath('/admin/contacts');
      break;
    case 'reviews':
      revalidatePath('/');
      revalidatePath('/admin/reviews');
      break;
    case 'partners':
      revalidatePath('/');
      revalidatePath('/admin/partners');
      break;
    case 'certifications':
      revalidatePath('/');
      revalidatePath('/admin/certifications');
      break;
  }
}