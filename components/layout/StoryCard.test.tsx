import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockPlaceholders = vi.hoisted(() => ({}) as Record<string, string>);

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

import StoryCard from "./StoryCard";

const baseProps = {
  caption: "A test caption",
  date: "January 2024",
  featured_image: "/images/test.jpg",
  slug: "test-story",
  tags: ["math", "games"],
  title: "Test Story",
  timeToRead: 5,
  index: 0,
};

describe("StoryCard", () => {
  it("renders title, date, and caption", () => {
    render(<StoryCard {...baseProps} />);
    expect(screen.getByText("Test Story")).toBeInTheDocument();
    expect(screen.getByText(/january 2024/i)).toBeInTheDocument();
    expect(screen.getByText("A test caption")).toBeInTheDocument();
  });

  it("links to the correct story page", () => {
    render(<StoryCard {...baseProps} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/stories/test-story",
    );
  });

  it("renders all tags", () => {
    render(<StoryCard {...baseProps} />);
    expect(screen.getByText("math")).toBeInTheDocument();
    expect(screen.getByText("games")).toBeInTheDocument();
  });

  it("renders reading time when provided", () => {
    render(<StoryCard {...baseProps} />);
    expect(screen.getByText(/5 minute read/i)).toBeInTheDocument();
  });

  it("omits reading time when not provided", () => {
    render(<StoryCard {...baseProps} timeToRead={undefined} />);
    expect(screen.queryByText(/minute read/i)).not.toBeInTheDocument();
  });

  it("applies bounce-in-left for even index", () => {
    const { container } = render(<StoryCard {...baseProps} index={0} />);
    expect(container.firstChild).toHaveClass("bounce-in-left");
  });

  it("applies bounce-in-right for odd index", () => {
    const { container } = render(<StoryCard {...baseProps} index={1} />);
    expect(container.firstChild).toHaveClass("bounce-in-right");
  });

  it("applies animation delay based on index", () => {
    const { container } = render(<StoryCard {...baseProps} index={2} />);
    expect(container.firstChild).toHaveStyle({ animationDelay: "0.5s" });
  });

  it("uses empty placeholder when no blurDataURL is available", () => {
    render(<StoryCard {...baseProps} />);
    // default mockPlaceholders is {}, so blurDataURL is undefined → "empty" branch
    expect(screen.getByAltText("Card for Test Story")).toBeInTheDocument();
  });

  it("uses blur placeholder when blurDataURL is available", () => {
    mockPlaceholders["/images/test.jpg"] = "data:image/jpeg;base64,test";
    render(<StoryCard {...baseProps} />);
    expect(screen.getByAltText("Card for Test Story")).toBeInTheDocument();
    delete mockPlaceholders["/images/test.jpg"];
  });
});
