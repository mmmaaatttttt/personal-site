import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import WedgeExplorer from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

beforeEach(() => {
  localStorage.clear();
});

describe("WedgeExplorer", () => {
  it("renders without crashing", () => {
    render(<WedgeExplorer />);
  });

  it("shows the over-automation callout", () => {
    render(<WedgeExplorer />);
    expect(
      screen.getByText(/more jobs than is collectively beneficial/i),
    ).toBeInTheDocument();
  });

  it("shows plain-English legend entries", () => {
    render(<WedgeExplorer />);
    expect(screen.getByText(/market outcome/i)).toBeInTheDocument();
    expect(screen.getByText(/socially optimal/i)).toBeInTheDocument();
  });

  it("renders four slider inputs", () => {
    render(<WedgeExplorer />);
    expect(screen.getAllByRole("slider")).toHaveLength(4);
  });

  it("accepts and renders a caption", () => {
    render(<WedgeExplorer caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });
});
