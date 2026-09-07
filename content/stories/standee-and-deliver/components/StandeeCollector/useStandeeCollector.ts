"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTickLoop } from "@/hooks/useTickLoop";
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

  const isFinished = eligibleIndices.every((index) => state.tallies[index] > 0);

  const { playing, toggle, stop } = useTickLoop({
    tickIntervalMs: TICK_INTERVAL_MS / speed,
    onTick: () => {
      setState((prev) => {
        const [index] = choices(eligibleIndices, 1);
        const tallies = [...prev.tallies];
        tallies[index] += 1;
        return { tallies, lastDrawnIndex: index };
      });
    },
  });

  const reset = useCallback(() => {
    stop();
    setState(emptyRunState(standeeData.length));
  }, [stop, standeeData.length]);

  useEffect(() => {
    stop();
    setState(emptyRunState(standeeData.length));
  }, [stop, standeeData.length]);

  useEffect(() => {
    if (isFinished) stop();
  }, [isFinished, stop]);

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
