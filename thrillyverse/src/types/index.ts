export type UserRole = 'super_admin' | 'editor' | 'viewer';
export type Board = 'ICSE' | 'CBSE' | 'ISC' | 'State' | 'Other';
export type ResourceType = 'notes' | 'pdf' | 'video' | 'link' | 'image' | 'other';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type NotifType = 'info' | 'success' | 'warning' | 'alert' | 'new_material' | 'new_movie' | 'new_blog' | 'quiz';

export interface Announcement {
  message: string;
  type: string;
  published: any;
  id: string;
  title: string;
  body: string | null;
  cta_label: string | null;
  cta_url: string | null;
  badge: string | null;
  priority: number;
  active: boolean;
  published_at: string;
}
export interface Review {
  id: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  text: string;
  rating: number;
  emoji: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export interface Partner {
  id: string;
  name: string;
  emoji: string | null;
  logo_url: string | null;
  sort_order: number;
  active: boolean;
}

export interface Certification {
  id: string;
  title: string;
  subtitle: string | null;
  emoji: string | null;
  sort_order: number;
  active: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  tech_stack: string[];
  link: string | null;
  github_url: string | null;
  featured: boolean;
  sort_order: number;
  status: 'published' | 'draft' | 'archived';
}

export interface Movie {
  duration: undefined;
  language: undefined;
  id: string;
  title: string;
  slug: string;
  description: string | null;
  poster_url: string | null;
  trailer_url: string | null;
  movie_link: string | null;
  download_link: string | null;
  category: string | null;
  year: number | null;
  rating: string | null;
  tags: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export interface Material {
  id: string;
  title: string;
  slug: string;
  board: Board;
  class_level: string;
  subject: string;
  topic: string | null;
  description: string | null;
  cover_image: string | null;
  resource_type: ResourceType;
  resource_link: string | null;
  download_link: string | null;
  file_size: string | null;
  is_premium: boolean;
  featured: boolean;
  published: boolean;
  view_count: number;
  sort_order: number;
}

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  board: string | null;
  class_level: string | null;
  subject: string | null;
  time_limit: number;
  difficulty: Difficulty;
  published: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string | null;
  tags: string[];
  read_time: number;
  featured: boolean;
  published: boolean;
  published_at: string | null;
  view_count: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotifType;
  target_url: string | null;
  audience: 'all' | 'students' | 'viewers';
  is_active: boolean;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  read: boolean;
  created_at: string;
}

export interface Profile {
  is_active: any;
  is_active: any;
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
}