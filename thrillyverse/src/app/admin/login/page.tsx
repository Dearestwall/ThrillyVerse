import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminLoginClient } from './AdminLoginClient';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center auth-grid-bg">
          <Loader2 size={24} className="animate-spin text-text-muted" />
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}