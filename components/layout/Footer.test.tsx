import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("@/components/icons/BlueskyIcon", () => ({
  default: () => <svg data-testid="bluesky-icon" />,
}));

import Footer from "./Footer";

describe("Footer", () => {
  it("renders all social links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /bluesky/i })).toHaveAttribute(
      "href",
      "https://bsky.app/profile/mattlane.us",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/mmmaaatttttt/personal-site",
    );
    expect(screen.getByRole("link", { name: /book/i })).toHaveAttribute(
      "href",
      "https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518",
    );
    expect(screen.getByRole("link", { name: /rss/i })).toHaveAttribute(
      "href",
      "/rss.xml",
    );
  });

  it("renders the Creative Commons license link", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /creative commons license/i }),
    ).toHaveAttribute("href", "http://creativecommons.org/licenses/by-nc/4.0/");
  });

  it("renders the CC license image", () => {
    render(<Footer />);
    expect(screen.getByAltText("Creative Commons License")).toBeInTheDocument();
  });
});
