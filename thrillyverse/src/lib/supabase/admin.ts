'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const SAFE_TABLES = new Set([
  'announcements',
  'blogs',
  'certifications',
  'contacts',
  'materials',
  'movies',
  'notifications',
  'partners',
  'projects',
  'quizzes',
  'reviews',
]);

function assertTable(table: string) {
  if (!SAFE_TABLES.has(table)) {
    throw new Error(`Unsafe table: ${table}`);
  }
}

function revalidateMany(paths: string[] = []) {
  paths.filter(Boolean).forEach((path) => revalidatePath(path));
}

async function patchBoolean(table: string, id: string, field: string, value: boolean, paths: string[] = []) {
  assertTable(table);
  const supabase = createClient();
  const { error } = await supabase.from(table).update({ [field]: value }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidateMany(paths);
  return { ok: true };
}

export async function deleteRowAction(table: string, id: string, paths: string[] = []) {
  assertTable(table);
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateMany(paths);
  return { ok: true };
}

export async function bulkDeleteRowsAction(table: string, ids: string[], paths: string[] = []) {
  assertTable(table);
  if (!ids.length) return { ok: true };
  const supabase = createClient();
  const { error } = await supabase.from(table).delete().in('id', ids);
  if (error) throw new Error(error.message);
  revalidateMany(paths);
  return { ok: true, count: ids.length };
}

export async function bulkPatchRowsAction(table: string, ids: string[], patch: Record<string, unknown>, paths: string[] = []) {
  assertTable(table);
  if (!ids.length) return { ok: true };
  const supabase = createClient();
  const { error } = await supabase.from(table).update(patch).in('id', ids);
  if (error) throw new Error(error.message);
  revalidateMany(paths);
  return { ok: true, count: ids.length };
}

export async function bulkUpsertRowsAction(
  table: string,
  rows: Record<string, unknown>[],
  paths: string[] = [],
  conflictKeys: string[] = ['id']
) {
  assertTable(table);
  if (!rows.length) return { ok: true, count: 0 };
  const supabase = createClient();
  const cleaned = rows.map((row) => {
    const next = Object.fromEntries(Object.entries(row).filter(([, value]) => value !== ''));
    if ('id' in next && !next.id) delete next.id;
    return next;
  });
  const { error } = await supabase.from(table).upsert(cleaned as any[], { onConflict: conflictKeys.join(',') });
  if (error) throw new Error(error.message);
  revalidateMany(paths);
  return { ok: true, count: cleaned.length };
}

export async function toggleAnnouncementActiveAction(id: string, active: boolean) {
  return patchBoolean('announcements', id, 'active', active, ['/', '/admin/announcements']);
}

export async function toggleBlogPublishedAction(id: string, published: boolean) {
  return patchBoolean('blogs', id, 'published', published, ['/blogs', '/admin/blogs']);
}

export async function toggleCertificationActiveAction(id: string, active: boolean) {
  return patchBoolean('certifications', id, 'active', active, ['/', '/admin/certifications']);
}

export async function toggleContactReadAction(id: string, read: boolean) {
  return patchBoolean('contacts', id, 'read', read, ['/admin/contacts']);
}

export async function toggleNotificationActiveAction(id: string, isActive: boolean) {
  return patchBoolean('notifications', id, 'is_active', isActive, ['/', '/admin/notifications']);
}

export async function togglePartnerActiveAction(id: string, active: boolean) {
  return patchBoolean('partners', id, 'active', active, ['/', '/admin/partners']);
}

export async function toggleQuizPublishedAction(id: string, published: boolean) {
  return patchBoolean('quizzes', id, 'published', published, ['/quizzes', '/admin/quizzes']);
}

export async function toggleReviewPublishedAction(id: string, published: boolean) {
  return patchBoolean('reviews', id, 'published', published, ['/', '/admin/reviews']);
}