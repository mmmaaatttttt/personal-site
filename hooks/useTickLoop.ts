"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseTickLoopOptions {
  tickIntervalMs: number;
  onTick: (now: number) => void;
}

// Shared requestAnimationFrame play/pause loop for simulation-style
// interactives (draw a card, spin a wheel, play a round -- anything that
// repeats on an interval while "playing"). Owns only the loop itself;
// callers own their own state shape and decide what a "tick" does via
// onTick, and what "reset" means by composing it with stop().
export function useTickLoop({ tickIntervalMs, onTick }: UseTickLoopOptions) {
  const [playing, setPlaying] = useState(false);

  const playingRef = useRef(false);
  const lastTickRef = useRef(0);
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;
  const tickIntervalMsRef = useRef(tickIntervalMs);
  tickIntervalMsRef.current = tickIntervalMs;

  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;

    if (now - lastTickRef.current > tickIntervalMsRef.current) {
      lastTickRef.current = now;
      onTickRef.current(now);
    }

    requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    setPlaying((prev) => {
      const next = !prev;
      playingRef.current = next;
      if (next) {
        lastTickRef.current = 0;
        requestAnimationFrame(tick);
      }
      return next;
    });
  }, [tick]);

  const stop = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      playingRef.current = false;
    };
  }, []);

  return { playing, toggle, stop };
}
