import { createClient } from '@/lib/supabase/server';
import { QuizzesAdminTable } from '@/components/sections/admin/admin-tables';
import { CreateQuizForm } from '@/components/sections/admin/forms';
import { SectionHeading } from '@/components/common/SectionHeading';

export default async function AdminQuizzesPage() {
  const supabase = createClient();
  const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-8 page-enter">
      <SectionHeading eyebrow="Education" title="Quizzes" description="Create board-wise, class-wise quizzes for students." />
      <div className="card p-6 section-reveal">
        <h2 className="font-semibold mb-4">Create New Quiz</h2>
        <CreateQuizForm />
      </div>
      <div className="card p-6 section-reveal">
        <QuizzesAdminTable initialData={data ?? []} />
      </div>
    </div>
  );
}

