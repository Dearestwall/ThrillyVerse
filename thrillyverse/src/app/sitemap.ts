import type { MetadataRoute } from 'next';

const BASE_URL = 'https://thrillyverse.vercel.app';

// Set ISR revalidation interval for the sitemap (e.g., revalidate every hour/day)
export const revalidate = 3600; 

// Helper function to fetch slugs from your API / DB
async function getSlugs(endpoint: string): Promise<Array<{ slug: string; updatedAt?: string }>> {
  try {
    const res = await fetch(`https://api.thrillyverse.com/${endpoint}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error(`Failed to fetch slugs for ${endpoint}:`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Fetch dynamic data for all dynamic routes in parallel
  const [movies, materials, blogs, projects] = await Promise.all([
    getSlugs('movies'),
    getSlugs('materials'),
    getSlugs('blogs'),
    getSlugs('projects'),
  ]);

  // 2. Map dynamic slugs to Sitemap entries
  const movieEntries: MetadataRoute.Sitemap = movies.map((item) => ({
    url: `${BASE_URL}/movies/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const materialEntries: MetadataRoute.Sitemap = materials.map((item) => ({
    url: `${BASE_URL}/materials/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = blogs.map((item) => ({
    url: `${BASE_URL}/blogs/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((item) => ({
    url: `${BASE_URL}/projects/${item.slug}`,
    lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // 3. Define static routes
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

  // 4. Merge all entries
  return [
    ...staticRoutes,
    ...movieEntries,
    ...materialEntries,
    ...blogEntries,
    ...projectEntries,
  ];
}
