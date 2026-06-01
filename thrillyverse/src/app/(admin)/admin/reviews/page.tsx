import { createClient } from '@/lib/supabase/server';
import ReviewsAdminTable from '@/components/sections/admin/ReviewsAdminTable';

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('reviews')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  return (
    <div className="admin-page">
      <ReviewsAdminTable initialData={(data ?? []) as any} />
    </div>
  );
}