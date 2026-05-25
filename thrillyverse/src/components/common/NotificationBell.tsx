'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Notif {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  read: boolean;
}

export function NotificationBell() {
  const [open, setOpen]       = useState(false);
  const [notifs, setNotifs]   = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);
  const panelRef              = useRef<HTMLDivElement>(null);
  const btnRef                = useRef<HTMLButtonElement>(null);

  const unread = notifs.filter(n => !n.read).length;

  /* ── fetch on mount ── */
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('announcements')
          .select('id,title,body,created_at')
          .eq('active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        // merge with local-read state stored in sessionStorage
        const readIds: string[] = JSON.parse(sessionStorage.getItem('tv_read_notifs') ?? '[]');
        setNotifs((data ?? []).map((n: any) => ({ ...n, read: readIds.includes(n.id) })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ── close on outside click ── */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        btnRef.current   && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  /* ── close on Escape ── */
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  function toggleOpen() {
    setOpen(v => !v);
    if (!open) markAllRead();
  }

  function markAllRead() {
    const ids = notifs.map(n => n.id);
    sessionStorage.setItem('tv_read_notifs', JSON.stringify(ids));
    setNotifs(ns => ns.map(n => ({ ...n, read: true })));
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  return (
    <div className="notif-wrap" style={{ position: 'relative' }}>
      <button
        ref={btnRef}
        className="notif-btn"
        onClick={toggleOpen}
        aria-label={`Notifications${unread > 0 ? `, ${unread} unread` : ''}`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span className="notif-badge" aria-hidden="true">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="notif-panel"
          role="region"
          aria-label="Notifications panel"
        >
          <div className="notif-panel-head">
            <span className="notif-panel-title">Notifications</span>
            {unread > 0 && (
              <button className="notif-mark-read" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {loading && (
              <div className="notif-empty">
                <div className="notif-spinner" aria-hidden="true" />
                Loading…
              </div>
            )}
            {!loading && notifs.length === 0 && (
              <div className="notif-empty">
                <Bell size={22} />
                <p>No notifications yet</p>
              </div>
            )}
            {!loading && notifs.map(n => (
              <div key={n.id} className={`notif-item${n.read ? '' : ' notif-item--unread'}`}>
                {!n.read && <span className="notif-dot" aria-hidden="true" />}
                <div className="notif-item-body">
                  <p className="notif-item-title">{n.title}</p>
                  {n.body && <p className="notif-item-desc">{n.body}</p>}
                  <p className="notif-item-date">{formatDate(n.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}