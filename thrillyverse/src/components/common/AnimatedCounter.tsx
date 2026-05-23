'use client';

import { useEffect, useState } from 'react';

export function AnimatedCounter({ value }: { value: number }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 40));
    const id = setInterval(() => {
      current = Math.min(current + step, value);
      setN(current);
      if (current >= value) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [value]);

  return <span className="tabular-nums">{n}</span>;
}
