'use client';

type Props = {
  active: boolean;
  speed: number;
  targetTimeMs: number | null;
};

export function TimeTravelBadge({ active, speed, targetTimeMs }: Props) {
  if (!active || !targetTimeMs) return null;

  const endsAt = new Date(targetTimeMs).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="mt-8 text-yellow-300 text-2xl">
      ⚡ Time-travel active ({speed.toFixed(2)}x speed) → Ends at {endsAt}
    </div>
  );
}
