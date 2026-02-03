import { useEffect, useState } from "react";
import { loadTimer, saveTimer } from "@/lib/sharedTimer";
import { timerChannel } from "@/lib/timerChannel";

export function useSharedTimer() {
  const [state, setState] = useState(loadTimer);

  // receive updates from other tabs
  useEffect(() => {
    timerChannel.onmessage = (e) => {
      setState(e.data);
      saveTimer(e.data);
    };
    return () => timerChannel.close();
  }, []);

  const update = (next: typeof state) => {
    setState(next);
    saveTimer(next);
    timerChannel.postMessage(next);
  };

  const start = (durationMs: number) => {
    update({
      startTs: Date.now(),
      durationMs,
      offsetMs: 0,
      running: true,
    });
  };

  const addTime = (deltaMs: number) => {
    update({
      ...state,
      offsetMs: state.offsetMs + deltaMs,
    });
  };

  const remainingMs =
    state.running && state.startTs
      ? state.durationMs - (Date.now() - state.startTs) + state.offsetMs
      : state.durationMs + state.offsetMs;

  return {
    state,
    remainingMs,
    start,
    addTime,
  };
}
