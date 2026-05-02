import { describe, expect, it } from "vitest";
import COLORS from "@/utils/styles";
import type { ElectionRow, StateSummary } from "../../data";
import {
  buildBarData,
  computeFillValue,
  formatTooltip,
  getStateBarColor,
  getStateCode,
} from "./helpers";

describe("getStateCode", () => {
  it("returns state abbreviation for a known state", () => {
    expect(getStateCode("Pennsylvania")).toBe("PA");
    expect(getStateCode("California")).toBe("CA");
    expect(getStateCode("Texas")).toBe("TX");
  });

  it("falls back to state name for unknown state", () => {
    expect(getStateCode("Narnia")).toBe("Narnia");
  });
});

describe("getStateBarColor", () => {
  it("returns RED for large positive seat gap", () => {
    expect(getStateBarColor(3)).toBe(COLORS.RED);
    expect(getStateBarColor(2)).toBe(COLORS.RED);
  });

  it("returns DARK_BLUE for large negative seat gap", () => {
    expect(getStateBarColor(-3)).toBe(COLORS.DARK_BLUE);
    expect(getStateBarColor(-2)).toBe(COLORS.DARK_BLUE);
  });

  it("returns lightened red for small positive seat gap", () => {
    const result = getStateBarColor(1);
    expect(result).not.toBe(COLORS.RED);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("returns lightened blue for small negative seat gap", () => {
    const result = getStateBarColor(-1);
    expect(result).not.toBe(COLORS.DARK_BLUE);
    expect(result).toMatch(/^#[0-9a-f]{6}$/);
  });

  it("returns lightened color for zero seat gap", () => {
    const result = getStateBarColor(0);
    expect(result).not.toBe(COLORS.DARK_BLUE);
  });
});

describe("computeFillValue", () => {
  it("returns null when yearRowCount < minElectors", () => {
    expect(computeFillValue(1, 3, 0.1)).toBeNull();
    expect(computeFillValue(2, 3, 0.1)).toBeNull();
  });

  it("returns null when efficiencyGap is undefined", () => {
    expect(computeFillValue(5, 3, undefined)).toBeNull();
  });

  it("returns efficiencyGap when yearRowCount >= minElectors", () => {
    expect(computeFillValue(3, 3, 0.15)).toBe(0.15);
    expect(computeFillValue(5, 3, -0.2)).toBe(-0.2);
  });

  it("returns negative efficiency gap correctly", () => {
    expect(computeFillValue(4, 2, -0.05)).toBe(-0.05);
  });
});

describe("formatTooltip", () => {
  it("returns 'Not enough districts' when count < minElectors", () => {
    expect(formatTooltip(1, 3, 0.1, 0.2)).toBe("Not enough districts.");
  });

  it("returns 'No data' when efficiencyGap is undefined", () => {
    expect(formatTooltip(5, 3, undefined, undefined)).toBe("No data.");
  });

  it("returns formatted array for Republican advantage", () => {
    const result = formatTooltip(5, 3, 0.1, 0.5) as string[];
    expect(result).toHaveLength(3);
    expect(result[0]).toContain("Republicans");
    expect(result[0]).toContain("10.00%");
    expect(result[1]).toBe("5 districts total.");
    expect(result[2]).toContain("seat gap");
  });

  it("returns formatted array for Democrat advantage", () => {
    const result = formatTooltip(5, 3, -0.15, -0.75) as string[];
    expect(result[0]).toContain("Democrats");
    expect(result[0]).toContain("15.00%");
  });
});

describe("buildBarData", () => {
  const electionData: ElectionRow[] = [
    { year: 2016, state: "Pennsylvania", district: 1, dem: 1000, rep: 800, demEst: false, repEst: false },
    { year: 2016, state: "Pennsylvania", district: 2, dem: 900, rep: 1100, demEst: false, repEst: false },
    { year: 2016, state: "Ohio", district: 1, dem: 500, rep: 600, demEst: false, repEst: false },
    { year: 2014, state: "Pennsylvania", district: 1, dem: 800, rep: 900, demEst: false, repEst: false },
    { year: 2014, state: "Pennsylvania", district: 2, dem: 750, rep: 850, demEst: false, repEst: false },
  ];

  const stateSummaries: StateSummary[] = [
    { state: "Pennsylvania", efficiencyGaps: { 2016: 0.1, 2014: 0.05 }, seatGaps: { 2016: 2.0, 2014: 0.5 } },
    { state: "Ohio", efficiencyGaps: { 2016: -0.08 }, seatGaps: { 2016: -0.8 } },
  ];

  it("filters out states with fewer districts than minElectors", () => {
    const result = buildBarData(2016, 2, electionData, stateSummaries);
    const keys = result.map((d) => d.key);
    expect(keys).toContain("PA");
    expect(keys).not.toContain("OH");
  });

  it("includes all states when minElectors is 1", () => {
    const result = buildBarData(2016, 1, electionData, stateSummaries);
    expect(result).toHaveLength(2);
  });

  it("sorts bars by ascending height", () => {
    const result = buildBarData(2016, 1, electionData, stateSummaries);
    for (let i = 1; i < result.length; i++) {
      expect(result[i].height).toBeGreaterThanOrEqual(result[i - 1].height);
    }
  });

  it("returns correct heights from seatGap magnitude", () => {
    const result = buildBarData(2016, 1, electionData, stateSummaries);
    const pa = result.find((d) => d.key === "PA");
    expect(pa?.height).toBeCloseTo(2.0);
  });

  it("returns empty array when no state meets minElectors threshold", () => {
    const result = buildBarData(2016, 10, electionData, stateSummaries);
    expect(result).toHaveLength(0);
  });

  it("only counts districts from the requested year", () => {
    const result = buildBarData(2014, 2, electionData, stateSummaries);
    expect(result).toHaveLength(1);
    expect(result[0].key).toBe("PA");
  });
});
