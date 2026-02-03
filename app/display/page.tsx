"use client";

import { useEffect, useState } from "react";
import DisplayView from "@/components/views/DisplayView";
import type { DisplayMode } from "@/lib/types";

/* ================= TIMER SHARED STATE ================= */

type SharedTimerState = {
  startTs: number | null;
  durationMs: number;
  offsetMs: number;
  running: boolean;
};

const STORAGE_KEY = "clockd:timer";
const channel = new BroadcastChannel("clockd-timer");

const EMPTY_TIMER: SharedTimerState = {
  startTs: null,
  durationMs: 0,
  offsetMs: 0,
  running: false,
};

function safeLoadTimer(): SharedTimerState {
  if (typeof window === "undefined") return EMPTY_TIMER;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return EMPTY_TIMER;
  try {
    return JSON.parse(raw);
  } catch {
    return EMPTY_TIMER;
  }
}

/* ================= PAGE ================= */

export default function DisplayPage() {
  const [timer, setTimer] = useState<SharedTimerState>(EMPTY_TIMER);
  const [now, setNow] = useState(Date.now());

  // load + sync
  useEffect(() => {
    setTimer(safeLoadTimer());

    channel.onmessage = (e) => setTimer(e.data);
    return () => channel.close();
  }, []);

  // tick
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);

  const remainingMs =
    timer.running && timer.startTs
      ? timer.durationMs - (now - timer.startTs) + timer.offsetMs
      : 0;

  return (
    <DisplayView
      mode={"countdown" as DisplayMode}
      remainingMs={remainingMs}
      isNegative={remainingMs < 0}
      clockTime={new Date()}
      message=""
      messageVisible={false}
      timeTravelActive={false}
      timeTravelSpeed={1}
      timeTravelTargetMs={null}
    />
  );
}
