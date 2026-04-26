"use client";

import { FC, useState, useEffect, useCallback, useRef, useMemo } from "react";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import GerrymanderGrid from "./GerrymanderGrid";
import InteractiveGrid from "./InteractiveGrid";
import DistrictStatus from "./DistrictStatus";
import {
  ROW_COUNT,
  COL_COUNT,
  GRID_WIDTH,
  STROKE_WIDTH,
  STORAGE_KEY,
  COLOR_RANGE,
  computeGridDimensions,
  getInitialSegments,
} from "./constants";
import { countRegions } from "./floodFill";

interface SampleGerrymanderProps {
  rowCount?: number;
  colCount?: number;
  colorRange?: [string, string];
  onDistrictCountsChange: (counts: [number, number][] | null) => void;
}

const SampleGerrymander: FC<SampleGerrymanderProps> = ({
  rowCount = ROW_COUNT,
  colCount = COL_COUNT,
  colorRange = COLOR_RANGE,
  onDistrictCountsChange,
}) => {
  const [segments, setSegments] = useState<boolean[][]>(() =>
    getInitialSegments(rowCount, colCount)
  );
  const [districts, setDistricts] = useState<[number, number][][]>([]);
  const [saveable, setSaveable] = useState(false);

  const onChangeRef = useRef(onDistrictCountsChange);
  onChangeRef.current = onDistrictCountsChange;

  // Load saved segments from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as boolean[][];
        // Validate dimensions before trusting saved data
        if (Array.isArray(parsed) && parsed.length === rowCount * 2 - 1) {
          setSegments(parsed);
        }
      } catch {
        // ignore malformed data
      }
    }
  // rowCount is stable (prop default), so this runs effectively once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recompute districts and propagate counts whenever segments change
  useEffect(() => {
    const newDistricts = countRegions(segments, rowCount, colCount);
    setDistricts(newDistricts);
    const valid =
      newDistricts.length === rowCount &&
      newDistricts.every((d) => d.length === colCount);
    onChangeRef.current(
      valid
        ? newDistricts.map((d) => [
            d.filter(([r]) => r % 2 === 0).length,
            d.filter(([r]) => r % 2 === 1).length,
          ])
        : null
    );
  }, [segments, rowCount, colCount]);

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
    []
  );

  const handleSave = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(segments));
    setSaveable(false);
  }, [segments]);

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSegments(getInitialSegments(rowCount, colCount));
    setSaveable(false);
  }, [rowCount, colCount]);

  const dims = useMemo(
    () => computeGridDimensions(GRID_WIDTH, rowCount, colCount),
    [rowCount, colCount]
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
