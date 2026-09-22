import { describe, expect, it } from "vitest";
import { usHappinessRankTable } from "./data";

describe("usHappinessRankTable", () => {
  it("has a header row followed by one row per year in the source", () => {
    expect(usHappinessRankTable[0]).toEqual(["Year", "US world rank"]);
    expect(usHappinessRankTable).toHaveLength(15);
  });

  it("does not include 2013, which is absent from the source file", () => {
    const row2013 = usHappinessRankTable.find((row) => row[0] === "2013");
    expect(row2013).toBeUndefined();
  });

  it("shows the US falling out of the top 20 in 2024, its all-time low", () => {
    const rank2024 = usHappinessRankTable.find((row) => row[0] === "2024");
    expect(rank2024).toEqual(["2024", "24th"]);
  });

  it("shows a partial recovery in 2025", () => {
    const rank2025 = usHappinessRankTable.find((row) => row[0] === "2025");
    expect(rank2025).toEqual(["2025", "23rd"]);
  });
});
