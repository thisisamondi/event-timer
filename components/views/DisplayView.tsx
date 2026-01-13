"use client";

import { useCallback, useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

import type { DisplayMode } from "@/lib/types";
import { ClockDisplay } from "@/components/timer/ClockDisplay";
import { MessageOverlay } from "@/components/timer/MessageOverlay";
import { TimeTravelBadge } from "@/components/timer/TimeTravelBadge";
import { TimerDisplay } from "@/components/timer/TimerDisplay";

type Props = {
  mode: DisplayMode;
  remainingMs: number;
  isNegative: boolean;

  clockTime: Date;

  message: string;
  messageVisible: boolean;

  timeTravelActive: boolean;
  timeTravelSpeed: number;
  timeTravelTargetMs: number | null;

  onOpenModerator: () => void;
};

export function DisplayView({
  mode,
  remainingMs,
  isNegative,
  clockTime,
  message,
  messageVisible,
  timeTravelActive,
  timeTravelSpeed,
  timeTravelTargetMs,
  onOpenModerator,
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    onChange();
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
    } catch (err) {
      console.error("Enter fullscreen failed:", err);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Exit fullscreen failed:", err);
    }
  }, []);

  return (
    <div
      className={`group relative min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
        isNegative ? "bg-red-600" : "bg-gray-900"
      }`}
    >
      {/* Moderator button (hover only) - top-left */}
      <button
        onClick={onOpenModerator}
        className="
          absolute top-4 left-4
          opacity-0 pointer-events-none
          group-hover:opacity-100 group-hover:pointer-events-auto
          focus:opacity-100 focus:pointer-events-auto
          transition-opacity
          px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm
        "
        aria-label="Open moderator panel"
      >
        Moderator
      </button>

      {/* Exit fullscreen (X) - top-right, only when fullscreen, hover only */}
      {isFullscreen && (
        <button
          onClick={exitFullscreen}
          className="
            absolute top-4 right-4
            opacity-0 pointer-events-none
            group-hover:opacity-100 group-hover:pointer-events-auto
            focus:opacity-100 focus:pointer-events-auto
            transition-opacity
            p-2 bg-white/10 text-white rounded-lg hover:bg-white/20
          "
          aria-label="Exit fullscreen"
          title="Exit fullscreen"
        >
          <X size={18} />
        </button>
      )}

      {/* Enter fullscreen (icon) - bottom-right, hover only */}
      {!isFullscreen && (
        <button
          onClick={enterFullscreen}
          className="
            absolute bottom-4 right-4
            opacity-0 pointer-events-none
            group-hover:opacity-100 group-hover:pointer-events-auto
            focus:opacity-100 focus:pointer-events-auto
            transition-opacity
            p-3 bg-white/10 text-white rounded-lg hover:bg-white/20
          "
          aria-label="Enter fullscreen"
          title="Fullscreen"
        >
          <Maximize2 size={18} />
        </button>
      )}

      <div className="text-center">
        {(mode === "countdown" || mode === "both") && (
          <TimerDisplay ms={remainingMs} isNegative={isNegative} size="large" />
        )}

        {(mode === "clock" || mode === "both") && (
          <ClockDisplay
            time={clockTime}
            size={mode === "both" ? "medium" : "xlarge"}
            className={mode === "both" ? "mt-8" : ""}
          />
        )}

        <MessageOverlay message={message} visible={messageVisible} />

        <TimeTravelBadge
          active={timeTravelActive}
          speed={timeTravelSpeed}
          targetTimeMs={timeTravelTargetMs}
        />
      </div>
    </div>
  );
}
