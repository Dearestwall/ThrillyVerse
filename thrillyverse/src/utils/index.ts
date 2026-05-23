import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(text: string) {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function formatDate(date: string) {
  return format(new Date(date), 'MMM d, yyyy');
}

export function timeAgo(date: string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function truncate(text: string, len: number) {
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

export const BOARDS = ['ICSE', 'CBSE', 'ISC', 'State', 'Other'] as const;
export const CLASSES = ['6', '7', '8', '9', '10', '11', '12', 'Other'] as const;
export const RESOURCE_TYPES = ['notes', 'pdf', 'video', 'link', 'image', 'other'] as const;
export const MOVIE_CATEGORIES = ['Action', 'Drama', 'Comedy', 'Thriller', 'Sci-Fi', 'Horror', 'Romance', 'Documentary', 'Animation', 'Other'] as const;