'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import AdminSidebar from './AdminSidebar';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LogOut, Menu, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';

const publicAdminPaths = ['/admin/login'];

const pageMetaMap: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Dashboard',
    subtitle: 'Manage content, metrics, and platform activity.',
  },
  '/admin/movies': {
    title: 'Movies',
    subtitle: 'Update featured releases, links, status, and visibility.',
  },
  '/admin/materials': {
    title: 'Materials',
    subtitle: 'Manage subjects, notes, downloads, and learning resources.',
  },
  '/admin/blogs': {
    title: 'Blogs',
    subtitle: 'Publish articles, update content, and manage categories.',
  },
  '/admin/quizzes': {
    title: 'Quizzes',
    subtitle: 'Create tests, set difficulty, and organize quiz content.',
  },
  '/admin/announcements': {
    title: 'Announcements',
    subtitle: 'Broadcast important updates and banner content.',
  },
  '/admin/notifications': {
    title: 'Notifications',
    subtitle: 'Send user-facing alerts and platform messages.',
  },
  '/admin/projects': {
    title: 'Projects',
    subtitle: 'Manage apps, tools, links, and featured work.',
  },
  '/admin/reviews': {
    title: 'Reviews',
    subtitle: 'Control testimonials, ratings, and display order.',
  },
  '/admin/partners': {
    title: 'Partners',
    subtitle: 'Manage logos, URLs, and homepage partner listings.',
  },
  '/admin/certifications': {
    title: 'Certifications',
    subtitle: 'Showcase credentials, issuers, and verification links.',
  },
  '/admin/contacts': {
    title: 'Contacts',
    subtitle: 'Read and manage incoming contact requests.',
  },
  '/admin/settings': {
    title: 'Settings',
    subtitle: 'Configure admin access, roles, and preferences.',
  },
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pageMeta = useMemo(() => {
    return (
      pageMetaMap[pathname] ?? {
        title: 'Admin Panel',
        subtitle: 'Manage content, updates, and platform controls.',
      }
    );
  }, [pathname]);

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

  useEffect(() => {
    document.documentElement.classList.toggle('admin-mobile-menu-open', mobileSidebarOpen);
    document.body.classList.toggle('admin-mobile-menu-open', mobileSidebarOpen);

    return () => {
      document.documentElement.classList.remove('admin-mobile-menu-open');
      document.body.classList.remove('admin-mobile-menu-open');
    };
  }, [mobileSidebarOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Logged out successfully');
      router.replace('/admin/login');
      router.refresh();
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

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
    <div className="admin-shell-layout">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div
        className={`admin-sidebar-backdrop ${mobileSidebarOpen ? 'open' : ''}`}
        onClick={() => setMobileSidebarOpen(false)}
      />

      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-mobile-head md:hidden">
          <div className="tv-admin-brand">
            <div className="tv-admin-brand-mark">
              <span className="font-black text-sm">TV</span>
            </div>
            <div className="tv-admin-brand-copy">
              <span className="tv-admin-brand-title">
                <span className="brand-thrilly">Thrilly</span>
                <span className="brand-verse">Verse</span>
              </span>
              <span className="tv-admin-brand-subtitle">Admin Panel</span>
            </div>
          </div>

          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close admin menu"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <AdminSidebar
          mobileOpen={mobileSidebarOpen}
          desktopCollapsed={false}
          onClose={() => setMobileSidebarOpen(false)}
          onToggleDesktop={() => {}}
        />
      </aside>

      <div className="admin-main-shell">
        <header className="admin-topbar enhanced-admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open admin menu"
              type="button"
            >
              <Menu size={18} />
            </button>

            <div className="admin-topbar-title-group">
              <div className="admin-topbar-kicker">
                <Sparkles size={12} />
                <span>ThrillyVerse Control Center</span>
              </div>
              <h1 className="admin-topbar-title">{pageMeta.title}</h1>
              <p className="admin-topbar-subtitle">{pageMeta.subtitle}</p>
            </div>
          </div>

          <div className="admin-topbar-right">
            <ThemeToggle />
            <button
              type="button"
              className="admin-logout-btn"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-label="Logout"
            >
              <LogOut size={16} />
              <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </header>

        <main id="main-content" className="admin-content page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}