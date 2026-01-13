'use client';

import { useCallback, useMemo, useState } from 'react';
import type { TimeTravelResult } from '@/lib/types';

type TimeTravelState = {
  isActive: boolean;
  speed: number; // multiplier applied to elapsed time
  targetTimeMs: number | null; // absolute wall-clock time when timer should hit 0
};

function parseHHMMToTargetMs(hhmm: string, now: Date): number | null {
  // Accepts "HH:MM"
  const parts = hhmm.split(':').map((x) => Number(x));
  if (parts.length !== 2) return null;
  const [hours, minutes] = parts;

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);

  // If target time is not in the future today, assume tomorrow
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime();
}

export function useTimeTravel() {
  const [state, setState] = useState<TimeTravelState>({
    isActive: false,
    speed: 1,
    targetTimeMs: null,
  });

  const deactivate = useCallback(() => {
    setState({ isActive: false, speed: 1, targetTimeMs: null });
  }, []);

  const activateFromHHMM = useCallback(
    (hhmm: string, remainingMs: number, opts?: { maxSpeed?: number; minSpeed?: number }) : TimeTravelResult => {
      const maxSpeed = opts?.maxSpeed ?? 10;
      const minSpeed = opts?.minSpeed ?? 0.1;

      const now = new Date();
      const targetTimeMs = parseHHMMToTargetMs(hhmm, now);
      if (!targetTimeMs) {
        return { ok: false, error: 'Please enter time in HH:MM format (e.g., 15:05).' };
      }

      const nowMs = now.getTime();
      const realTimeUntilTarget = targetTimeMs - nowMs;

      if (realTimeUntilTarget < 1000) {
        return { ok: false, error: 'Target time is too soon (must be at least 1 second in the future).' };
      }

      // remainingMs needs to fit into real time -> speed multiplier
      const speed = remainingMs / realTimeUntilTarget;

      if (speed > maxSpeed) {
        return { ok: false, error: `Target time is too soon. Timer would need to run faster than ${maxSpeed}x speed.` };
      }
      if (speed < minSpeed) {
        return { ok: false, error: `Target time is too far away. Timer would need to run slower than ${minSpeed}x speed.` };
      }

      setState({ isActive: true, speed, targetTimeMs });
      return { ok: true, speed, targetTimeMs };
    },
    []
  );

  const api = useMemo(
    () => ({
      ...state,
      deactivate,
      activateFromHHMM,
    }),
    [state, deactivate, activateFromHHMM]
  );

  return api;
}
