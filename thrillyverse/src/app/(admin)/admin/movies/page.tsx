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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Movies</h1>
          <p className="admin-page-subtitle">
            Manage featured films, links, posters, metadata, and publishing status.
          </p>
        </div>
      </div>

      <MoviesAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}