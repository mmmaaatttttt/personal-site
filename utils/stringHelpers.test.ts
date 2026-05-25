import { describe, expect, it } from "vitest";
import { camelCaseToTitle, normalizeImagePath } from "./stringHelpers";

describe("normalizeImagePath", () => {
  it("strips leading ../ sequences before images/", () => {
    expect(normalizeImagePath("../../images/foo.jpg")).toBe("/images/foo.jpg");
  });

  it("handles a single ../ prefix", () => {
    expect(normalizeImagePath("../images/foo.jpg")).toBe("/images/foo.jpg");
  });

  it("leaves paths that do not match unchanged", () => {
    expect(normalizeImagePath("/images/foo.jpg")).toBe("/images/foo.jpg");
  });
});

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
