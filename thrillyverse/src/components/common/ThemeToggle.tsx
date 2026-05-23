'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') as 'dark' | 'light' | null;
    setTheme(current ?? 'dark');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setAnimating(true);
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      className="btn btn-ghost btn-sm relative overflow-hidden"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span
        className="transition-all duration-300"
        style={{ transform: animating ? 'scale(1.3) rotate(20deg)' : 'none' }}
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      </span>
    </button>
  );
}