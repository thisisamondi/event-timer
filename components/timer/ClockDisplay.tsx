"use client";

import { formatClock } from "@/lib/time";

type ClockSize = "large" | "medium" | "xlarge";

type Props = {
  time: Date;
  size?: ClockSize;
  className?: string;
};

export function ClockDisplay({ time, size = "xlarge", className = "" }: Props) {
  const fontSize =
    size === "xlarge" ? "18rem" : size === "large" ? "12rem" : "6rem";

  return (
    <div
      className={`font-mono font-bold text-white ${className}`}
      style={{
        fontSize,
        lineHeight: "1",
        letterSpacing: "-0.02em",
      }}
    >
      {formatClock(time)} testar
    </div>
  );
}
