import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders navigation links with correct hrefs", () => {
    render(<Navbar title="Matt Lane" />);
    expect(screen.getByRole("link", { name: "Matt Lane" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: "Stories" })).toHaveAttribute(
      "href",
      "/stories",
    );
  });

  it("applies transparent/absolute classes when hide is true", () => {
    const { container } = render(<Navbar title="Matt" hide={true} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("bg-transparent");
    expect(nav?.className).toContain("text-white");
  });

  it("applies background and border classes when hide is false", () => {
    const { container } = render(<Navbar title="Matt" />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("bg-nav");
    expect(nav?.className).toContain("text-link");
  });

  it("applies text-shadow outline class when outline is true", () => {
    const { container } = render(<Navbar title="Matt" outline={true} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("[text-shadow:");
  });

  it("applies white/70 separator when hide is true", () => {
    render(<Navbar title="Matt" hide={true} />);
    const separator = screen.getByText("|");
    expect(separator.className).toContain("text-white/70");
  });

  it("applies gray-400 separator when hide is false", () => {
    render(<Navbar title="Matt" hide={false} />);
    const separator = screen.getByText("|");
    expect(separator.className).toContain("text-gray-400");
  });
});
