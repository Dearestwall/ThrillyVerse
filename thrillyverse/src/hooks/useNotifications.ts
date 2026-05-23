'use client';

import { useEffect, useState } from 'react';

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(2);

  useEffect(() => {
    setUnreadCount(2);
  }, []);

  return { unreadCount };
}