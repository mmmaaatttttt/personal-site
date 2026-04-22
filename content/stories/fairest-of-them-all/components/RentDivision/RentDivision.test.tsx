import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import RentDivision from ".";

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe("RentDivision", () => {
  it("renders without crashing", () => {
    const { container } = render(<RentDivision />);
    expect(container).toBeTruthy();
  });

  it("renders with a caption", () => {
    render(<RentDivision caption="Figure 4" />);
    expect(screen.getByText("Figure 4")).toBeTruthy();
  });

  it("shows the mesh slider and start button before starting", () => {
    render(<RentDivision />);
    expect(screen.getByText("Start Demonstration")).toBeTruthy();
    expect(screen.getByText(/Mesh Size/i)).toBeTruthy();
  });

  it("transitions to roommate selection after clicking Start", () => {
    render(<RentDivision />);
    fireEvent.click(screen.getByText("Start Demonstration"));
    expect(screen.getByText(/Turn/)).toBeTruthy();
  });

  it("shows the SVG mesh", () => {
    const { container } = render(<RentDivision />);
    expect(container.querySelector("svg")).toBeTruthy();
    expect(container.querySelectorAll("polygon").length).toBeGreaterThan(0);
  });
});
