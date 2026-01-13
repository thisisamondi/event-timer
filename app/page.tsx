'use client';

import { useMemo, useState } from 'react';
import type { DisplayMode, View } from '@/lib/types';
import { SetupView } from '@/components/views/SetupView';
import { DisplayView } from '@/components/views/DisplayView';
import { ModeratorView } from '@/components/views/ModeratorView';
import { useClock } from '@/hooks/useClock';
import { useTimeTravel } from '@/hooks/useTimeTravel';
import { useTimer } from '@/hooks/useTimer';

export default function Page() {
  const [view, setView] = useState<View>('setup');
  const [mode, setMode] = useState<DisplayMode>('countdown');

  const [allowNegative, setAllowNegative] = useState<boolean>(true);
  const [durationInput, setDurationInput] = useState<string>('5');

  const [message, setMessage] = useState<string>('');
  const [messageVisible, setMessageVisible] = useState<boolean>(false);

  const clockTime = useClock(1000);
  const timeTravel = useTimeTravel();

  const timer = useTimer({
    allowNegative,
    timeTravel: useMemo(
      () => ({
        isActive: timeTravel.isActive,
        speed: timeTravel.speed,
        targetTimeMs: timeTravel.targetTimeMs,
        deactivate: timeTravel.deactivate,
      }),
      [timeTravel.isActive, timeTravel.speed, timeTravel.targetTimeMs, timeTravel.deactivate]
    ),
  });

  const durationMs = useMemo(() => {
    const minutes = Number.parseFloat(durationInput);
    if (!Number.isFinite(minutes) || minutes <= 0) return 5 * 60 * 1000;
    return minutes * 60 * 1000;
  }, [durationInput]);

  const handleStart = () => {
    timer.start(durationMs);
  };

  const onStartDisplay = () => {
    handleStart();
    setView('display');
  };

  const onStartModerator = () => {
    handleStart();
    setView('moderator');
  };

  const onShowMessage = (msg: string) => {
    setMessage(msg);
    setMessageVisible(true);
  };

  const onHideMessage = () => {
    setMessageVisible(false);
  };

  const onActivateTimeTravel = (hhmm: string) => {
    if (timer.status !== 'running' || timer.remainingMs < 5000) {
      alert('Timer must be running with at least 5 seconds remaining');
      return;
    }

    const result = timeTravel.activateFromHHMM(hhmm, timer.remainingMs);

    if (!result.ok) {
      alert(result.error);
    }
  };

  if (view === 'setup') {
    return (
      <SetupView
        durationInput={durationInput}
        setDurationInput={setDurationInput}
        mode={mode}
        setMode={setMode}
        allowNegative={allowNegative}
        setAllowNegative={setAllowNegative}
        onStartDisplay={onStartDisplay}
        onStartModerator={onStartModerator}
      />
    );
  }

  if (view === 'display') {
    return (
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
        onOpenModerator={() => setView('moderator')}
      />
    );
  }

  return (
    <ModeratorView
      mode={mode}
      setMode={setMode}
      status={timer.status}
      remainingMs={timer.remainingMs}
      isNegative={timer.isNegative}
      allowNegative={allowNegative}
      onStart={handleStart}
      onPauseResume={timer.pauseResume}
      onReset={timer.reset}
      onAdjustSeconds={(s) => timer.adjustTime(s * 1000)}
      message={message}
      messageVisible={messageVisible}
      onShowMessage={onShowMessage}
      onHideMessage={onHideMessage}
      timeTravelActive={timeTravel.isActive}
      timeTravelSpeed={timeTravel.speed}
      timeTravelTargetMs={timeTravel.targetTimeMs}
      onActivateTimeTravel={onActivateTimeTravel}
      onViewDisplay={() => setView('display')}
    />
  );
}
