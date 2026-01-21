"use client";

import { Clock, Maximize2, Timer } from "lucide-react";
import type { DisplayMode } from "@/lib/types";

type Props = {
  /** HH:MM:SS string, e.g. "00:05:00" */
  durationInput: string;
  setDurationInput: (v: string) => void;

  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;

  allowNegative: boolean;
  setAllowNegative: (v: boolean) => void;

  onStartDisplay: () => void;
  onStartModerator: () => void;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Parse "HH:MM:SS" into total seconds.
 * Accepts:
 * - "H:MM:SS", "HH:MM:SS"
 * - "MM:SS" (interprets as 00:MM:SS)
 * - "SS" (interprets as 00:00:SS)
 */
function parseHmsToSeconds(input?: string): number | null {
  const raw = (input ?? "").trim();
  if (!raw) return null;

  const parts = raw.split(":").map((p) => p.trim());
  if (parts.some((p) => p === "" || !/^\d+$/.test(p))) return null;

  if (parts.length > 3) return null;

  let h = 0,
    m = 0,
    s = 0;

  if (parts.length === 3) {
    h = Number(parts[0]);
    m = Number(parts[1]);
    s = Number(parts[2]);
  } else if (parts.length === 2) {
    m = Number(parts[0]);
    s = Number(parts[1]);
  } else {
    s = Number(parts[0]);
  }

  if (m > 59 || s > 59) return null;

  // allow large hours; clamp to something sane if you want (e.g. 0..99)
  h = clamp(h, 0, 99);

  return h * 3600 + m * 60 + s;
}

function secondsToHms(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

/**
 * Normalizes user input on blur:
 * - if user types "5:00" -> "00:05:00"
 * - if user types "90" -> (invalid; because seconds must be 0-59)
 */
function normalizeHms(input?: string): string | null {
  const secs = parseHmsToSeconds(input);
  if (secs === null) return null;
  return secondsToHms(secs);
}

export function SetupView({
  durationInput,
  setDurationInput,
  mode,
  setMode,
  allowNegative,
  setAllowNegative,
  onStartDisplay,
  onStartModerator,
}: Props) {
  const parsedSeconds = parseHmsToSeconds(durationInput);
  const isValid = parsedSeconds !== null && parsedSeconds > 0;

  const applyDeltaSeconds = (delta: number) => {
    const base = parsedSeconds ?? 0;
    const next = Math.max(0, base + delta);
    setDurationInput(secondsToHms(next));
  };

  const quickButtons: Array<{ label: string; deltaSec: number }> = [
    { label: "+10s", deltaSec: 10 },
    { label: "+30s", deltaSec: 30 },
    { label: "+1m", deltaSec: 60 },
    { label: "+5m", deltaSec: 5 * 60 },
    { label: "+15m", deltaSec: 15 * 60 },
    { label: "-10s", deltaSec: -10 },
    { label: "-30s", deltaSec: -30 },
    { label: "-1m", deltaSec: -60 },
    { label: "-5m", deltaSec: -5 * 60 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-gray-800 mb-8 font-mono font-bold tracking-tight text-6xl sm:text-7xl">
          Clockd
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* Display Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Mode
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setMode("countdown")}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === "countdown"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Timer className="inline mr-2" size={18} />
                Timer
              </button>

              <button
                type="button"
                onClick={() => setMode("clock")}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === "clock"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="inline mr-2" size={18} />
                Clock
              </button>

              <button
                type="button"
                onClick={() => setMode("both")}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === "both"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Both
              </button>
            </div>
          </div>
          {/* Duration HH:MM:SS */}
          {(mode == "countdown" || mode == "both") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timer Duration (HH:MM:SS)
              </label>

              <input
                type="time"
                step="1"
                inputMode="numeric"
                value={durationInput}
                onChange={(e) => setDurationInput(e.target.value)}
                onBlur={() => {
                  const normalized = normalizeHms(durationInput);
                  if (normalized) setDurationInput(normalized);
                }}
                className={[
                  "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent font-mono text-gray-700",
                  isValid
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-300 focus:ring-red-400",
                ].join(" ")}
              />

              <div className="mt-2 text-sm">
                {isValid ? (
                  <span className="text-gray-600">
                    Parsed:{" "}
                    <span className="font-medium">
                      {secondsToHms(parsedSeconds!)}
                    </span>
                  </span>
                ) : (
                  <span className="text-red-600">
                    Enter a valid time like{" "}
                    <span className="font-mono">00:05:00</span> (MM and SS must
                    be 00–59).
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick adjust buttons */}
          {(mode == "countdown" || mode == "both") && (
            <div>
              <div className="grid grid-cols-5 gap-2">
                {quickButtons.map((b) => (
                  <button
                    key={b.label}
                    type="button"
                    onClick={() => applyDeltaSeconds(b.deltaSec)}
                    className="py-2 rounded-lg font-medium transition bg-gray-100 text-gray-800 hover:bg-gray-200"
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Allow negative */}
          {(mode === "countdown" || mode === "both") && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowNegative"
                checked={allowNegative}
                onChange={(e) => setAllowNegative(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="allowNegative"
                className="ml-2 text-sm text-gray-700"
              >
                Allow negative time (red background)
              </label>
            </div>
          )}

          {/* Start buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              type="button"
              onClick={onStartDisplay}
              disabled={!isValid}
              className="py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Maximize2 className="inline mr-2" size={20} />
              Start Display
            </button>

            <button
              type="button"
              onClick={onStartModerator}
              disabled={!isValid}
              className="py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Open Moderator Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
