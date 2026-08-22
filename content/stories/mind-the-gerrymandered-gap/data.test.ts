import { describe, expect, it } from "vitest";
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
});
