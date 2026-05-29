import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MaterialsContent } from '@/components/sections/materials/MaterialsContent';
import type { Material, Notification, Quiz } from '@/types';

export const metadata: Metadata = {
  title: 'Study Materials',
  description:
    'Explore board-wise study materials, quizzes, and student updates on ThrillyVerse.',
  alternates: {
    canonical: '/materials',
  },
  openGraph: {
    title: 'Study Materials | ThrillyVerse',
    description:
      'Explore board-wise study materials, quizzes, and student updates on ThrillyVerse.',
    url: '/materials',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Materials | ThrillyVerse',
    description:
      'Explore board-wise study materials, quizzes, and student updates on ThrillyVerse.',
  },
};

export default async function MaterialsPage() {
  const supabase = await createClient();

  const [{ data: materials }, { data: quizzes }, { data: notifications }] =
    await Promise.all([
      supabase
        .from('materials')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('quizzes')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false }),
      supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

  return (
    <div className="page-wrapper">
      <section className="page-hero materials-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Education</div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">
            Board-wise resources, quizzes, and student updates.
          </p>
        </div>
        <div className="page-hero-glow page-hero-glow--emerald" />
      </section>

      <section className="container py-10">
        <MaterialsContent
          materials={(materials ?? []) as Material[]}
          quizzes={(quizzes ?? []) as Quiz[]}
          notifications={(notifications ?? []) as Notification[]}
        />
      </section>
    </div>
  );
}