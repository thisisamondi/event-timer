"use client";

import { useEffect, useState } from "react";
import { SetupView } from "@/components/views/SetupView";
import { Loader } from "@/components/Loader";
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

function saveTimer(state: SharedTimerState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  channel.postMessage(state);
}

function hmsToMs(input: string, fallbackMs: number) {
  const parts = input.split(":").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return fallbackMs;
  return (
    (Math.min(parts[0], 99) * 3600 +
      Math.min(parts[1], 59) * 60 +
      Math.min(parts[2], 59)) *
    1000
  );
}

/* ================= PAGE ================= */

export default function Page() {
  const [durationInput, setDurationInput] = useState("00:05:00");
  const [mode, setMode] = useState<DisplayMode>("countdown");
  const [allowNegative, setAllowNegative] = useState(true);

  const [timer, setTimer] = useState<SharedTimerState>(EMPTY_TIMER);
  const [now, setNow] = useState(Date.now());

  // splash
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);

  /* ===== INIT ===== */

  useEffect(() => {
    setTimer(safeLoadTimer());

    channel.onmessage = (e) => setTimer(e.data);
    return () => channel.close();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setSplashExiting(true), 1300);
    const t2 = setTimeout(() => setShowSplash(false), 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* ===== DERIVED ===== */

  const isRunning = timer.running;

  const remainingMs =
    timer.running && timer.startTs
      ? timer.durationMs - (now - timer.startTs) + timer.offsetMs
      : null;

  /* ===== ACTIONS ===== */

  const handlePrimaryAction = () => {
    const ms = hmsToMs(durationInput, 5 * 60 * 1000);

    if (!timer.running) {
      // START TIMER
      const next: SharedTimerState = {
        startTs: Date.now(),
        durationMs: ms,
        offsetMs: 0,
        running: true,
      };
      saveTimer(next);
      setTimer(next);

      // open display ONCE
      window.open("/display", "_blank");
    } else {
      // UPDATE TIMER (no restart)
      const next: SharedTimerState = {
        ...timer,
        durationMs: ms,
      };
      saveTimer(next);
      setTimer(next);
    }
  };

  const addTime = (deltaMs: number) => {
    if (!timer.running) return;
    const next = { ...timer, offsetMs: timer.offsetMs + deltaMs };
    saveTimer(next);
    setTimer(next);
  };

  /* ===== RENDER ===== */

  return (
    <main className="min-h-screen">
      <SetupView
        durationInput={durationInput}
        setDurationInput={setDurationInput}
        mode={mode}
        setMode={setMode}
        allowNegative={allowNegative}
        setAllowNegative={setAllowNegative}
        onStartDisplay={handlePrimaryAction}
        primaryLabel={isRunning ? "Update timer" : "Start timer"}
        running={isRunning}
        remainingMs={remainingMs}
        onAddTime={addTime}
      />

      {showSplash && <Loader exiting={splashExiting} />}
    </main>
  );
}
