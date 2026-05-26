import { describe, expect, it } from "vitest";
import { getOpaqueLightColor } from "./utils";

describe("getOpaqueLightColor", () => {
  it("blends a valid 7-char hex color with white and returns an rgb string", () => {
    const result = getOpaqueLightColor("#000000");
    expect(result).toMatch(/^rgb\(/);
  });

  it("returns white-ish for a full white input", () => {
    const result = getOpaqueLightColor("#ffffff");
    expect(result).toMatch(/^rgb\(255,/);
  });

  it("returns the input unchanged for a non-hex string", () => {
    expect(getOpaqueLightColor("red")).toBe("red");
  });

  it("returns the input unchanged for a 3-char short hex", () => {
    expect(getOpaqueLightColor("#fff")).toBe("#fff");
  });

  it("returns the input unchanged for an 8-char hex", () => {
    expect(getOpaqueLightColor("#ffffffff")).toBe("#ffffffff");
  });

  it("returns the input unchanged for an empty string", () => {
    expect(getOpaqueLightColor("")).toBe("");
  });
});
