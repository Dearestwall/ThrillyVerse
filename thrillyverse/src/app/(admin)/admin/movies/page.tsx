import { createClient } from '@/lib/supabase/server';
import MoviesAdminTable from '@/components/sections/admin/MoviesAdminTable';

export default async function AdminMoviesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('movies')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <MoviesAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}