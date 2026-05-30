'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  SunMedium,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

type Props = {
  title?: string;
  subtitle?: string;
  desktopCollapsed?: boolean;
  onToggleDesktop?: () => void;
  onOpenMobile?: () => void;
};

const pageMetaMap: Record<string, { title: string; subtitle: string }> = {
  '/admin': {
    title: 'Dashboard',
    subtitle:
      'Manage content, metrics, and the full platform from one place.',
  },
  '/admin/movies': {
    title: 'Movies',
    subtitle: 'Edit featured movies, metadata, and release visibility.',
  },
  '/admin/materials': {
    title: 'Materials',
    subtitle:
      'Manage notes, PDFs, subjects, classes, and premium resources.',
  },
  '/admin/blogs': {
    title: 'Blogs',
    subtitle: 'Create, update, and publish blog posts for ThrillyVerse.',
  },
  '/admin/quizzes': {
    title: 'Quizzes',
    subtitle: 'Control question sets, categories, and quiz publishing.',
  },
  '/admin/announcements': {
    title: 'Announcements',
    subtitle:
      'Manage banners, CTAs, active messages, and priorities.',
  },
  '/admin/notifications': {
    title: 'Notifications',
    subtitle: 'Send platform updates and important user-facing alerts.',
  },
  '/admin/projects': {
    title: 'Projects',
    subtitle: 'Showcase tools, experiments, and featured utilities.',
  },
  '/admin/reviews': {
    title: 'Reviews',
    subtitle: 'Manage testimonials, ratings, and display order.',
  },
  '/admin/partners': {
    title: 'Partners',
    subtitle: 'Update partner logos, names, and links.',
  },
  '/admin/certifications': {
    title: 'Certifications',
    subtitle: 'Showcase achievements, issuers, and verification links.',
  },
  '/admin/contacts': {
    title: 'Contacts',
    subtitle: 'Review contact form messages and mark them as read.',
  },
  '/admin/settings': {
    title: 'Settings',
    subtitle: 'Control user access, roles, and admin preferences.',
  },
};

export default function AdminTopbarControls({
  title,
  subtitle,
  desktopCollapsed = false,
  onToggleDesktop,
  onOpenMobile,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [loggingOut, setLoggingOut] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const meta = useMemo(() => {
    if (title || subtitle) {
      return {
        title: title ?? 'Admin Panel',
        subtitle: subtitle ?? 'Manage content, updates, and platform data.',
      };
    }
    return (
      pageMetaMap[pathname] ?? {
        title: 'Admin Panel',
        subtitle: 'Manage content, updates, and platform data.',
      }
    );
  }, [pathname, subtitle, title]);

  useEffect(() => {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme');
    if (current === 'light' || current === 'dark') {
      setTheme(current);
      return;
    }
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const nextTheme = prefersDark ? 'dark' : 'light';
    root.setAttribute('data-theme', nextTheme);
    setTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const next = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    setTheme(next);
    try {
      window.localStorage.setItem('tv-theme', next);
    } catch {}
  };

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

  return (
    <header className="admin-topbar-controls" role="banner">
      {/* Left: hamburger / toggle + title */}
      <div className="admin-topbar-left">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="admin-topbar-icon-btn admin-mobile-toggle"
          aria-label="Open menu"
          title="Open menu"
          onClick={onOpenMobile}
        >
          <Menu size={18} />
        </button>

        {/* Desktop sidebar toggle (topbar version) */}
        <button
          type="button"
          className="admin-topbar-icon-btn admin-desktop-toggle-top"
          aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={onToggleDesktop}
        >
          {desktopCollapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>

        {/* Page title group */}
        <div className="admin-topbar-title-group">
          <div className="admin-topbar-kicker">
            <Sparkles size={12} />
            <span>ThrillyVerse Control Center</span>
          </div>
          <h1 className="admin-topbar-title">{meta.title}</h1>
          <p className="admin-topbar-subtitle">{meta.subtitle}</p>
        </div>
      </div>

      {/* Right: theme toggle + logout */}
      <div className="admin-topbar-right">
        {/* Theme toggle — always visible, never hidden */}
        <button
          type="button"
          className="admin-topbar-icon-btn admin-theme-toggle"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? (
            <SunMedium size={16} />
          ) : (
            <Moon size={16} />
          )}
        </button>

        {/* Logout */}
        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}
          aria-label="Logout"
          title="Logout"
        >
          <LogOut size={16} />
          <span className="admin-logout-label">
            {loggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button>
      </div>
    </header>
  );
}