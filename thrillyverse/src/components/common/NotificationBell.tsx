'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Bell } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Notif {
  id: string;
  title: string;
  body: string | null;
  created_at: string;
  read: boolean;
}

interface PanelPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(false);

  const [panelPosition, setPanelPosition] = useState<PanelPosition>({
    top: 70,
    left: 12,
    width: 360,
    maxHeight: 480,
  });

  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const unread = notifs.filter((n) => !n.read).length;

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

        const readIds: string[] = JSON.parse(
          sessionStorage.getItem('tv_read_notifs') ?? '[]'
        );

        setNotifs(
          (data ?? []).map((n: any) => ({
            ...n,
            read: readIds.includes(n.id),
          }))
        );
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /* ── keep panel inside viewport ── */
  const updatePanelPosition = () => {
    const button = btnRef.current;

    if (!button) return;

    const rect = button.getBoundingClientRect();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Panel width:
    // - Maximum 360px on larger screens
    // - Always leaves at least 12px space on both sides on mobile
    const width = Math.min(360, Math.max(220, viewportWidth - 24));

    // Desired maximum panel height
    const desiredMaxHeight = Math.min(480, viewportHeight - 24);

    // Prefer opening below the bell
    let top = rect.bottom + 8;

    // Keep the panel from going below the viewport.
    // If there isn't enough space below, try opening above the bell.
    if (top + desiredMaxHeight > viewportHeight - 12) {
      const aboveTop = rect.top - desiredMaxHeight - 8;

      if (aboveTop >= 12) {
        top = aboveTop;
      } else {
        top = 12;
      }
    }

    // Final safety check for very small screens
    const maxHeight = Math.max(
      140,
      Math.min(
        desiredMaxHeight,
        viewportHeight - top - 12
      )
    );

    // Align the panel's right edge with the bell,
    // then clamp it so it can never leave the viewport.
    let left = rect.right - width;

    left = Math.max(12, left);
    left = Math.min(left, viewportWidth - width - 12);

    setPanelPosition({
      top,
      left,
      width,
      maxHeight,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;

    const update = () => {
      window.requestAnimationFrame(updatePanelPosition);
    };

    update();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);

    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  /* ── close on outside click ── */
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node;

      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        btnRef.current &&
        !btnRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handler);
    }

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [open]);

  /* ── close on Escape ── */
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('keydown', handler);
    }

    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [open]);

  function toggleOpen() {
    setOpen((value) => !value);

    if (!open) {
      markAllRead();
    }
  }

  function markAllRead() {
    const ids = notifs.map((n) => n.id);

    sessionStorage.setItem(
      'tv_read_notifs',
      JSON.stringify(ids)
    );

    setNotifs((ns) =>
      ns.map((n) => ({
        ...n,
        read: true,
      }))
    );
  }

  function formatDate(iso: string) {
    const d = new Date(iso);

    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  // Give the header a little room so the notification list
  // gets the majority of the available viewport height.
  const listMaxHeight = Math.max(
    90,
    panelPosition.maxHeight - 58
  );

  return (
    <div
      className="notif-wrap"
      style={{
        position: 'relative',
      }}
    >
      <button
        ref={btnRef}
        className="notif-btn"
        onClick={toggleOpen}
        aria-label={`Notifications${
          unread > 0 ? `, ${unread} unread` : ''
        }`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Bell size={17} />

        {unread > 0 && (
          <span
            className="notif-badge"
            aria-hidden="true"
          >
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
          style={{
            position: 'fixed',
            top: `${panelPosition.top}px`,
            left: `${panelPosition.left}px`,
            width: `${panelPosition.width}px`,
            maxWidth: 'calc(100vw - 24px)',
            maxHeight: `${panelPosition.maxHeight}px`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            zIndex: 9999,
          }}
        >
          <div className="notif-panel-head">
            <span className="notif-panel-title">
              Notifications
            </span>

            {unread > 0 && (
              <button
                type="button"
                className="notif-mark-read"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div
            className="notif-list"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              maxHeight: `${listMaxHeight}px`,
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {loading && (
              <div className="notif-empty">
                <div
                  className="notif-spinner"
                  aria-hidden="true"
                />
                Loading…
              </div>
            )}

            {!loading && notifs.length === 0 && (
              <div className="notif-empty">
                <Bell size={22} />

                <p>No notifications yet</p>
              </div>
            )}

            {!loading &&
              notifs.map((n) => (
                <div
                  key={n.id}
                  className={`notif-item${
                    n.read
                      ? ''
                      : ' notif-item--unread'
                  }`}
                >
                  {!n.read && (
                    <span
                      className="notif-dot"
                      aria-hidden="true"
                    />
                  )}

                  <div className="notif-item-body">
                    <p className="notif-item-title">
                      {n.title}
                    </p>

                    {n.body && (
                      <p className="notif-item-desc">
                        {n.body}
                      </p>
                    )}

                    <p className="notif-item-date">
                      {formatDate(n.created_at)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
