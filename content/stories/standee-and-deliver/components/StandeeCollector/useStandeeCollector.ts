"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { choices } from "@/utils/mathHelpers";
import type { StandeeData } from "../../data";
import { computeStarterFlags } from "../../utils";
import { TICK_INTERVAL_MS } from "./constants";

interface RunState {
  tallies: number[];
  lastDrawnIndex: number | null;
}

function emptyRunState(numStandees: number): RunState {
  return { tallies: new Array(numStandees).fill(0), lastDrawnIndex: null };
}

export function useStandeeCollector(standeeData: StandeeData[], speed: number) {
  const starterFlags = useMemo(
    () => computeStarterFlags(standeeData.map((standee) => standee.character)),
    [standeeData],
  );
  const eligibleIndices = useMemo(
    () =>
      starterFlags.flatMap((isStarter, index) => (isStarter ? [] : [index])),
    [starterFlags],
  );

  const [state, setState] = useState<RunState>(() =>
    emptyRunState(standeeData.length),
  );
  const [playing, setPlaying] = useState(false);

  const playingRef = useRef(false);
  const lastTickRef = useRef(0);
  const speedRef = useRef(speed);
  speedRef.current = speed;
  const eligibleIndicesRef = useRef(eligibleIndices);
  eligibleIndicesRef.current = eligibleIndices;

  const isFinished = eligibleIndices.every((index) => state.tallies[index] > 0);

  const tick = useCallback((now: number) => {
    if (!playingRef.current) return;

    if (now - lastTickRef.current > TICK_INTERVAL_MS / speedRef.current) {
      lastTickRef.current = now;
      setState((prev) => {
        const [index] = choices(eligibleIndicesRef.current, 1);
        const tallies = [...prev.tallies];
        tallies[index] += 1;
        return { tallies, lastDrawnIndex: index };
      });
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

  const reset = useCallback(() => {
    playingRef.current = false;
    setPlaying(false);
    setState(emptyRunState(standeeData.length));
  }, [standeeData.length]);

  useEffect(() => {
    playingRef.current = false;
    setPlaying(false);
    setState(emptyRunState(standeeData.length));
  }, [standeeData.length]);

  useEffect(() => {
    if (isFinished) {
      playingRef.current = false;
      setPlaying(false);
    }
  }, [isFinished]);

  useEffect(() => {
    return () => {
      playingRef.current = false;
    };
  }, []);

  return {
    tallies: state.tallies,
    starterFlags,
    lastDrawnIndex: state.lastDrawnIndex,
    playing,
    isFinished,
    toggle,
    reset,
  };
}
