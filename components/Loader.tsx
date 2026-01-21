"use client";

import React from "react";

type Props = {
  /** When true, plays a fade-out before unmount */
  exiting?: boolean;
};

export function Loader({ exiting = false }: Props) {
  return (
    <div
      className={[
        "fixed inset-0 z-50 flex items-center justify-center bg-gray-950 text-white",
        "transition-opacity duration-500",
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      aria-label="Loading"
      role="status"
    >
      <div className="flex flex-col items-center gap-8">
        {/* Title */}
        <div className="font-mono font-bold tracking-tight text-6xl sm:text-7xl">
          Clockd
        </div>

        {/* Clock animation */}
        <div className="relative">
          {/* Soft glow */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30 loader-glow" />

          {/* Dial */}
          <div className="relative h-56 w-56 sm:h-64 sm:w-64 rounded-full border border-white/15 bg-white/5 backdrop-blur">
            {/* Tick marks (12) */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-3 w-0.5 -translate-x-1/2 -translate-y-[7.6rem] sm:-translate-y-[8.7rem] bg-white/40"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${
                      i * 30
                    }deg) translateY(-7.6rem)`,
                  }}
                />
              ))}
            </div>

            {/* Inner ring */}
            <div className="absolute inset-5 rounded-full border border-white/10" />

            {/* Hands */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Hour hand */}
              <div className="relative origin-bottom loader-hour">
                <div className="absolute left-1/2 bottom-0 h-14 w-1.5 -translate-x-1/2 rounded-full bg-white/85 shadow" />
              </div>

              {/* Minute hand */}
              <div className="relative origin-bottom loader-minute">
                <div className="absolute left-1/2 bottom-0 h-20 w-1 -translate-x-1/2 rounded-full bg-white/80 shadow" />
              </div>

              {/* Second hand */}
              <div className="relative origin-bottom loader-second">
                <div className="absolute left-1/2 bottom-0 h-24 w-0.5 -translate-x-1/2 rounded-full bg-white shadow" />
              </div>

              {/* Center cap */}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              <div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
            </div>
          </div>

          {/* Subtitle / hint */}
          <div className="mt-6 text-center text-sm sm:text-base text-white/70">
            Syncing time…
          </div>
        </div>
      </div>

      {/* Component-scoped CSS */}
      <style jsx>{`
        .loader-glow {
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.35),
            transparent 60%
          );
          animation: glow 1.8s ease-in-out infinite;
        }

        .loader-hour {
          animation: hourSweep 4.8s ease-in-out infinite;
        }

        .loader-minute {
          animation: minuteSweep 2.4s ease-in-out infinite;
        }

        /* A "ticking sweep": mostly smooth but with subtle micro-pauses */
        .loader-second {
          animation: secondTick 1.2s linear infinite;
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.38;
            transform: scale(1.03);
          }
        }

        @keyframes hourSweep {
          0% {
            transform: rotate(15deg);
          }
          50% {
            transform: rotate(55deg);
          }
          100% {
            transform: rotate(15deg);
          }
        }

        @keyframes minuteSweep {
          0% {
            transform: rotate(20deg);
          }
          50% {
            transform: rotate(140deg);
          }
          100% {
            transform: rotate(20deg);
          }
        }

        @keyframes secondTick {
          0% {
            transform: rotate(0deg);
          }
          70% {
            transform: rotate(300deg);
          }
          85% {
            transform: rotate(300deg);
          } /* tiny pause */
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
