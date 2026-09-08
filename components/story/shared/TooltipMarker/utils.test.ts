import { describe, expect, it } from "vitest";
import { formatAriaLabel } from "./utils";

describe("formatAriaLabel", () => {
  it("joins a title and a string body with a colon", () => {
    expect(formatAriaLabel("n = 1", "Series A: 2.000")).toBe(
      "n = 1: Series A: 2.000",
    );
  });

  it("joins a title and an array body with semicolons", () => {
    expect(
      formatAriaLabel("n = 1", ["Series A: 2.000", "Series B: 2.500"]),
    ).toBe("n = 1: Series A: 2.000; Series B: 2.500");
  });

  it("omits the title prefix when title is empty", () => {
    expect(formatAriaLabel("", "Switch after you have 96 standees")).toBe(
      "Switch after you have 96 standees",
    );
  });
});
