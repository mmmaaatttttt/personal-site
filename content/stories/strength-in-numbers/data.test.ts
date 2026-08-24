import { describe, expect, it } from "vitest";
import {
  allStates,
  pollWorkerAgeData,
  rawVotingData,
  voterTableData,
} from "./data";

describe("strength-in-numbers data", () => {
  it("parses the voting CSV into a non-empty list of states", () => {
    expect(allStates.length).toBeGreaterThan(0);
    expect(allStates).toEqual([...allStates].sort());
  });

  it("computes a saturation/turnout average for every state", () => {
    expect(voterTableData.length).toBe(allStates.length);
    for (const row of voterTableData) {
      expect(allStates).toContain(row.state);
      expect(Number.isFinite(row.averageSaturation)).toBe(true);
      expect(Number.isFinite(row.averageTurnout)).toBe(true);
    }
  });

  it("computes a 6-bucket age breakdown per poll-worker row", () => {
    expect(pollWorkerAgeData.length).toBeGreaterThan(0);
    for (const row of pollWorkerAgeData) {
      expect(row.ages).toHaveLength(6);
    }
  });

  it("carries the full raw voting row shape, including ages", () => {
    expect(rawVotingData.length).toBe(pollWorkerAgeData.length);
    const [first] = rawVotingData;
    expect(first.ages).toHaveLength(6);
    expect(typeof first.dem_percent).toBe("number");
    expect(typeof first.rep_percent).toBe("number");
  });
});
