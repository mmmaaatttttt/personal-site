import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

vi.mock("@/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
});
