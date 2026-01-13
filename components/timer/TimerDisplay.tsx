'use client';

import { formatDuration } from '@/lib/time';

type Props = {
  ms: number;
  isNegative: boolean;
  size?: 'large' | 'medium';
};

export function TimerDisplay({ ms, isNegative, size = 'large' }: Props) {
  const fontSize = size === 'large' ? '12rem' : '6rem';

  return (
    <div
      className="font-mono font-bold text-white transition-colors"
      style={{ fontSize, lineHeight: '1' }}
      aria-label="Countdown timer"
    >
      {isNegative && '-'}
      {formatDuration(ms)}
    </div>
  );
}
