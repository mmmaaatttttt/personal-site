import { describe, expect, it } from "vitest";
import { formatCurrency } from "./formatHelpers";

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
