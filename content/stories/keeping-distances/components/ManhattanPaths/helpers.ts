import type { ScaleLinear } from "d3-scale";

export function generatePathOptions(
  pathHeight: number,
  pathWidth: number,
  memo: Record<string, string[]> = {},
  paths: string[] = [""],
): string[] {
  if (pathHeight + pathWidth === 0) return paths;
  if (pathWidth === 0) return paths.map((p) => p + "y".repeat(pathHeight));
  if (pathHeight === 0) return paths.map((p) => p + "x".repeat(pathWidth));
  const key = `${pathHeight}|${pathWidth}`;
  if (memo[key]) return memo[key];
  memo[key] = [
    ...generatePathOptions(pathHeight - 1, pathWidth, memo, paths).map(
      (p) => p + "y",
    ),
    ...generatePathOptions(pathHeight, pathWidth - 1, memo, paths).map(
      (p) => p + "x",
    ),
  ];
  return memo[key];
}

export function generatePathPoints(
  pathStr: string,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [{ x: 0, y: 0 }];
  for (const xOrY of pathStr) {
    const prev = { ...points[points.length - 1] };
    if (xOrY === "x") prev.x++;
    else prev.y++;
    points.push(prev);
  }
  return points;
}

export function generateGridPoints(
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>,
): { x: number; y: number }[] {
  const [xMin, xMax] = xScale.domain();
  const [yMin, yMax] = yScale.domain();
  const xLen = xMax - xMin + 1;
  const yLen = yMax - yMin + 1;
  return Array.from({ length: xLen * yLen - 1 }, (_, idx) => {
    const x = (idx + 1) % xLen;
    const y = Math.floor((idx + 1) / yLen);
    return { x, y };
  });
}
