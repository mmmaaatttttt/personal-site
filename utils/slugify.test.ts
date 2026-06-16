import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { extractText, slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips non-alphanumeric non-space characters", () => {
    expect(slugify("What's in a Distance?")).toBe("whats-in-a-distance");
  });

  it("collapses multiple spaces", () => {
    expect(slugify("Hello  World")).toBe("hello-world");
  });

  it("preserves numbers", () => {
    expect(slugify("Top 10 Things")).toBe("top-10-things");
  });

  it("trims leading and trailing spaces", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("returns empty string for empty input", () => {
    expect(slugify("")).toBe("");
  });
});

describe("extractText", () => {
  it("returns empty string for null", () => {
    expect(extractText(null)).toBe("");
  });

  it("returns empty string for undefined", () => {
    expect(extractText(undefined)).toBe("");
  });

  it("returns the string itself", () => {
    expect(extractText("hello")).toBe("hello");
  });

  it("joins an array of strings", () => {
    expect(extractText(["hello", " ", "world"])).toBe("hello world");
  });

  it("recursively extracts from a ReactElement's children", () => {
    const el = {
      props: { children: "nested text" },
    } as ReactElement;
    expect(extractText(el)).toBe("nested text");
  });

  it("handles deeply nested ReactElement children", () => {
    const el = {
      props: { children: { props: { children: "deep" } } },
    } as unknown as ReactElement;
    expect(extractText(el)).toBe("deep");
  });

  it("handles mixed array with elements and strings", () => {
    const el = { props: { children: "bold" } } as ReactElement;
    expect(extractText(["Hello ", el, "!"])).toBe("Hello bold!");
  });

  it("falls back to String() for non-string primitives", () => {
    expect(extractText(42 as unknown as string)).toBe("42");
  });
});
