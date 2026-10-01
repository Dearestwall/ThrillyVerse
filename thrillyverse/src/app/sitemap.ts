import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

const BASE_URL = 'https://thrillyverse.vercel.app';

// Revalidate sitemap cache every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Fetch slugs from all tables concurrently
  const [blogsRes, projectsRes, moviesRes, materialsRes] = await Promise.all([
    supabase.from('blogs').select('slug, updated_at, created_at'),
    supabase.from('projects').select('slug, updated_at, created_at'),
    supabase.from('movies').select('slug, updated_at, created_at'),
    supabase.from('materials').select('slug, updated_at, created_at'),
  ]);

  const blogEntries: MetadataRoute.Sitemap = (blogsRes.data || []).map((item) => ({
    url: `${BASE_URL}/blogs/${item.slug}`,
    lastModified: new Date(item.updated_at || item.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const projectEntries: MetadataRoute.Sitemap = (projectsRes.data || []).map((item) => ({
    url: `${BASE_URL}/projects/${item.slug}`,
    lastModified: new Date(item.updated_at || item.created_at || Date.now()),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const movieEntries: MetadataRoute.Sitemap = (moviesRes.data || []).map((item) => ({
    url: `${BASE_URL}/movies/${item.slug}`,
    lastModified: new Date(item.updated_at || item.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const materialEntries: MetadataRoute.Sitemap = (materialsRes.data || []).map((item) => ({
    url: `${BASE_URL}/materials/${item.slug}`,
    lastModified: new Date(item.updated_at || item.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/materials`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  return [
    ...staticRoutes,
    ...blogEntries,
    ...projectEntries,
    ...movieEntries,
    ...materialEntries,
  ];
}
