import { describe, expect, it } from "vitest";
import { formatSignificantPercentage } from "./tableData";

describe("formatSignificantPercentage", () => {
  it("returns 0% for a probability of exactly 0", () => {
    expect(formatSignificantPercentage(0)).toBe("0%");
  });

  it("formats a common probability with 3 significant figures by default", () => {
    expect(formatSignificantPercentage(0.256)).toBe("25.6%");
  });

  it("shows more decimals for a rare probability so digits aren't lost", () => {
    expect(formatSignificantPercentage(0.000001234)).toBe("0.000123%");
  });

  it("respects a custom significant-figure count", () => {
    expect(formatSignificantPercentage(0.256, 2)).toBe("26%");
  });
});
