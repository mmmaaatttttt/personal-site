import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FunctionDistanceExplorer from ".";

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  SVGSVGElement.prototype.getScreenCTM = vi.fn().mockReturnValue({
    a: 1,
    d: 1,
    e: 0,
    f: 0,
  });
});

describe("FunctionDistanceExplorer", () => {
  it("renders without crashing", () => {
    render(<FunctionDistanceExplorer />);
    const svg = document.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders the toggle switch with distance labels", () => {
    render(<FunctionDistanceExplorer />);
    expect(screen.getByText(/Largest Diff:/)).toBeTruthy();
    expect(screen.getByText(/Area:/)).toBeTruthy();
  });

  it("toggle switch starts in unchecked state (L∞ mode)", () => {
    render(<FunctionDistanceExplorer />);
    const toggle = screen.getByRole("switch");
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("renders the dashed L∞ line by default", () => {
    render(<FunctionDistanceExplorer />);
    // The L∞ line uses COLORS.PURPLE (#e15bff)
    const linf = document.querySelector('line[stroke="#e15bff"]');
    expect(linf).toBeTruthy();
  });

  it("does not render the shaded polygon by default", () => {
    render(<FunctionDistanceExplorer />);
    const polygon = document.querySelector("polygon");
    expect(polygon).toBeNull();
  });

  it("switches to L1 area mode when toggle is clicked", () => {
    render(<FunctionDistanceExplorer />);
    fireEvent.click(screen.getByRole("switch"));
    const polygon = document.querySelector("polygon");
    expect(polygon).toBeTruthy();
    // purple L∞ line should be gone
    expect(document.querySelector('line[stroke="#e15bff"]')).toBeNull();
  });

  it("switches back to L∞ mode on second toggle click", () => {
    render(<FunctionDistanceExplorer />);
    const toggle = screen.getByRole("switch");
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(document.querySelector('line[stroke="#e15bff"]')).toBeTruthy();
    expect(document.querySelector("polygon")).toBeNull();
  });

  it("renders six draggable circles (3 per function)", () => {
    render(<FunctionDistanceExplorer />);
    const circles = document.querySelectorAll("circle");
    expect(circles.length).toBe(6);
  });

  it("renders two polylines for the two functions", () => {
    render(<FunctionDistanceExplorer />);
    const polylines = document.querySelectorAll("polyline");
    expect(polylines.length).toBe(2);
  });

  it("orange polyline uses ORANGE stroke color", () => {
    render(<FunctionDistanceExplorer />);
    const polylines = document.querySelectorAll("polyline");
    const strokes = Array.from(polylines).map((p) => p.getAttribute("stroke"));
    expect(strokes).toContain("#ff8f34");
  });

  it("green polyline uses GREEN stroke color", () => {
    render(<FunctionDistanceExplorer />);
    const polylines = document.querySelectorAll("polyline");
    const strokes = Array.from(polylines).map((p) => p.getAttribute("stroke"));
    expect(strokes).toContain("#52a081");
  });

  it("distance labels update reactively — initial diff is non-zero", () => {
    render(<FunctionDistanceExplorer />);
    const text = screen.getByText(/Largest Diff:/);
    // initial functions are at y=4 and y=1, so diff should be 3.00
    expect(text.textContent).toContain("3.00");
  });

  it("initial area label is non-zero", () => {
    render(<FunctionDistanceExplorer />);
    const text = screen.getByText(/Area:/);
    // constant gap of 3 over domain width 5 = area 15
    expect(text.textContent).toContain("15.00");
  });
});
