export type SharedTimerState = {
  startTs: number | null; // Date.now()
  durationMs: number;
  offsetMs: number; // live +/-
  running: boolean;
};

const KEY = "clockd:timer";

export function loadTimer(): SharedTimerState {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    return {
      startTs: null,
      durationMs: 0,
      offsetMs: 0,
      running: false,
    };
  }
  return JSON.parse(raw);
}

export function saveTimer(state: SharedTimerState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
