import { describe, expect, it, vi } from "vitest";

vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockResolvedValue([
    {
      slug: "test-story",
      title: "Test Story",
      caption: "A test caption",
      date: "January 2024",
      rawDate: "2024-01-15",
      featured_image: "/img.jpg",
      tags: [],
      timeToRead: 5,
    },
  ]),
}));

import { GET } from "./route";

describe("GET /rss.xml", () => {
  it("returns a Response with XML content type", async () => {
    const response = await GET();
    expect(response.headers.get("Content-Type")).toBe(
      "application/xml; charset=utf-8",
    );
  });

  it("includes the RSS envelope and channel metadata", async () => {
    const response = await GET();
    const text = await response.text();
    expect(text).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(text).toContain('<rss version="2.0"');
    expect(text).toContain("<title>Matt Lane</title>");
    expect(text).toContain(
      "Stories at the intersection of math, equity, games, and more.",
    );
  });

  it("includes all articles as RSS items", async () => {
    const response = await GET();
    const text = await response.text();
    expect(text).toContain("<![CDATA[Test Story]]>");
    expect(text).toContain("https://mattlane.us/stories/test-story");
    expect(text).not.toContain("https://mattlane.us/stories/test-story/");
    expect(text).toContain("<![CDATA[A test caption]]>");
  });

  it("formats pubDate from the raw ISO date, not the display-formatted date", async () => {
    const response = await GET();
    const text = await response.text();
    expect(text).toContain(
      `<pubDate>${new Date("2024-01-15").toUTCString()}</pubDate>`,
    );
  });
});
