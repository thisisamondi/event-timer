"use client";

import { Clock, Maximize2, Timer, Square } from "lucide-react";
import { useEffect, useState } from "react";
import type { DisplayMode } from "@/lib/types";

/* ================= PROPS ================= */

type Props = {
  durationInput: string;
  setDurationInput: (v: string) => void;

  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;

  allowNegative: boolean;
  setAllowNegative: (v: boolean) => void;

  running: boolean;
  remainingMs: number | null;

  onStartOrUpdate: () => void;
  onStop: () => void;
  onAddTime: (deltaMs: number) => void;
};

/* ================= HELPERS ================= */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function formatMs(ms: number) {
  const isNegative = ms < 0;
  const total = Math.abs(Math.floor(ms / 1000));

  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  const value = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
  return isNegative ? `-${value}` : value;
}

function normalizeHms(input?: string): string | null {
  if (!input) return null;
  const parts = input.split(":").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  return `${pad2(parts[0])}:${pad2(parts[1])}:${pad2(parts[2])}`;
}

function formatClock(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

/* ================= VIEW ================= */

export function SetupView({
  durationInput,
  setDurationInput,
  mode,
  setMode,
  allowNegative,
  setAllowNegative,
  running,
  remainingMs,
  onStartOrUpdate,
  onStop,
  onAddTime,
}: Props) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (mode === "clock" || mode === "both") {
      const id = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(id);
    }
  }, [mode]);

  const quickButtons = [
    { label: "+10s", delta: 10_000 },
    { label: "+30s", delta: 30_000 },
    { label: "+1m", delta: 60_000 },
    { label: "+5m", delta: 5 * 60_000 },
    { label: "-10s", delta: -10_000 },
    { label: "-30s", delta: -30_000 },
    { label: "-1m", delta: -60_000 },
    { label: "-5m", delta: -5 * 60_000 },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center text-gray-800 mb-8 font-mono font-bold tracking-tight text-6xl sm:text-7xl">
          Clockd
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          {/* ===== MAIN DISPLAY (SAME POSITION) ===== */}
          <div className="flex justify-center flex-col">
            {(mode === "countdown" || mode === "both") && (
              <>
                {!running && (
                  <input
                    type="text"
                    inputMode="numeric"
                    value={durationInput}
                    placeholder="00:05:00"
                    onChange={(e) => setDurationInput(e.target.value)}
                    onBlur={() => {
                      const normalized = normalizeHms(durationInput);
                      if (normalized) setDurationInput(normalized);
                    }}
                    className={[
                      "text-6xl sm:text-7xl font-mono font-bold text-center text-gray-400",
                      "bg-transparent outline-none border-b-2 ",
                      "border-transparent focus:border-blue-500 focus:text-gray-700",
                      "w-[10ch] mx-auto",
                    ].join(" ")}
                  />
                )}

                {running && remainingMs !== null && (
                  <div
                    className={[
                      "text-6xl sm:text-7xl font-mono font-bold text-center",
                      remainingMs < 0 ? "text-red-600 " : "text-gray-800",
                    ].join(" ")}
                  >
                    {formatMs(remainingMs)}
                  </div>
                )}

                <p className="text-center text-gray-400 mt-2">
                  {running ? "timer running" : "hh:mm:ss"}
                </p>
              </>
            )}

            {(mode === "clock" || mode === "both") && (
              <div className={mode === "both" ? "mt-6" : ""}>
                <div className="text-5xl sm:text-6xl font-mono font-semibold text-gray-700 text-center">
                  {formatClock(now)}
                </div>
              </div>
            )}
          </div>

          {/* ===== QUICK ADJUST (ONLY WHEN RUNNING) ===== */}
          {running && (
            <div className="grid grid-cols-4 gap-2">
              {quickButtons.map((b) => (
                <button
                  key={b.label}
                  onClick={() => onAddTime(b.delta)}
                  className="py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {b.label}
                </button>
              ))}
            </div>
          )}

          {/* DISPLAY MODE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Mode
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMode("countdown")}
                className={`py-3 rounded-lg font-medium ${
                  mode === "countdown"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Timer className="inline mr-2" size={18} />
                Timer
              </button>

              <button
                onClick={() => setMode("clock")}
                className={`py-3 rounded-lg font-medium ${
                  mode === "clock"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Clock className="inline mr-2" size={18} />
                Clock
              </button>

              <button
                onClick={() => setMode("both")}
                className={`py-3 rounded-lg font-medium ${
                  mode === "both"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Both
              </button>
            </div>
          </div>

          {/* ALLOW NEGATIVE */}
          {(mode === "countdown" || mode === "both") && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={allowNegative}
                onChange={(e) => setAllowNegative(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <label className="ml-2 text-sm text-gray-700">
                Allow negative time
              </label>
            </div>
          )}

          {/* ===== ACTION BUTTONS ===== */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onStartOrUpdate}
              className="py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700"
            >
              <Maximize2 className="inline mr-2" size={20} />
              {running ? "Update timer" : "Start timer"}
            </button>

            {running && (
              <button
                onClick={onStop}
                className="py-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700"
              >
                <Square className="inline mr-2" size={20} />
                Stop timer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
