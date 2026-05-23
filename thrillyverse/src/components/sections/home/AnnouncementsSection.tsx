'use client';

import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import type { Announcement } from '@/types';

export function AnnouncementsSection({ announcements }: { announcements: Announcement[] }) {
  if (!announcements.length) return null;

  return (
    <section id="announcements" className="pb-8">
      <div className="container-default space-y-4">
        {announcements.map((item, i) => (
          <div
            key={item.id}
            className="announcement-banner section-reveal"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="announcement-icon">
              <Megaphone size={16} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {item.badge && <span className="badge badge-primary">{item.badge}</span>}
                <p className="font-bold text-sm">{item.title}</p>
              </div>
              {item.body && <p className="text-sm text-text-muted leading-relaxed">{item.body}</p>}
            </div>
            {item.cta_url && item.cta_label && (
              <Link href={item.cta_url} className="btn btn-secondary btn-sm flex-shrink-0">
                {item.cta_label} →
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
