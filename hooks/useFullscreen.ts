"use client";

import { useCallback, useEffect, useState } from "react";

export function useFullscreen(target?: HTMLElement | null) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enter = useCallback(async () => {
    const el = target ?? document.documentElement;
    if (!el?.requestFullscreen) return;
    await el.requestFullscreen();
  }, [target]);

  const exit = useCallback(async () => {
    if (!document.fullscreenElement) return;
    await document.exitFullscreen();
  }, []);

  const toggle = useCallback(async () => {
    if (document.fullscreenElement) {
      await exit();
    } else {
      await enter();
    }
  }, [enter, exit]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return { isFullscreen, enter, exit, toggle };
}
