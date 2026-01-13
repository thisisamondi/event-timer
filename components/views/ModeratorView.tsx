'use client';

import { Clock, Maximize2, Minus, Pause, Play, Plus, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DisplayMode, TimerStatus } from '@/lib/types';
import { formatDuration } from '@/lib/time';

type Props = {
  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;

  status: TimerStatus;
  remainingMs: number;
  isNegative: boolean;

  onStart: () => void;
  onPauseResume: () => void;
  onReset: () => void;
  onAdjustSeconds: (deltaSeconds: number) => void;

  allowNegative: boolean;

  message: string;
  messageVisible: boolean;
  onShowMessage: (message: string) => void;
  onHideMessage: () => void;

  timeTravelActive: boolean;
  timeTravelSpeed: number;
  timeTravelTargetMs: number | null;
  onActivateTimeTravel: (hhmm: string) => void;

  onViewDisplay: () => void;
};

export function ModeratorView({
  mode,
  setMode,
  status,
  remainingMs,
  isNegative,
  onStart,
  onPauseResume,
  onReset,
  onAdjustSeconds,
  allowNegative,
  message,
  messageVisible,
  onShowMessage,
  onHideMessage,
  timeTravelActive,
  timeTravelSpeed,
  timeTravelTargetMs,
  onActivateTimeTravel,
  onViewDisplay,
}: Props) {
  const [messageInput, setMessageInput] = useState(message);
  const [timeTravelTime, setTimeTravelTime] = useState('');

  const endsAt = useMemo(() => {
    if (!timeTravelTargetMs) return null;
    return new Date(timeTravelTargetMs).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [timeTravelTargetMs]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Moderator Panel</h1>
          <button
            onClick={onViewDisplay}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Maximize2 className="inline mr-2" size={18} />
            View Display
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Timer Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Timer Controls</h2>

            <div className="text-center mb-6">
              <div
                className={`text-6xl font-mono font-bold ${
                  isNegative ? 'text-red-600' : 'text-gray-800'
                }`}
              >
                {isNegative && '-'}
                {formatDuration(remainingMs)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                Status: <span className="font-semibold">{status}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Negative time: {allowNegative ? 'enabled' : 'disabled'}
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={onStart}
                disabled={status === 'running'}
                className="flex-1 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="inline mr-2" size={18} />
                Start
              </button>

              <button
                onClick={onPauseResume}
                disabled={status === 'idle'}
                className="flex-1 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pause className="inline mr-2" size={18} />
                {status === 'running' ? 'Pause' : 'Resume'}
              </button>

              <button
                onClick={onReset}
                className="flex-1 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
              >
                <RotateCcw className="inline mr-2" size={18} />
                Reset
              </button>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Adjust Time</h3>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => onAdjustSeconds(-60)}
                  className="py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  <Minus className="inline mr-1" size={16} />
                  1m
                </button>

                <button
                  onClick={() => onAdjustSeconds(-30)}
                  className="py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  <Minus className="inline mr-1" size={16} />
                  30s
                </button>

                <button
                  onClick={() => onAdjustSeconds(30)}
                  className="py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  <Plus className="inline mr-1" size={16} />
                  30s
                </button>

                <button
                  onClick={() => onAdjustSeconds(60)}
                  className="py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  <Plus className="inline mr-1" size={16} />
                  1m
                </button>
              </div>
            </div>
          </div>

          {/* Display Mode & Message */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Display Settings</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode('countdown')}
                  className={`py-2 rounded font-medium transition ${
                    mode === 'countdown'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Timer
                </button>

                <button
                  onClick={() => setMode('clock')}
                  className={`py-2 rounded font-medium transition ${
                    mode === 'clock'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Clock className="inline mr-2" size={16} />
                  Clock
                </button>

                <button
                  onClick={() => setMode('both')}
                  className={`py-2 rounded font-medium transition ${
                    mode === 'both'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Both
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Overlay
              </label>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Enter message to display..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onShowMessage(messageInput)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Show Message
                </button>
                <button
                  onClick={onHideMessage}
                  className="flex-1 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                >
                  Hide Message
                </button>
              </div>

              <div className="mt-2 text-xs text-gray-500">
                Current: {messageVisible ? 'visible' : 'hidden'}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">⚡ Time-Travel Mode</h3>
              <p className="text-sm text-gray-600 mb-3">
                Set clock time when timer should reach zero. Speed adjusts automatically.
              </p>

              <div className="mb-2">
                <label className="block text-xs text-gray-500 mb-1">
                  Target End Time (HH:MM)
                </label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={timeTravelTime}
                    onChange={(e) => setTimeTravelTime(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => onActivateTimeTravel(timeTravelTime)}
                    disabled={status !== 'running' || timeTravelActive}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Activate
                  </button>
                </div>
              </div>

              {timeTravelActive && (
                <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                  <div className="text-purple-600 font-medium">
                    ⚡ Active at {timeTravelSpeed.toFixed(2)}x speed
                  </div>
                  {endsAt && (
                    <div className="text-gray-600 text-xs mt-1">
                      Will reach zero at {endsAt}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          Tip: keep the display fullscreen on a separate screen or browser window.
        </div>
      </div>
    </div>
  );
}
