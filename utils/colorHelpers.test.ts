import { describe, expect, it } from "vitest";
import { darkenHex, lightenHex } from "./colorHelpers";

describe("darkenHex", () => {
  it("returns black when amount is 1", () => {
    expect(darkenHex("#ffffff", 1)).toBe("#000000");
    expect(darkenHex("#ff0000", 1)).toBe("#000000");
  });

  it("returns the original color when amount is 0", () => {
    expect(darkenHex("#ffffff", 0)).toBe("#ffffff");
    expect(darkenHex("#52a081", 0)).toBe("#52a081");
  });

  it("darkens a color by 20%", () => {
    // #ffffff → each channel 255 * 0.8 = 204 = 0xcc
    expect(darkenHex("#ffffff", 0.2)).toBe("#cccccc");
  });

  it("darkens a color with mixed channels", () => {
    // #ff8f34 → r=255*0.8=204=0xcc, g=143*0.8=114=0x72, b=52*0.8=42=0x2a
    expect(darkenHex("#ff8f34", 0.2)).toBe("#cc722a");
  });

  it("clamps channels to 0, never going negative", () => {
    expect(darkenHex("#000000", 0.5)).toBe("#000000");
  });

  it("works without a leading #", () => {
    expect(darkenHex("ffffff", 1)).toBe("#000000");
  });
});

describe("lightenHex", () => {
  it("lightens black by 40% to 66 per channel", () => {
    expect(lightenHex("#000000", 0.4)).toBe("#666666");
  });

  it("leaves white unchanged", () => {
    expect(lightenHex("#ffffff", 0.4)).toBe("#ffffff");
  });

  it("lightens pure red by 50% (HSL: L=50%→100%) to white", () => {
    expect(lightenHex("#ff0000", 0.5)).toBe("#ffffff");
  });

  it("lightens a green-dominant color (max===g hue branch)", () => {
    // #00ff80: h=150°, s=100%, l=50% → lighten 10% → l=60% → #33ff99
    expect(lightenHex("#00ff80", 0.1)).toBe("#33ff99");
  });

  it("lightens a red-dominant color where blue > green (g<b hue branch)", () => {
    // #ff0080: h≈330°, s=100%, l=50% → lighten 10% → l=60% → #ff3399
    expect(lightenHex("#ff0080", 0.1)).toBe("#ff3399");
  });
});
