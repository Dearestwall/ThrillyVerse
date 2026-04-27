export interface Movie {
  id: string
  title: string
  poster_url: string | null
  description: string | null
  category: 'hindi' | 'punjabi' | 'hollywood' | 'webseries'
  year: number | null
  language: string | null
  quality: string
  movie_links: Record<string, string>
  series_links: Record<string, string>
  is_featured: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Material {
  id: string
  title: string
  description: string | null
  class_level: 'class10' | 'class11'
  subject: string
  stream: string | null
  drive_url: string
  thumbnail_url: string | null
  is_featured: boolean
  download_count: number
  created_at: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string | null
  type: 'update' | 'announcement' | 'premium' | 'telegram'
  is_published: boolean
  created_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string | null
  form_url: string
  subject: string | null
  class_level: string | null
  is_active: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string | null
  logo_url: string | null
  project_url: string
  screenshots: string[]
  sort_order: number
  created_at: string
}

export interface Announcement {
  id: string
  text: string
  is_active: boolean
  created_at: string
}

export interface PushSubscriptionRecord {
  id: string
  endpoint: string
  p256dh: string
  auth: string
  topics: string[]
  created_at: string
}