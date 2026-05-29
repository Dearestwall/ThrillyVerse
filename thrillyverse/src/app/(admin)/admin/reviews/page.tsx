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
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Reviews</h1>
          <p className="admin-page-subtitle">
            Manage testimonials, ratings, featured feedback, and homepage ordering.
          </p>
        </div>
      </div>

      <ReviewsAdminTable initialReviews={(data ?? []) as any} />
    </div>
  );
}