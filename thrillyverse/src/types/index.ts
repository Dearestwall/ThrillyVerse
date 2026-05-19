export interface Project {
  id: string
  title: string
  description: string
  url: string
  logo_url: string
  category: string
  featured: boolean
  created_at?: string
}

export interface Material {
  id: string
  subject: string
  title: string
  description: string
  drive_url: string
  category: string
  featured: boolean
  created_at?: string
}

export interface Movie {
  id: string
  title: string
  language: string
  type: string
  poster_url: string
  status: string
  description: string
  release_year?: number
  featured: boolean
  created_at?: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_url: string
  category: string
  published: boolean
  created_at?: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at?: string
}

export interface HomepageSettings {
  announcement_enabled: undefined
  seo_title: string
  seo_description: string
  seo_keywords: any
  featured_projects_title: string
  featured_materials_title: string
  featured_movies_title: string
  featured_blogs_title: string
  hero_badge: any
  hero_image_url: any
  secondary_cta_text: any
  secondary_cta_url: any
  id: string
  hero_title: string
  hero_subtitle: string
  hero_cta_text: string
  hero_cta_url: string
  announcement: string
  updated_at?: string
}