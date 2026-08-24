import { afterEach, describe, expect, it, vi } from "vitest";
import { simulateGame } from "./simulateGame";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("simulateGame", () => {
  it("wins when every fruit color is harvested before the raven arrives", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.1).mockReturnValueOnce(0.3);
    const strategyFn = vi.fn();
    expect(simulateGame([1, 1], 5, 1, strategyFn)).toBe(true);
    expect(strategyFn).not.toHaveBeenCalled();
  });

  it("loses when the raven reaches the basket first", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.6);
    const strategyFn = vi.fn();
    expect(simulateGame([5, 5], 1, 1, strategyFn)).toBe(false);
  });

  it("resolves wild card draws via the strategy function", () => {
    vi.spyOn(Math, "random").mockReturnValueOnce(0.9).mockReturnValueOnce(0.1);
    const strategyFn = vi.fn(() => 1);
    expect(simulateGame([1, 1], 5, 1, strategyFn)).toBe(true);
    expect(strategyFn).toHaveBeenCalledTimes(1);
  });

  it("clamps a fruit count at zero instead of going negative", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.3);
    const strategyFn = vi.fn();
    expect(simulateGame([1, 1], 5, 1, strategyFn)).toBe(true);
  });
});
