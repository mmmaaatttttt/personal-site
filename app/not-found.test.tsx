import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const mockPlaceholders = vi.hoisted(() => ({}) as Record<string, string>);

vi.mock("next/image", () => ({ default: () => null }));
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("@/lib/imagePlaceholders.json", () => ({
  default: mockPlaceholders,
}));
vi.mock("@/utils/content", () => ({
  getLatestStory: vi.fn().mockResolvedValue({
    slug: "latest-story",
    title: "Latest Story",
    date: "June 2024",
    featured_image: "../../images/featured_images/latest.jpg",
    caption: "A caption for the latest story",
    tags: [],
    timeToRead: 5,
  }),
}));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (path: string) => path.replace(/^(\.\.\/)+/, "/"),
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the not-found message", async () => {
    render(await NotFound());
    expect(
      screen.getByText(/page you're looking for doesn't exist/i),
    ).toBeInTheDocument();
  });

  it("displays the most recent story's title", async () => {
    render(await NotFound());
    expect(screen.getByText("Latest Story")).toBeInTheDocument();
  });

  it("links to the most recent story", async () => {
    render(await NotFound());
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/stories/latest-story",
    );
  });

  it("uses blur placeholder when blurDataURL is available", async () => {
    mockPlaceholders["/images/featured_images/latest.jpg"] =
      "data:image/jpeg;base64,test";
    render(await NotFound());
    expect(screen.getByText("Latest Story")).toBeInTheDocument();
    delete mockPlaceholders["/images/featured_images/latest.jpg"];
  });
});
