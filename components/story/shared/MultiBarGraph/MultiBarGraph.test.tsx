import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import MultiBarGraph from ".";

// Mock ResizeObserver for JSDOM
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock framer-motion to render static elements for tests
vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    motion: {
      ...actual.motion,
      rect: (props: any) => <rect {...props} {...props.animate} />,
      g: (props: any) => <g {...props} {...props.animate} />,
      text: (props: any) => <text {...props} {...props.animate} />,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

// Note: MultiBarGraph uses framer-motion which might need some mocking in JSDOM
// or we just check if the basic elements are rendered.

describe("MultiBarGraph Component", () => {
  const mockData = [
    {
      meta: { id: 1, title: "Episode 1" },
      counts: { Chris: 100, Caller: 50 },
    },
    {
      meta: { id: 2, title: "Episode 2" },
      counts: { Chris: 120, Caller: 80 },
    },
  ];

  const mockGetTooltipData = vi.fn((d) => ({
    title: d.meta.title,
    body: ["Test body"],
  }));

  const defaultProps = {
    data: mockData,
    getTooltipData: mockGetTooltipData,
    colors: ["#000", "#fff"],
    width: 600,
    height: 400,
    padding: { top: 20, bottom: 20, left: 20, right: 20 },
  };

  it("renders correctly with basic data", () => {
    const { container } = render(<MultiBarGraph {...defaultProps} />);

    // Check for SVG
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 600 400");

    // Check for Legend
    expect(screen.getByText("Legend")).toBeInTheDocument();
    expect(screen.getByText("Chris")).toBeInTheDocument();
    expect(screen.getByText("Caller")).toBeInTheDocument();
  });

  it("renders the correct number of stacked bar groups", () => {
    const { container } = render(<MultiBarGraph {...defaultProps} />);

    // Each data entry should have a 'g' container for its bars
    // Plus Axis g's and the main container
    // We can check for the bars themselves (motion.rect becomes <rect>)
    const getBars = (c: HTMLElement) =>
      Array.from(c.querySelectorAll("rect")).filter((r) =>
        r.getAttribute("fill"),
      );
    const rects = getBars(container);

    // Each column (2) has 2 layers (Chris, Caller) = 4 rects
    expect(rects.length).toBe(4);
  });

  it("calculates heights correctly based on stacking", () => {
    const { container } = render(<MultiBarGraph {...defaultProps} />);

    const getBars = (c: HTMLElement) =>
      Array.from(c.querySelectorAll("rect")).filter((r) =>
        r.getAttribute("fill"),
      );
    const rects = getBars(container);

    // Check first column bars
    const col1_layer1 = rects[0];
    const col1_layer2 = rects[1];

    const h1 = parseFloat(col1_layer1.getAttribute("height") || "0");
    const h2 = parseFloat(col1_layer2.getAttribute("height") || "0");

    // Heights should be proportional to values (100 and 50)
    expect(h1).toBeGreaterThan(0);
    expect(h2).toBeGreaterThan(0);
    expect(h1).toBeCloseTo(h2 * 2, -1); // 100 is twice 50 (with some rounding allowed)
  });

  it("respects the yMax prop if provided", () => {
    // With data max of 150 (100+50) and 200 (120+80)
    // If we set yMax to 400, bars should be smaller
    const { rerender, container } = render(<MultiBarGraph {...defaultProps} />);
    // Select bars by checking for fill attribute (clip rect doesn't have it in the same way or is in defs)
    const getBars = (c: HTMLElement) =>
      Array.from(c.querySelectorAll("rect")).filter((r) =>
        r.getAttribute("fill"),
      );

    const initialHeight = parseFloat(
      getBars(container)[0].getAttribute("height") || "0",
    );

    rerender(<MultiBarGraph {...defaultProps} yMax={1000} />);
    const largeYMaxHeight = parseFloat(
      getBars(container)[0].getAttribute("height") || "0",
    );

    expect(largeYMaxHeight).toBeLessThan(initialHeight);
  });

  it("handles empty data gracefully", () => {
    const { container } = render(<MultiBarGraph {...defaultProps} data={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
