import { describe, expect, it } from "vitest";
import robots from "./robots";

describe("robots", () => {
  it("allows all user agents", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  });

  it("points sitemap to the correct URL", () => {
    const result = robots();
    expect(result.sitemap).toBe("https://mattlane.us/sitemap.xml");
  });
});
