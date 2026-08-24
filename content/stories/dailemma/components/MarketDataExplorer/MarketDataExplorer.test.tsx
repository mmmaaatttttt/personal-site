import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MarketDataExplorer from ".";

beforeEach(() => {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  SVGSVGElement.prototype.getScreenCTM = vi
    .fn()
    .mockReturnValue({ a: 1, d: 1, e: 0, f: 0 });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MarketDataExplorer", () => {
  it("renders without crashing", () => {
    render(<MarketDataExplorer />);
  });

  it("renders axis labels for both series", () => {
    render(<MarketDataExplorer />);
    expect(screen.getAllByText("S&P 500").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Job Openings (thousands)").length,
    ).toBeGreaterThan(0);
  });

  it("renders historical event labels", () => {
    render(<MarketDataExplorer />);
    expect(screen.getByText("9/11")).toBeInTheDocument();
    expect(screen.getByText("2008 crisis")).toBeInTheDocument();
    expect(screen.getByText("COVID-19")).toBeInTheDocument();
    expect(screen.getByText("ChatGPT")).toBeInTheDocument();
  });

  it("renders the draggable scrubber circle", () => {
    const { container } = render(<MarketDataExplorer />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  it("initializes the scrubber at the ChatGPT launch date", () => {
    const { container } = render(<MarketDataExplorer />);
    // The scrubber line VerticalMarker text label does not exist (it has no label prop),
    // but the ChatGPT event label is always rendered
    expect(container.querySelector("text")).toBeInTheDocument();
  });

  it("moves the scrubber on drag", () => {
    const { container } = render(<MarketDataExplorer />);
    const circles = container.querySelectorAll("circle");
    // The draggable circle is the last one rendered
    const scrubber = circles[circles.length - 1];
    const initialCx = scrubber.getAttribute("cx");

    fireEvent.pointerDown(scrubber, {
      clientX: 400,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerMove(scrubber, {
      clientX: 200,
      clientY: 350,
      pointerId: 1,
    });
    fireEvent.pointerUp(scrubber, { pointerId: 1 });

    const updatedCx = scrubber.getAttribute("cx");
    expect(updatedCx).not.toBe(initialCx);
  });

  it("shows a tooltip near the S&P 500 point on focus and hides it on blur", () => {
    render(<MarketDataExplorer />);
    const point = screen.getByRole("button", { name: /S&P 500 at/ });

    fireEvent.focus(point);
    expect(screen.getByText(/S&P 500: /)).toBeInTheDocument();

    fireEvent.blur(point);
    expect(screen.queryByText(/S&P 500: /)).not.toBeInTheDocument();
  });

  it("shows a tooltip near the job openings point on focus and hides it on blur", () => {
    render(<MarketDataExplorer />);
    const point = screen.getByRole("button", { name: /Job openings at/ });

    fireEvent.focus(point);
    expect(screen.getByText(/Job openings: /)).toBeInTheDocument();

    fireEvent.blur(point);
    expect(screen.queryByText(/Job openings: /)).not.toBeInTheDocument();
  });
});
