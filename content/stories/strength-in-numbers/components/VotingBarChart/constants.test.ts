import { describe, expect, it } from "vitest";
import { richVotingRow, starvedVotingRow } from "../../testFixtures";
import { PARTY_BAR_OPTIONS, VOTERS_BAR_OPTIONS } from "./constants";

describe("VOTERS_BAR_OPTIONS", () => {
  it.each(VOTERS_BAR_OPTIONS)(
    "$label returns a number for a full row and null for a starved row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );
});

describe("PARTY_BAR_OPTIONS", () => {
  it.each(PARTY_BAR_OPTIONS)(
    "$label returns a number for a full row",
    (option) => {
      expect(typeof option.accessor(richVotingRow)).toBe("number");
    },
  );

  it.each(PARTY_BAR_OPTIONS.filter((o) => !["0", "1", "14"].includes(o.value)))(
    "$label returns null for a starved row",
    (option) => {
      expect(option.accessor(starvedVotingRow)).toBeNull();
    },
  );
});
