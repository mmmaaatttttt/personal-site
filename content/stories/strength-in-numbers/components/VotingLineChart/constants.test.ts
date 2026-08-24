import { describe, expect, it } from "vitest";
import { richVotingRow, starvedVotingRow } from "../../testFixtures";
import { VOTERS_LINE_OPTIONS, WORKERS_LINE_OPTIONS } from "./constants";

describe("VOTERS_LINE_OPTIONS", () => {
  it.each(VOTERS_LINE_OPTIONS)(
    "$label returns a number for a full row and null for a starved row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );
});

describe("WORKERS_LINE_OPTIONS", () => {
  it.each(WORKERS_LINE_OPTIONS)(
    "$label returns a number for a full row and null for a starved row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );
});
