import COLORS from "@/utils/styles";

export const ROW_COUNT = 6;
export const COL_COUNT = 9;
export const GRID_WIDTH = 450;
export const STROKE_WIDTH = 6;
export const STORAGE_KEY = "segments";
export const GERRYMANDER_COUNTS_EVENT = "gerrymander:counts";
export const GERRYMANDER_COUNTS_KEY = "gerrymanderCounts";
export const COLOR_RANGE: [string, string] = [COLORS.DARK_BLUE, COLORS.RED];

const PADDING_SCALE = 0.075;

export function computeGridDimensions(
  width: number,
  rowCount: number,
  colCount: number
) {
  const squareWidth = width / colCount;
  const height = rowCount * squareWidth;
  const paddingX = width * PADDING_SCALE;
  const paddingY = height * PADDING_SCALE;
  return { width, height, paddingX, paddingY };
}

export function getInitialSegments(rowCount: number, colCount: number): boolean[][] {
  return Array.from({ length: rowCount * 2 - 1 }, (_, i) =>
    Array(colCount - 1 + (i % 2)).fill(false)
  );
}
