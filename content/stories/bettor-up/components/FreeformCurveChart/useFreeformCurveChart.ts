"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { findFixedPoints } from "../../mathUtils";
import {
  bucketsToFunction,
  bucketsToPoints,
  createInitialBuckets,
  numericalDerivative,
  paintSegment,
  RESOLUTION,
} from "./utils";

export default function useFreeformCurveChart() {
  const [buckets, setBuckets] = useState<number[]>(() =>
    createInitialBuckets(RESOLUTION),
  );
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const handleDrawStart = useCallback((x: number, y: number) => {
    lastPointRef.current = { x, y };
  }, []);

  const handleDrawMove = useCallback((x: number, y: number) => {
    const last = lastPointRef.current;
    if (!last) return;
    setBuckets((prev) => paintSegment(prev, RESOLUTION, last.x, last.y, x, y));
    lastPointRef.current = { x, y };
  }, []);

  const handleDrawEnd = useCallback(() => {
    lastPointRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setBuckets(createInitialBuckets(RESOLUTION));
  }, []);

  const curvePoints = useMemo(
    () => bucketsToPoints(buckets, RESOLUTION),
    [buckets],
  );
  const crossings = useMemo(() => {
    const map = bucketsToFunction(buckets, RESOLUTION);
    const mapDerivative = (probability: number) =>
      numericalDerivative(map, probability);
    return findFixedPoints(map, mapDerivative);
  }, [buckets]);

  return {
    curvePoints,
    crossings,
    handleDrawStart,
    handleDrawMove,
    handleDrawEnd,
    reset,
  };
}
