'use client';

import { Clock, Maximize2, Timer } from 'lucide-react';
import type { DisplayMode } from '@/lib/types';

type Props = {
  durationInput: string;
  setDurationInput: (v: string) => void;

  mode: DisplayMode;
  setMode: (m: DisplayMode) => void;

  allowNegative: boolean;
  setAllowNegative: (v: boolean) => void;

  onStartDisplay: () => void;
  onStartModerator: () => void;
};

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Event Timer Setup
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timer Duration (minutes)
            </label>
            <input
              type="number"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.1"
              step="0.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Mode
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setMode('countdown')}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === 'countdown'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Timer className="inline mr-2" size={18} />
                Timer
              </button>

              <button
                onClick={() => setMode('clock')}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === 'clock'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock className="inline mr-2" size={18} />
                Clock
              </button>

              <button
                onClick={() => setMode('both')}
                className={`py-3 rounded-lg font-medium transition ${
                  mode === 'both'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Both
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowNegative"
              checked={allowNegative}
              onChange={(e) => setAllowNegative(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="allowNegative" className="ml-2 text-sm text-gray-700">
              Allow negative time (red background)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={onStartDisplay}
              className="py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <Maximize2 className="inline mr-2" size={20} />
              Start Display
            </button>

            <button
              onClick={onStartModerator}
              className="py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Open Moderator Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
