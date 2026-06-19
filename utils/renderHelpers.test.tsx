import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderMarkdownLinks } from "./renderHelpers";

function Wrapper({ str }: { str: string }) {
  return <span>{renderMarkdownLinks(str)}</span>;
}

describe("renderMarkdownLinks", () => {
  it("renders a markdown link as an anchor", () => {
    render(<Wrapper str="Photo by [Emili](https://example.com)" />);
    const link = screen.getByRole("link", { name: "Emili" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders multiple links in one string", () => {
    render(<Wrapper str="[Alice](https://a.com) and [Bob](https://b.com)" />);
    expect(screen.getByRole("link", { name: "Alice" })).toHaveAttribute(
      "href",
      "https://a.com",
    );
    expect(screen.getByRole("link", { name: "Bob" })).toHaveAttribute(
      "href",
      "https://b.com",
    );
  });

  it("preserves surrounding plain text", () => {
    render(<Wrapper str="Photo by [Alice](https://a.com) on Unsplash" />);
    expect(screen.getByText(/Photo by/)).toBeInTheDocument();
    expect(screen.getByText(/on Unsplash/)).toBeInTheDocument();
  });

  it("returns plain text unchanged when no links present", () => {
    render(<Wrapper str="Image credit: someone" />);
    expect(screen.getByText("Image credit: someone")).toBeInTheDocument();
  });
});
