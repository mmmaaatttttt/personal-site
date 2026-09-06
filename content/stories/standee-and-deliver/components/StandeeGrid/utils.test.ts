import { describe, expect, it } from "vitest";
import {
  getGridColumnClass,
  getTallyBadgeClass,
  groupByCharacter,
} from "./utils";

const mario = (pose: string) => ({
  character: "Mario",
  pose,
  image: `/images/standees/mario_${pose.toLowerCase()}.png`,
});
const luigi = (pose: string) => ({
  character: "Luigi",
  pose,
  image: `/images/standees/luigi_${pose.toLowerCase()}.png`,
});

describe("groupByCharacter", () => {
  it("groups consecutive standees by character, preserving order", () => {
    const standeeData = [mario("Jumping"), mario("Swimming"), luigi("Jumping")];
    const groups = groupByCharacter(standeeData, [0, 1, 2]);
    expect(groups).toEqual([
      {
        character: "Mario",
        items: [
          { index: 0, standee: standeeData[0], tally: 0 },
          { index: 1, standee: standeeData[1], tally: 1 },
        ],
      },
      {
        character: "Luigi",
        items: [{ index: 2, standee: standeeData[2], tally: 2 }],
      },
    ]);
  });

  it("puts a lone visible standee from the next character in its own group", () => {
    const standeeData = [mario("Jumping"), luigi("Jumping")];
    const groups = groupByCharacter(standeeData, [1, 0]);
    expect(groups.map((g) => g.character)).toEqual(["Mario", "Luigi"]);
    expect(groups[1].items).toHaveLength(1);
  });

  it("returns an empty array for an empty slice", () => {
    expect(groupByCharacter([], [])).toEqual([]);
  });

  it("merges non-consecutive standees from the same character into one group", () => {
    const standeeData = [mario("Jumping"), luigi("Jumping"), mario("Swimming")];
    const groups = groupByCharacter(standeeData, [0, 0, 0]);
    expect(groups.map((g) => g.character)).toEqual(["Mario", "Luigi"]);
    expect(groups[0].items).toHaveLength(2);
  });
});

describe("getGridColumnClass", () => {
  it("gives a solo character the full row", () => {
    expect(getGridColumnClass(1)).toBe("grid-cols-1");
  });

  it("uses two columns for 2-4 characters", () => {
    expect(getGridColumnClass(2)).toBe("grid-cols-1 sm:grid-cols-2");
    expect(getGridColumnClass(3)).toBe("grid-cols-1 sm:grid-cols-2");
    expect(getGridColumnClass(4)).toBe("grid-cols-1 sm:grid-cols-2");
  });

  it("uses three columns for 5-8 characters", () => {
    expect(getGridColumnClass(5)).toBe(
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    );
    expect(getGridColumnClass(8)).toBe(
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    );
  });

  it("uses four columns for 9 or more characters", () => {
    expect(getGridColumnClass(9)).toBe(
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    );
    expect(getGridColumnClass(13)).toBe(
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    );
  });
});

describe("getTallyBadgeClass", () => {
  it("uses the same fixed position as the other tiers for a solo character", () => {
    expect(getTallyBadgeClass(1)).toBe("-top-0.5 right-0.25 text-2xl");
  });

  it("adds leading-none only for the 2-4 character tier, where text-lg's own line-height reads as extra top margin", () => {
    expect(getTallyBadgeClass(4)).toBe(
      "-top-0.5 right-0.25 text-lg leading-none",
    );
  });

  it("falls back to the original small badge, untouched, once tiles get small again (5+ characters)", () => {
    expect(getTallyBadgeClass(5)).toBe("-top-0.5 right-0.25 text-[10px]");
    expect(getTallyBadgeClass(13)).toBe("-top-0.5 right-0.25 text-[10px]");
  });
});
