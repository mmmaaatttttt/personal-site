import { describe, it, expect } from "vitest";
import { camelCaseToTitle } from "./stringHelpers";

describe("camelCaseToTitle", () => {
  it("converts a single camelCase word", () => {
    expect(camelCaseToTitle("mostPlentiful")).toBe("Most Plentiful");
  });

  it("handles multiple capital letters", () => {
    expect(camelCaseToTitle("favoriteColor")).toBe("Favorite Color");
  });

  it("capitalizes a single lowercase word", () => {
    expect(camelCaseToTitle("random")).toBe("Random");
  });

  it("handles already-title-cased input", () => {
    expect(camelCaseToTitle("LeastPlentiful")).toBe("Least Plentiful");
  });

  it("returns an empty string unchanged", () => {
    expect(camelCaseToTitle("")).toBe("");
  });
});
