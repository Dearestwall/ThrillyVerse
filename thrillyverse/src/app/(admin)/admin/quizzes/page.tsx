import { createClient } from '@/lib/supabase/server';
import QuizzesAdminTable from '@/components/sections/admin/QuizzesAdminTable';

export default async function AdminQuizzesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('quizzes')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <QuizzesAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}