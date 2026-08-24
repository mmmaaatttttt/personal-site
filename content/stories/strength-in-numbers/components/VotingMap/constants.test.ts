import { describe, expect, it } from "vitest";
import { richVotingRow, starvedVotingRow } from "../../testFixtures";
import { VOTERS_MAP_OPTIONS, WORKERS_MAP_OPTIONS } from "./constants";

const reportingZeroRow = {
  ...richVotingRow,
  num_jurisdictions: 10,
  jurisdictions_with_poll_worker_count: 0,
};

describe("VOTERS_MAP_OPTIONS", () => {
  it.each(VOTERS_MAP_OPTIONS)(
    "$label returns a number for a full row and null for a starved row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );
});

describe("WORKERS_MAP_OPTIONS", () => {
  it.each(WORKERS_MAP_OPTIONS)(
    "$label returns a number for a full row and null for a starved row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );

  it("% of Jurisdictions Reporting returns null when the reporting count itself is 0", () => {
    expect(WORKERS_MAP_OPTIONS[0].accessor(reportingZeroRow)).toBeNull();
  });
});
