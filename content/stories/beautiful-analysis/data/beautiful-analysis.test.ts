import { describe, expect, it } from "vitest";
import { generateTooltipData } from "./beautiful-analysis";

describe("generateTooltipData", () => {
  it("formats episode title, id, and per-speaker counts with percentages", () => {
    const result = generateTooltipData({
      meta: { id: 12, title: "A Test Episode" },
      counts: { Chris: 75, Caller: 25 },
    });

    expect(result.title).toBe("A Test Episode");
    expect(result.body).toEqual([
      "Episode: 12",
      "Chris: 75 (75.0% of total)",
      "Caller: 25 (25.0% of total)",
    ]);
  });
});
