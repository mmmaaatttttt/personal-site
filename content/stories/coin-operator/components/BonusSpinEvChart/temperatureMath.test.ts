import { describe, expect, it } from "vitest";
import { temperatureFromSlider } from "./temperatureMath";

describe("temperatureFromSlider", () => {
  it("maps r=1 (fully rational) to T=0", () => {
    expect(temperatureFromSlider(1)).toBe(0);
  });

  it("maps r=0 (fully random) to T=Infinity", () => {
    expect(temperatureFromSlider(0)).toBe(Infinity);
  });

  it("maps r=0.5 to T=1", () => {
    expect(temperatureFromSlider(0.5)).toBeCloseTo(1, 10);
  });

  it("decreases monotonically as r increases", () => {
    const low = temperatureFromSlider(0.2);
    const high = temperatureFromSlider(0.8);

    expect(high).toBeLessThan(low);
  });
});
