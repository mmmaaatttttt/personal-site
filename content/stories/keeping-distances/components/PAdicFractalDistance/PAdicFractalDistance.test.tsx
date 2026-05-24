import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import PAdicFractalDistance from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("PAdicFractalDistance", () => {
  it("renders an SVG", () => {
    const { container } = render(<PAdicFractalDistance />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders a level slider", () => {
    render(<PAdicFractalDistance />);
    const slider = screen.getByRole("slider");
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("min", "1");
    expect(slider).toHaveAttribute("max", "3");
  });

  it("renders a prime selector dropdown", () => {
    render(<PAdicFractalDistance />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("shows prime options 3, 5, and 7", () => {
    render(<PAdicFractalDistance />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => o.textContent,
    );
    expect(options).toContain("Selected prime: 3");
    expect(options).toContain("Selected prime: 5");
    expect(options).toContain("Selected prime: 7");
  });

  it("renders circles at level 1 with p=3 (default)", () => {
    const { container } = render(<PAdicFractalDistance />);
    const circles = container.querySelectorAll("circle");
    // level=1, prime=3 → 3 points
    expect(circles.length).toBe(3);
  });

  it("renders more circles when level increases to 2", async () => {
    const { container } = render(<PAdicFractalDistance />);
    const slider = screen.getByRole("slider");
    await act(async () => {
      fireEvent.change(slider, { target: { value: "2" } });
    });
    const circles = container.querySelectorAll("circle");
    // level=2, prime=3 → 9 points
    expect(circles.length).toBeGreaterThanOrEqual(9);
  });

  it("shows number labels at level 1", () => {
    render(<PAdicFractalDistance />);
    // Numbers 0, 1, 2 should appear as labels for prime=3 level=1
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders the optional caption", () => {
    render(<PAdicFractalDistance caption="Fractal caption" />);
    expect(screen.getByText("Fractal caption")).toBeInTheDocument();
  });

  it("changes prime when dropdown changes", () => {
    render(<PAdicFractalDistance />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "5" } });
    expect(select.value).toBe("5");
  });
});
