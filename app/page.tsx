"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/Loader";

import { SetupView } from "@/components/views/SetupView";
import { DisplayView } from "@/components/views/DisplayView";
import { ModeratorView } from "@/components/views/ModeratorView";

import { useClock } from "@/hooks/useClock";
import { useTimer } from "@/hooks/useTimer";
import { useTimeTravel } from "@/hooks/useTimeTravel";
import type { DisplayMode, View } from "@/lib/types";

// Simple HH:MM:SS -> ms (assumes valid-ish input)
function hmsToMs(input: string, fallbackMs: number) {
  const safe = (input || "").trim();
  const parts = safe.split(":").map((p) => p.trim());
  if (parts.length !== 3) return fallbackMs;

  const h = Number(parts[0]);
  const m = Number(parts[1]);
  const s = Number(parts[2]);

  if ([h, m, s].some((n) => Number.isNaN(n))) return fallbackMs;

  // Basic bounds to avoid nonsense
  const hh = Math.max(0, Math.min(99, h));
  const mm = Math.max(0, Math.min(59, m));
  const ss = Math.max(0, Math.min(59, s));

  const totalSeconds = hh * 3600 + mm * 60 + ss;
  if (totalSeconds <= 0) return fallbackMs;

  return totalSeconds * 1000;
}

export default function Page() {
  // Hooks must be unconditional
  const clockTime = useClock(1000);

  const [view, setView] = useState<View>("setup");
  const [mode, setMode] = useState<DisplayMode>("countdown");
  const [allowNegative, setAllowNegative] = useState(true);

  const [message, setMessage] = useState("");
  const [messageVisible, setMessageVisible] = useState(false);

  // HH:MM:SS
  const [durationInput, setDurationInput] = useState("00:05:00");

  // Timer + timetravel
  const timer = useTimer({ initialDurationMs: 5 * 60 * 1000, allowNegative });
  const timeTravel = useTimeTravel();

  // Splash overlay (no early return)
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);

  useEffect(() => {
    const SHOW_MS = 1800;
    const FADE_MS = 500;

    const t1 = window.setTimeout(
      () => setSplashExiting(true),
      SHOW_MS - FADE_MS
    );
    const t2 = window.setTimeout(() => setShowSplash(false), SHOW_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const startWithInput = (nextView: View) => {
    const fallback = 5 * 60 * 1000;
    const ms = hmsToMs(durationInput, fallback);

    // Your useTimer expects duration passed into start()
    timer.start(ms);

    setView(nextView);
  };

  return (
    <main className="min-h-screen">
      {view === "setup" && (
        <SetupView
          durationInput={durationInput}
          setDurationInput={setDurationInput}
          mode={mode}
          setMode={setMode}
          allowNegative={allowNegative}
          setAllowNegative={setAllowNegative}
          onStartDisplay={() => startWithInput("display")}
          onStartModerator={() => startWithInput("moderator")}
        />
      )}

      {view === "display" && (
        <DisplayView
          mode={mode}
          remainingMs={timer.remainingMs}
          isNegative={timer.isNegative}
          clockTime={clockTime}
          message={message}
          messageVisible={messageVisible}
          timeTravelActive={timeTravel.isActive}
          timeTravelSpeed={timeTravel.speed}
          timeTravelTargetMs={timeTravel.targetTimeMs}
          onOpenModerator={() => setView("moderator")}
        />
      )}

      {view === "moderator" && (
        <ModeratorView
          mode={mode}
          onModeChange={setMode}
          timer={timer}
          timeTravel={timeTravel}
          message={message}
          messageVisible={messageVisible}
          onMessageChange={setMessage}
          onMessageVisibleChange={setMessageVisible}
          onViewDisplay={() => setView("display")}
        />
      )}

      {showSplash && <Loader exiting={splashExiting} />}
    </main>
  );
}
