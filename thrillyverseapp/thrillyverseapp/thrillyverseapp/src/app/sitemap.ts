// src/app/sitemap.ts - DYNAMIC SITEMAP
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thrillyverse.com';
  const currentDate = new Date();

  // Static pages
  const routes = [
    '',
    '/materials',
    '/quizzes',
    '/projects',
    '/about',
    '/contact',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
}