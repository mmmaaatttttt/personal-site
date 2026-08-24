import { describe, expect, it } from "vitest";
import { SERIES_OPTIONS } from "./constants";

describe("SERIES_OPTIONS accessors", () => {
  const entry: [number, number] = [4, 10];

  it("revenue accessor returns the revenue", () => {
    const option = SERIES_OPTIONS.find((o) => o.value === "revenue");
    expect(option?.accessor(entry)).toBe(10);
  });

  it("cost accessor returns the cost", () => {
    const option = SERIES_OPTIONS.find((o) => o.value === "cost");
    expect(option?.accessor(entry)).toBe(4);
  });

  it("profit accessor returns revenue minus cost", () => {
    const option = SERIES_OPTIONS.find((o) => o.value === "profit");
    expect(option?.accessor(entry)).toBe(6);
  });
});
