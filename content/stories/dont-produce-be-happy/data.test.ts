import { describe, expect, it } from "vitest";
import { usHappinessByYear } from "./data";

describe("usHappinessByYear", () => {
  it("has one row per year from 2014-2025", () => {
    expect(usHappinessByYear).toHaveLength(12);
    expect(usHappinessByYear[0].year).toBe(2014);
    expect(usHappinessByYear.at(-1)?.year).toBe(2025);
  });

  it("does not include 2011, 2012, or 2013", () => {
    const years = usHappinessByYear.map((row) => row.year);
    expect(years).not.toContain(2011);
    expect(years).not.toContain(2012);
    expect(years).not.toContain(2013);
  });

  it("shows the US falling out of the top 20 in 2024, its all-time low", () => {
    const row2024 = usHappinessByYear.find((row) => row.year === 2024);
    expect(row2024?.rank).toBe(24);
  });

  it("shows a partial recovery in 2025", () => {
    const row2025 = usHappinessByYear.find((row) => row.year === 2025);
    expect(row2025?.rank).toBe(23);
    expect(row2025?.score).toBeGreaterThan(
      usHappinessByYear.find((row) => row.year === 2024)?.score ?? 0,
    );
  });
});
