import { describe, expect, it } from "vitest";
import { capitalize } from "./stringHelpers";

describe("capitalize", () => {
  it("uppercases the first letter", () => {
    expect(capitalize("blue")).toBe("Blue");
  });

  it("leaves already-capitalized strings unchanged", () => {
    expect(capitalize("Green")).toBe("Green");
  });

  it("handles a single character", () => {
    expect(capitalize("a")).toBe("A");
  });

  it("handles an empty string", () => {
    expect(capitalize("")).toBe("");
  });
});
