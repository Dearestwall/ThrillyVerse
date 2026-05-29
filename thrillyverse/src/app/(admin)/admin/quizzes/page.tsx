import { createClient } from '@/lib/supabase/server';
import QuizzesAdminTable from '@/components/sections/admin/QuizzesAdminTable';

export default async function AdminQuizzesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('quizzes').select('*').order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Quizzes</h1>
          <p className="admin-page-subtitle">Manage study quizzes, difficulty, and publishing.</p>
        </div>
      </div>
      <QuizzesAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}