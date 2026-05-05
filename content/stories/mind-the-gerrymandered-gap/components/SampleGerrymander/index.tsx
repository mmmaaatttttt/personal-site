"use client";

import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import {
  COL_COUNT,
  COLOR_RANGE,
  computeGridDimensions,
  GERRYMANDER_COUNTS_EVENT,
  GERRYMANDER_COUNTS_KEY,
  GRID_WIDTH,
  getInitialSegments,
  ROW_COUNT,
  STORAGE_KEY,
  STROKE_WIDTH,
} from "./constants";
import DistrictStatus from "./DistrictStatus";
import { countRegions } from "./floodFill";
import GerrymanderGrid from "./GerrymanderGrid";
import InteractiveGrid from "./InteractiveGrid";

interface SampleGerrymanderProps {
  rowCount?: number;
  colCount?: number;
  colorRange?: [string, string];
  onDistrictCountsChange?: (counts: [number, number][] | null) => void;
}

const SampleGerrymander: FC<SampleGerrymanderProps> = ({
  rowCount = ROW_COUNT,
  colCount = COL_COUNT,
  colorRange = COLOR_RANGE,
  onDistrictCountsChange,
}) => {
  const [savedSegments, setSavedSegments, removeSavedSegments] =
    useLocalStorage<boolean[][] | null>(STORAGE_KEY, null);
  const [, setGerrymanderCounts] = useLocalStorage<[number, number][] | null>(
    GERRYMANDER_COUNTS_KEY,
    null,
  );

  // useSyncExternalStore reads localStorage synchronously, so savedSegments is
  // available on the first render — no mount effect needed to load it.
  const [segments, setSegments] = useState<boolean[][]>(() => {
    const valid =
      Array.isArray(savedSegments) && savedSegments.length === rowCount * 2 - 1;
    return valid ? savedSegments : getInitialSegments(rowCount, colCount);
  });
  const [saveable, setSaveable] = useState(false);

  const onChangeRef = useRef(onDistrictCountsChange);
  onChangeRef.current = onDistrictCountsChange;

  const districts = useMemo(
    () => countRegions(segments, rowCount, colCount),
    [segments, rowCount, colCount],
  );

  // Propagate district counts to sibling components and shared localStorage key
  useEffect(() => {
    const valid =
      districts.length === rowCount &&
      districts.every((d) => d.length === colCount);
    const counts = valid
      ? districts.map(
          (d) =>
            [
              d.filter(([r]) => r % 2 === 0).length,
              d.filter(([r]) => r % 2 === 1).length,
            ] as [number, number],
        )
      : null;
    onChangeRef.current?.(counts);
    setGerrymanderCounts(counts);
    window.dispatchEvent(
      new CustomEvent(GERRYMANDER_COUNTS_EVENT, { detail: counts }),
    );
  }, [districts, rowCount, colCount, setGerrymanderCounts]);

  const handleSegmentUpdate = useCallback(
    (row: number, col: number, status: boolean | null) => {
      if (status === null) return;
      setSegments((prev) => {
        const next = prev.map((r) => [...r]);
        next[row][col] = status;
        return next;
      });
      setSaveable(true);
    },
    [],
  );

  const handleSave = useCallback(() => {
    setSavedSegments(segments);
    setSaveable(false);
  }, [segments, setSavedSegments]);

  const handleReset = useCallback(() => {
    removeSavedSegments();
    setSegments(getInitialSegments(rowCount, colCount));
    setSaveable(false);
  }, [rowCount, colCount, removeSavedSegments]);

  const dims = useMemo(
    () => computeGridDimensions(GRID_WIDTH, rowCount, colCount),
    [rowCount, colCount],
  );

  return (
    <ColumnLayout break="sm" sizes={[3, 2]}>
      <GerrymanderGrid
        {...dims}
        rowCount={rowCount}
        colCount={colCount}
        colorRange={colorRange}
      >
        <InteractiveGrid
          {...dims}
          strokeWidth={STROKE_WIDTH}
          rowCount={rowCount}
          colCount={colCount}
          segments={segments}
          onSegmentUpdate={handleSegmentUpdate}
        />
      </GerrymanderGrid>
      <DistrictStatus
        rowCount={rowCount}
        colCount={colCount}
        districts={districts}
        saveable={saveable}
        onSave={handleSave}
        onReset={handleReset}
      />
    </ColumnLayout>
  );
};

export default SampleGerrymander;
