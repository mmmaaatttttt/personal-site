import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

const mockPlaceholders = vi.hoisted(() => ({}) as Record<string, string>);

vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
vi.mock("@/lib/imagePlaceholders.json", () => ({
  default: mockPlaceholders,
}));
vi.mock("@/utils/stringHelpers", () => ({
  normalizeImagePath: (p: string) => p,
}));
vi.mock("@/utils/content", () => ({
  getAllArticles: vi.fn().mockReturnValue([
    {
      slug: "latest-story",
      title: "The Latest Story",
      caption: "A great caption",
      featured_image: "/images/latest.jpg",
      date: "2026-06-18",
      tags: ["math"],
      timeToRead: 5,
    },
  ]),
}));

import Home from "./page";

describe("Home", () => {
  it("renders the greeting heading", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: "Hi!" })).toBeInTheDocument();
  });

  it("renders the navigation instruction", () => {
    render(<Home />);
    expect(screen.getByText(/use the nav bar/i)).toBeInTheDocument();
  });

  it("renders a link to the latest story", () => {
    render(<Home />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/stories/latest-story",
    );
  });

  it("renders the latest story title", () => {
    render(<Home />);
    expect(screen.getByText("The Latest Story")).toBeInTheDocument();
  });

  it("uses blur placeholder when blurDataURL is available", () => {
    mockPlaceholders["/images/latest.jpg"] = "data:image/jpeg;base64,test";
    render(<Home />);
    expect(screen.getByAltText("A great caption")).toBeInTheDocument();
    delete mockPlaceholders["/images/latest.jpg"];
  });

  it("uses empty placeholder when no blurDataURL is available", () => {
    render(<Home />);
    expect(screen.getByAltText("A great caption")).toBeInTheDocument();
  });
});
