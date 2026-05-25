import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));
vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

import AboutPage from "./page";

describe("AboutPage", () => {
  it("renders the about heading", () => {
    render(<AboutPage />);
    expect(
      screen.getByRole("heading", { name: /about matt lane/i }),
    ).toBeInTheDocument();
  });

  it("renders links to external resources", () => {
    render(<AboutPage />);
    expect(screen.getByRole("link", { name: /rithm school/i })).toHaveAttribute(
      "href",
      "https://www.rithmschool.com",
    );
    expect(screen.getByRole("link", { name: /mathalicious/i })).toHaveAttribute(
      "href",
      "https://www.mathalicious.com",
    );
    expect(screen.getByRole("link", { name: /power-up/i })).toHaveAttribute(
      "href",
      "https://www.amazon.com/Power-Up-Unlocking-Hidden-Mathematics-Video/dp/0691161518",
    );
    expect(screen.getByRole("link", { name: /bluesky/i })).toHaveAttribute(
      "href",
      "https://bsky.app/profile/mattlane.us",
    );
  });

  it("includes JSON-LD structured data", () => {
    render(<AboutPage />);
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const data = JSON.parse(script?.textContent ?? "");
    expect(data["@type"]).toBe("Person");
    expect(data.name).toBe("Matt Lane");
  });

  it("renders the profile image", () => {
    render(<AboutPage />);
    expect(screen.getByAltText("Matt's face")).toBeInTheDocument();
  });
});
