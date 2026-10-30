import { describe, expect, it } from "vitest";
import { datelineFor, formatCurrency } from "./formatHelpers";

describe("formatCurrency", () => {
  it("formats a decimal value as whole-dollar USD with thousands separators", () => {
    expect(formatCurrency(13473.19)).toBe("$13,473");
  });

  it("rounds to the nearest dollar", () => {
    expect(formatCurrency(84.96)).toBe("$85");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0");
  });

  it("supports explicit fraction digits for sub-dollar amounts", () => {
    expect(formatCurrency(0.5, 2)).toBe("$0.50");
    expect(formatCurrency(733.333, 2)).toBe("$733.33");
  });
});

describe("datelineFor", () => {
  it("adds the reading time after the date", () => {
    expect(datelineFor({ date: "July 2026", timeToRead: 12 })).toBe(
      "July 2026 - 12 minute read",
    );
  });

  it("shows just the date when the reading time is unknown", () => {
    expect(datelineFor({ date: "July 2026", timeToRead: 0 })).toBe("July 2026");
  });
});
