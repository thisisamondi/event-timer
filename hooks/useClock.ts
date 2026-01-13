'use client';

import { useEffect, useState } from 'react';

export function useClock(tickMs: number = 1000) {
  const [clockTime, setClockTime] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setClockTime(new Date()), tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);

  return clockTime;
}
