'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type ThemeMode = 'dark' | 'light';

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('thrillyverse-theme') as ThemeMode | null;
    const current = (document.documentElement.getAttribute('data-theme') as ThemeMode | null) ?? stored ?? 'dark';
    setTheme(current);
    document.documentElement.setAttribute('data-theme', current);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setAnimating(true);
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    window.localStorage.setItem('thrillyverse-theme', next);
    window.setTimeout(() => setAnimating(false), 350);
  };

  return (
    <button
      className="btn btn-ghost btn-sm relative overflow-hidden"
      onClick={toggle}
      type="button"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span
        className="transition-all duration-300 inline-flex items-center justify-center"
        style={{ transform: animating ? 'scale(1.2) rotate(20deg)' : 'none' }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}