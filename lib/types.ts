export type View = 'setup' | 'display' | 'moderator';

export type DisplayMode = 'countdown' | 'clock' | 'both';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export type TimeTravelResult =
  | { ok: true; speed: number; targetTimeMs: number }
  | { ok: false; error: string };
