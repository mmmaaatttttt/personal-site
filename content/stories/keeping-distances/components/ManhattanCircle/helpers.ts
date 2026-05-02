export function generateCirclePoints(
  radius: number,
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i < radius; i++) {
    points.push(
      { x: radius - i, y: i },
      { x: i === 0 ? 0 : -i, y: radius - i },
      { x: i - radius, y: i === 0 ? 0 : -i },
      { x: i, y: i - radius },
    );
  }
  return points;
}
