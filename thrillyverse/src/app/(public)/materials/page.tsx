import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MaterialsContent } from '@/components/sections/materials/MaterialsContent';

export const metadata: Metadata = {
  title: 'Study Materials â€” ThrillyVerse',
  description: 'Board-wise resources, quizzes, and student updates.',
};

export default async function MaterialsPage() {
  const supabase = createClient();
  const [{ data: materials }, { data: quizzes }, { data: notifications }] = await Promise.all([
    supabase.from('materials').select('*').eq('published', true).order('sort_order'),
    supabase.from('quizzes').select('*').eq('published', true),
    supabase.from('notifications').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(10),
  ]);

  return (
    <div className="page-wrapper">
      <div className="page-hero materials-hero">
        <div className="page-hero-inner">
          <div className="page-eyebrow">Education</div>
          <h1 className="page-title">Study Materials</h1>
          <p className="page-subtitle">Board-wise resources, quizzes, and student updates.</p>
        </div>
        <div className="page-hero-glow page-hero-glow--emerald" />
      </div>
      <div className="container py-10">
        <MaterialsContent
          materials={(materials ?? []) as never}
          quizzes={(quizzes ?? []) as never}
          notifications={(notifications ?? []) as never}
        />
      </div>
    </div>
  );
}
