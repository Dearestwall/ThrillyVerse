'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminFrame from '@/components/layout/AdminFrame';

const publicAdminPaths = ['/admin/login'];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function check() {
      if (publicAdminPaths.includes(pathname)) {
        if (mounted) {
          setAllowed(false);
          setReady(true);
        }
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error || !data.session) {
          if (mounted) {
            setAllowed(false);
            setReady(true);
          }
          router.replace('/admin/login');
          return;
        }

        if (mounted) {
          setAllowed(true);
          setReady(true);
        }
      } catch {
        if (mounted) {
          setAllowed(false);
          setReady(true);
        }
        router.replace('/admin/login');
      }
    }

    check();

    return () => {
      mounted = false;
    };
  }, [pathname, router, supabase]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-grid-bg">
        <div className="card p-8 w-full max-w-md text-center page-enter">
          <p className="text-sm text-text-muted">Checking admin session...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login') return <>{children}</>;

  if (!allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center auth-grid-bg">
        <div className="card p-8 w-full max-w-md text-center page-enter">
          <p className="text-sm text-text-muted">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <AdminFrame>{children}</AdminFrame>;
}