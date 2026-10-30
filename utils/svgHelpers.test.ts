import { describe, expect, it, vi } from "vitest";
import { clientToSvgPoint } from "./svgHelpers";

const svgWithMatrix = (matrix: object | null) =>
  ({
    getScreenCTM: vi.fn().mockReturnValue(matrix),
  }) as unknown as SVGSVGElement;

describe("clientToSvgPoint", () => {
  it("converts client coordinates through the screen transform", () => {
    expect(
      clientToSvgPoint(svgWithMatrix({ a: 2, d: 4, e: 10, f: 20 }), 30, 60),
    ).toEqual({ x: 10, y: 10 });
  });

  it("returns null without an svg", () => {
    expect(clientToSvgPoint(null, 1, 2)).toBeNull();
    expect(clientToSvgPoint(undefined, 1, 2)).toBeNull();
  });

  it("returns null when the screen transform is unavailable", () => {
    expect(clientToSvgPoint(svgWithMatrix(null), 1, 2)).toBeNull();
  });
});
