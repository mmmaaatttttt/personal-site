import { describe, expect, it } from "vitest";
import { petrieTable1, petrieTable2 } from "./data";

describe("dishing-on-petrie data", () => {
  it.each([
    ["petrieTable1", petrieTable1],
    ["petrieTable2", petrieTable2],
  ])("%s has a header row and data rows of equal width", (_, table) => {
    expect(table.length).toBeGreaterThan(1);
    const headerWidth = table[0].length;
    for (const row of table) {
      expect(row).toHaveLength(headerWidth);
    }
  });
});
