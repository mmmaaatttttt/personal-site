import { afterEach, describe, expect, it, vi } from "vitest";

describe("useMarketScrubber module", () => {
  afterEach(() => {
    vi.doUnmock("../../data");
    vi.resetModules();
  });

  it("falls back to the last data point when no ChatGPT-era row exists", async () => {
    vi.doMock("../../data", () => ({
      marketData: [
        { date: "2020-01", sp500: 100, jobOpenings: 1000 },
        { date: "2020-02", sp500: 110, jobOpenings: 1100 },
      ],
    }));
    vi.resetModules();

    const mod = await import("./useMarketScrubber");
    expect(mod.INITIAL_IDX).toBe(mod.parsed.length - 1);
  });
});
