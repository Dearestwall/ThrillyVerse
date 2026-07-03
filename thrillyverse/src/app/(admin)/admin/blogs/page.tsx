import { createClient } from '@/lib/supabase/server';
import BlogsAdminTable from '@/components/sections/admin/BlogsAdminTable';


export default async function AdminBlogsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <BlogsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}