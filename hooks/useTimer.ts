'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TimerStatus } from '@/lib/types';

type TimeTravelController = {
  isActive: boolean;
  speed: number;
  targetTimeMs: number | null;
  deactivate: () => void;
};

type UseTimerOptions = {
  allowNegative: boolean;
  timeTravel?: TimeTravelController;
};

export function useTimer(options: UseTimerOptions) {
  const { allowNegative } = options;

  const [status, setStatus] = useState<TimerStatus>('idle');
  const [remainingMs, setRemainingMs] = useState<number>(5 * 60 * 1000);
  const [initialDurationMs, setInitialDurationMs] = useState<number>(5 * 60 * 1000);
  const [isNegative, setIsNegative] = useState<boolean>(false);

  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(Date.now());

  // Refs to avoid stale closures inside RAF loop
  const statusRef = useRef<TimerStatus>(status);
  const remainingRef = useRef<number>(remainingMs);
  const initialDurationRef = useRef<number>(initialDurationMs);
  const allowNegativeRef = useRef<boolean>(allowNegative);

  const timeTravelRef = useRef<TimeTravelController | undefined>(options.timeTravel);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    remainingRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    initialDurationRef.current = initialDurationMs;
  }, [initialDurationMs]);

  useEffect(() => {
    allowNegativeRef.current = allowNegative;
  }, [allowNegative]);

  useEffect(() => {
    timeTravelRef.current = options.timeTravel;
  }, [options.timeTravel]);

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (statusRef.current !== 'running') return;

    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;

    const tt = timeTravelRef.current;
    const speed = tt?.isActive ? tt.speed : 1;

    let newRemaining = remainingRef.current - elapsed * speed;

    // If time-travel is active and we've reached/passed the target wall-clock time,
    // force timer to 0 and deactivate time-travel.
    if (tt?.isActive && tt.targetTimeMs && now >= tt.targetTimeMs) {
      newRemaining = 0;
      tt.deactivate();
    }

    const negative = newRemaining < 0;

    if (negative && !allowNegativeRef.current) {
      newRemaining = 0;
      setStatus('completed');
      statusRef.current = 'completed';
      stopRaf();
    }

    remainingRef.current = newRemaining;
    lastUpdateRef.current = now;

    setRemainingMs(newRemaining);
    setIsNegative(negative);

    rafRef.current = requestAnimationFrame(tick);
  }, [stopRaf]);

  useEffect(() => {
    if (status === 'running') {
      lastUpdateRef.current = Date.now();
      rafRef.current = requestAnimationFrame(tick);
      return () => stopRaf();
    }
    // Stop RAF on pause/idle/completed
    stopRaf();
  }, [status, tick, stopRaf]);

  const start = useCallback((durationMs: number) => {
    const now = Date.now();
    setInitialDurationMs(durationMs);
    setRemainingMs(durationMs);
    setIsNegative(false);

    initialDurationRef.current = durationMs;
    remainingRef.current = durationMs;
    statusRef.current = 'running';
    lastUpdateRef.current = now;

    setStatus('running');
  }, []);

  const pause = useCallback(() => {
    if (statusRef.current !== 'running') return;
    statusRef.current = 'paused';
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (statusRef.current !== 'paused') return;
    statusRef.current = 'running';
    lastUpdateRef.current = Date.now();
    setStatus('running');
  }, []);

  const pauseResume = useCallback(() => {
    if (statusRef.current === 'running') pause();
    else if (statusRef.current === 'paused') resume();
  }, [pause, resume]);

  const reset = useCallback(() => {
    const dur = initialDurationRef.current;
    setRemainingMs(dur);
    remainingRef.current = dur;

    setIsNegative(false);
    statusRef.current = 'idle';
    setStatus('idle');

    const tt = timeTravelRef.current;
    if (tt?.isActive) tt.deactivate();
  }, []);

  const adjustTime = useCallback((deltaMs: number) => {
    const newRemaining = remainingRef.current + deltaMs;
    remainingRef.current = newRemaining;
    setRemainingMs(newRemaining);
    setIsNegative(newRemaining < 0);
  }, []);

  return {
    status,
    remainingMs,
    initialDurationMs,
    isNegative,
    start,
    pause,
    resume,
    pauseResume,
    reset,
    adjustTime,
  };
}
