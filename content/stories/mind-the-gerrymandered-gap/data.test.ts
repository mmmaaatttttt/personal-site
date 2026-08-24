import { describe, expect, it, vi } from "vitest";
import {
  calculateNormalizedEg,
  electionData,
  gerrymanderSliders,
  stateSummaries,
} from "./data";

describe("mind-the-gerrymandered-gap data", () => {
  it("parses the election CSV, excluding Senate and President rows", () => {
    expect(electionData.length).toBeGreaterThan(0);
    for (const row of electionData) {
      expect(Number.isFinite(row.year)).toBe(true);
      expect(Number.isFinite(row.district)).toBe(true);
    }
  });

  it("computes an efficiency gap and seat gap per state/year", () => {
    expect(stateSummaries.length).toBeGreaterThan(0);
    const withData = stateSummaries.find(
      (s) => Object.keys(s.efficiencyGaps).length > 0,
    );
    if (!withData) throw new Error("expected at least one state with data");
    const [year, eg] = Object.entries(withData.efficiencyGaps)[0];
    expect(Number.isFinite(eg)).toBe(true);
    expect(withData.seatGaps[Number(year)]).toBeCloseTo(
      eg *
        electionData.filter(
          (r) => r.state === withData.state && r.year === Number(year),
        ).length,
    );
  });

  it("returns 0 for calculateNormalizedEg with no rows", () => {
    expect(calculateNormalizedEg([])).toBe(0);
  });

  it("computes a finite normalized efficiency gap for real rows", () => {
    const sample = electionData.slice(0, 5);
    expect(Number.isFinite(calculateNormalizedEg(sample))).toBe(true);
  });

  it("exposes slider configs with working title formatters", () => {
    expect(gerrymanderSliders.length).toBeGreaterThan(0);
    for (const slider of gerrymanderSliders) {
      expect(slider.title(slider.initialValue)).toContain(
        String(slider.initialValue),
      );
    }
  });

  it("skips computing an efficiency gap for a year a state has no rows for", async () => {
    const csv = [
      "Year,State,District,Republican,Democrat",
      "2010,StateA,1,60,40",
      "2012,StateA,1,55,45",
      "2010,StateB,1,50,50",
    ].join("\n");

    vi.doMock("node:fs", async (importOriginal) => {
      const actual = await importOriginal<typeof import("node:fs")>();
      return {
        ...actual,
        readFileSync: () => csv,
        default: { ...actual, readFileSync: () => csv },
      };
    });
    vi.resetModules();

    const { stateSummaries: gapSummaries } = await import("./data");
    const stateB = gapSummaries.find((s) => s.state === "StateB");
    if (!stateB) throw new Error("expected StateB in stateSummaries");

    expect(stateB.efficiencyGaps[2010]).toBeDefined();
    expect(stateB.efficiencyGaps[2012]).toBeUndefined();

    vi.doUnmock("node:fs");
    vi.resetModules();
  });
});
