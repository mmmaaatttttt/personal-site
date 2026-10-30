export function clientToSvgPoint(
  svg: SVGSVGElement | null | undefined,
  clientX: number,
  clientY: number,
): { x: number; y: number } | null {
  const matrix = svg?.getScreenCTM();
  if (!matrix) return null;
  return {
    x: (clientX - matrix.e) / matrix.a,
    y: (clientY - matrix.f) / matrix.d,
  };
}
