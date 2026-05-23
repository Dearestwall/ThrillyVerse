'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AdminSidebar } from './AdminSidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Menu, X } from 'lucide-react';

const publicAdminPaths = ['/admin/login'];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

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

  return (
    <div className="admin-shell">
      <button
        className="admin-mobile-toggle md:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open admin menu"
      >
        <Menu size={18} />
      </button>

      <div className={`admin-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="md:hidden flex justify-end p-3">
          <button className="btn btn-ghost btn-sm" onClick={() => setMobileSidebarOpen(false)} aria-label="Close admin menu">
            <X size={18} />
          </button>
        </div>
        <AdminSidebar />
      </aside>

      <div className="admin-main-shell">
        <header className="admin-topbar">
          <ThemeToggle />
        </header>
        <main id="main-content" className="admin-content page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}