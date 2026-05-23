'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useState } from 'react';

export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [ringing, setRinging] = useState(false);

  const handleClick = () => {
    setRinging(true);
    setTimeout(() => setRinging(false), 600);
  };

  return (
    <button
      className="btn btn-ghost btn-sm relative"
      aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
      onClick={handleClick}
    >
      <Bell
        size={16}
        className={ringing ? 'notif-ring' : ''}
      />
      {unreadCount > 0 && (
        <span
          className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[10px] flex items-center justify-center text-white font-bold scale-in"
          style={{ background: 'var(--color-notification)' }}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}