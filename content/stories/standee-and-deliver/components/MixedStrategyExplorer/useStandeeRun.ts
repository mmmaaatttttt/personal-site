"use client";

import { useCallback, useEffect, useState } from "react";
import { useTickLoop } from "@/hooks/useTickLoop";
import { pickDraw, pickInitialOwned } from "../../utils";
import { TICK_INTERVAL_MS } from "./constants";

interface RunState {
  tallies: number[];
  randomDraws: number;
  guaranteedDraws: number;
  lastDrawnIndex: number | null;
}

function initialRunState(numStandees: number, alreadyOwned: number): RunState {
  return {
    tallies: pickInitialOwned(numStandees, alreadyOwned).map((owned) =>
      owned ? 1 : 0,
    ),
    randomDraws: 0,
    guaranteedDraws: 0,
    lastDrawnIndex: null,
  };
}

function emptyRunState(numStandees: number): RunState {
  return {
    tallies: new Array(numStandees).fill(0),
    randomDraws: 0,
    guaranteedDraws: 0,
    lastDrawnIndex: null,
  };
}

export function useStandeeRun(
  numStandees: number,
  alreadyOwned: number,
  switchStrategyAfter: number,
  speed: number,
) {
  const [state, setState] = useState<RunState>(() =>
    emptyRunState(numStandees),
  );

  const isFinished = state.tallies.every((tally) => tally > 0);

  const { playing, toggle, stop } = useTickLoop({
    tickIntervalMs: TICK_INTERVAL_MS / speed,
    onTick: () => {
      setState((prev) => {
        const found = prev.tallies.map((tally) => tally > 0);
        const draw = pickDraw(found, switchStrategyAfter);
        const tallies = [...prev.tallies];
        tallies[draw.index] += 1;
        return {
          tallies,
          randomDraws: prev.randomDraws + (draw.strategy === "random" ? 1 : 0),
          guaranteedDraws:
            prev.guaranteedDraws + (draw.strategy === "guaranteed" ? 1 : 0),
          lastDrawnIndex: draw.index,
        };
      });
    },
  });

  const reset = useCallback(() => {
    stop();
    setState(initialRunState(numStandees, alreadyOwned));
  }, [stop, numStandees, alreadyOwned]);

  useEffect(() => {
    stop();
    setState(initialRunState(numStandees, alreadyOwned));
  }, [stop, numStandees, alreadyOwned]);

  useEffect(() => {
    if (isFinished) stop();
  }, [isFinished, stop]);

  return {
    tallies: state.tallies,
    randomDraws: state.randomDraws,
    guaranteedDraws: state.guaranteedDraws,
    lastDrawnIndex: state.lastDrawnIndex,
    playing,
    isFinished,
    toggle,
    reset,
  };
}
