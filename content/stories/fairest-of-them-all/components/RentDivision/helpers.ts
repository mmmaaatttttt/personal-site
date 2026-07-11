import { interpolate } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";

export interface PointData {
  x: number;
  y: number;
  color: string | null;
  prices: number[];
  r: number;
  label: string;
}

interface Corner {
  x: number;
  y: number;
  prices: number[];
}

/**
 * Determines the label of a point given two labeled neighbors.
 * Every triangle must have distinct labels, so the third label is the
 * one not already used by the two neighbors.
 */
function deduceLabel(
  neighbor1: PointData,
  neighbor2: PointData,
  names: string[],
): string {
  const label1 = neighbor1.label;
  const label2 = neighbor2.label;
  return (
    names
      .map((name) => name[0])
      .find((ltr) => ltr !== label1 && ltr !== label2) ?? ""
  );
}

/**
 * Generates a single interpolated mesh point between pt1 and pt2.
 */
function generatePoint(
  pt1: Corner,
  pt2: Corner,
  frac: number,
  meshLevels: number,
  initialR: number,
): PointData {
  return {
    x: interpolate(pt1.x, pt2.x, frac),
    y: interpolate(pt1.y, pt2.y, frac),
    color: COLORS.BLACK,
    prices: pt1.prices.map((price, i) =>
      interpolate(price, pt2.prices[i], frac),
    ),
    r: initialR / meshLevels,
    label: "",
  };
}

/**
 * Adds labels to a fully-generated (label-free) grid of points.
 * Labels are dedcued from the rule that each small triangle must have
 * three distinct labels, starting from the fixed corner assignments.
 */
function generateLabels(points: PointData[][], names: string[]): PointData[][] {
  points[0][0].label = names[0][0];
  points[1][0].label = names[1][0];
  points[1][1].label = names[2][0];
  for (let rowIdx = 2; rowIdx < points.length; rowIdx++) {
    for (let cellIdx = 1; cellIdx < rowIdx; cellIdx++) {
      const leftParent = points[rowIdx - 1][cellIdx - 1];
      const rightParent = points[rowIdx - 1][cellIdx];
      points[rowIdx][cellIdx].label = deduceLabel(
        leftParent,
        rightParent,
        names,
      );
    }
    points[rowIdx][0].label = deduceLabel(
      points[rowIdx - 1][0],
      points[rowIdx][1],
      names,
    );
    points[rowIdx][rowIdx].label = deduceLabel(
      points[rowIdx - 1][rowIdx - 1],
      points[rowIdx][rowIdx - 1],
      names,
    );
  }
  return points;
}

/**
 * Generates the full 2D grid of mesh points for the rent-division triangle.
 *
 * Returns an array of rows, where row i has i+1 points:
 *   [ [top], [left, right], [left, mid, right], ... ]
 */
export function generateAllPoints(
  meshLevels: number,
  corners: Corner[],
  initialR: number,
  names: string[],
): PointData[][] {
  const rowCount = 2 ** (meshLevels - 1) + 1;
  const pointsWithoutLabels: PointData[][] = Array.from(
    { length: rowCount },
    (_, rowIdx) => {
      if (rowIdx === 0) {
        return [
          {
            ...corners[0],
            color: COLORS.BLACK,
            r: initialR / meshLevels,
            label: "",
          },
        ];
      }
      const fraction = rowIdx / (rowCount - 1);
      const [top, left, right] = corners;
      const firstPoint = generatePoint(
        left,
        top,
        fraction,
        meshLevels,
        initialR,
      );
      const lastPoint = generatePoint(
        right,
        top,
        fraction,
        meshLevels,
        initialR,
      );
      if (rowIdx === 1) return [firstPoint, lastPoint];
      const points: PointData[] = [firstPoint];
      for (let i = 1; i < rowIdx; i++) {
        points.push(
          generatePoint(
            lastPoint,
            firstPoint,
            i / rowIdx,
            meshLevels,
            initialR,
          ),
        );
      }
      points.push(lastPoint);
      return points;
    },
  );
  return generateLabels(pointsWithoutLabels, names);
}

/**
 * Blends two hex colors. fraction=1 returns color1, fraction=0 returns color2.
 * Equivalent to polished's mix(fraction, color1, color2).
 */
export function mixColors(
  fraction: number,
  color1: string,
  color2: string,
): string {
  const parse = (hex: string) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(color1);
  const [r2, g2, b2] = parse(color2);
  const r = Math.round(fraction * r1 + (1 - fraction) * r2);
  const g = Math.round(fraction * g1 + (1 - fraction) * g2);
  const b = Math.round(fraction * b1 + (1 - fraction) * b2);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
