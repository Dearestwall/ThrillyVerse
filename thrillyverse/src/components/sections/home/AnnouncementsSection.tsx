'use client';

import Link from 'next/link';
import { Megaphone, X } from 'lucide-react';
import { useState } from 'react';
import type { Announcement } from '@/types';

export function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const visible = announcements.filter(a => !dismissed.has(a.id));
  if (!visible.length) return null;

  return (
    <div id="announcements" className="announcements-wrap">
      <div className="container-default space-y-2 py-3">
        {visible.map((item, i) => (
          <div
            key={item.id}
            className="announcement-banner section-reveal"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="announcement-icon">
              <Megaphone size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                {item.badge && <span className="badge badge-primary">{item.badge}</span>}
                <p className="font-bold text-sm truncate">{item.title}</p>
              </div>
              {item.body && <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{item.body}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {item.cta_url && item.cta_label && (
                <Link href={item.cta_url} className="btn btn-secondary btn-sm text-xs whitespace-nowrap">
                  {item.cta_label} →
                </Link>
              )}
              <button
                onClick={() => setDismissed(s => new Set([...s, item.id]))}
                className="w-6 h-6 rounded-full flex items-center justify-center hover:bg-surface-offset transition-colors"
                aria-label="Dismiss announcement"
              >
                <X size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}