import { describe, expect, it } from "vitest";
import { hexToRgba, paddingObj } from "./styles";

describe("hexToRgba", () => {
  it("converts a hex color to rgba", () => {
    expect(hexToRgba("#ff5700", 1)).toBe("rgba(255, 87, 0, 1)");
  });

  it("applies the given opacity", () => {
    expect(hexToRgba("#ffffff", 0.5)).toBe("rgba(255, 255, 255, 0.5)");
  });
});

describe("paddingObj", () => {
  it("expands a number to all four sides", () => {
    expect(paddingObj(10)).toEqual({
      top: 10,
      bottom: 10,
      left: 10,
      right: 10,
    });
  });

  it("passes through an explicit padding object unchanged", () => {
    const pad = { top: 1, bottom: 2, left: 3, right: 4 };
    expect(paddingObj(pad)).toBe(pad);
  });
});
