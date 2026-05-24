import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ManhattanPaths from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("ManhattanPaths", () => {
  it("renders without crashing", () => {
    render(<ManhattanPaths />);
    // 6×6 grid minus origin = 35 points
    const circles = document.querySelectorAll("circle");
    expect(circles.length).toBe(35);
  });

  it("renders the path polyline", () => {
    render(<ManhattanPaths />);
    const polyline = document.querySelector("polyline");
    expect(polyline).not.toBeNull();
    expect(polyline?.getAttribute("points")).not.toBe("");
  });

  it("renders a slider for path selection", () => {
    render(<ManhattanPaths />);
    const slider = document.querySelector('input[type="range"]');
    expect(slider).not.toBeNull();
  });

  it("renders a caption when provided", () => {
    render(<ManhattanPaths caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeTruthy();
  });

  it("shows correct initial path count in slider title", () => {
    render(<ManhattanPaths />);
    // default activePoint is (2,2); C(4,2) = 6 paths
    expect(screen.getByText(/Path 1 of 6/)).toBeTruthy();
  });

  it("updates to multi-path count when clicking (3,2)", () => {
    render(<ManhattanPaths />);
    const circles = document.querySelectorAll("circle");

    // Grid point at (3, 2):
    // generatePathOptions: row 2 means y=2, col 3 means x=3
    // Find the circle for grid point (3,2). Grid order: x=(idx+1)%6, y=floor((idx+1)/6)
    // (3,2): idx+1 = 3 + 2*6 = 15, so idx=14
    const targetCircle = circles[14] as SVGCircleElement;
    fireEvent.click(targetCircle);

    // generatePathOptions(2, 3) = C(5,2) = 10 paths
    expect(screen.getByText(/Path 1 of 10/)).toBeTruthy();
  });
});
