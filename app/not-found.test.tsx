import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

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
vi.mock("@/lib/imagePlaceholders.json", () => ({ default: {} }));
vi.mock("@/utils/storyMeta", () => ({
  storyMeta: {
    "latest-story": {
      title: "Latest Story",
      date: "2024-06-01",
      featured_image: "../../images/featured_images/latest.jpg",
      caption: "A caption for the latest story",
    },
    "older-story": {
      title: "Older Story",
      date: "2024-01-01",
      featured_image: "../../images/featured_images/older.jpg",
      caption: "A caption for the older story",
    },
  },
}));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (path: string) => path.replace(/^(\.\.\/)+/, "/"),
}));

import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders the not-found message", () => {
    render(<NotFound />);
    expect(
      screen.getByText(/page you're looking for doesn't exist/i),
    ).toBeInTheDocument();
  });

  it("displays the most recent story's title", () => {
    render(<NotFound />);
    expect(screen.getByText("Latest Story")).toBeInTheDocument();
  });

  it("links to the most recent story", () => {
    render(<NotFound />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/stories/latest-story",
    );
  });
});
