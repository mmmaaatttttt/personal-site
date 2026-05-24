import { average, mod } from "@/utils/mathHelpers";

export interface Point {
  x: number;
  y: number;
}

// Generates n evenly-spaced vertices on a regular polygon centered in the SVG.
// Distance is normalized so the area of the corresponding circle stays constant
// as side count changes, anchored to the initialSides count at distance=100.
export function generatePoints(
  newCount: number,
  initialSides: number,
  svgWidth: number,
  svgHeight: number,
): Point[] {
  return Array.from({ length: newCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / newCount - Math.PI / 2;
    const distance =
      (initialSides * 100 * Math.sin(Math.PI / initialSides)) /
      (newCount * Math.sin(Math.PI / newCount));
    return {
      x: svgWidth / 2 + distance * Math.cos(angle),
      y: svgHeight / 2 + distance * Math.sin(angle),
    };
  });
}

export function getPerimeter(points: Point[]): number {
  return points.reduce((len, pt, i) => {
    const next = points[mod(i + 1, points.length)];
    return len + Math.hypot(pt.x - next.x, pt.y - next.y);
  }, 0);
}

// Returns the center (centroid) and the radius of the circle with the same perimeter.
export function getCircleParams(points: Point[]): {
  x: number;
  y: number;
  r: number;
} {
  return {
    x: average(points, (p) => p.x),
    y: average(points, (p) => p.y),
    r: getPerimeter(points) / (2 * Math.PI),
  };
}

export interface AreaInfo {
  circleArea: string;
  polygonArea: string;
  ratio: string;
}

// Returns normalized area strings (scaled so baseArea = 100) and the polygon/circle ratio.
// Uses the shoelace formula for polygon area.
export function getAreaInfo(
  points: Point[],
  circleR: number,
  baseArea: number,
): AreaInfo {
  const circleArea = Math.PI * circleR ** 2;

  const polygonArea = Math.abs(
    points.reduce((area, pt, i) => {
      const next = points[mod(i + 1, points.length)];
      return area + (pt.x + next.x) * (-pt.y + next.y);
    }, 0) / 2,
  );

  return {
    circleArea: ((100 * circleArea) / baseArea).toFixed(2),
    polygonArea: ((100 * polygonArea) / baseArea).toFixed(2),
    ratio: (polygonArea / circleArea).toFixed(2),
  };
}
