import { render } from "@testing-library/react";
import type { ReactNode, SVGProps } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import HorizontalBarGraph from ".";

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
      rect: (
        props: SVGProps<SVGRectElement> & {
          animate?: Record<string, unknown>;
        },
      ) => {
        const { animate, ...rest } = props;
        return <rect {...rest} {...animate} />;
      },
      g: (
        props: SVGProps<SVGGElement> & {
          animate?: Record<string, unknown>;
        },
      ) => {
        const { animate, ...rest } = props;
        return <g {...rest} {...animate} />;
      },
      text: (
        props: SVGProps<SVGTextElement> & {
          animate?: Record<string, unknown>;
        },
      ) => {
        const { animate, ...rest } = props;
        return <text {...rest} {...animate} />;
      },
    },
    AnimatePresence: ({ children }: { children?: ReactNode }) => (
      <>{children}</>
    ),
  };
});

describe("HorizontalBarGraph Component", () => {
  const mockData = [
    { caption: "Item 1", fill: "red", width: 100 },
    { caption: "Item 2", fill: "blue", width: -50 },
    { caption: "Item 3", fill: "green", width: 25 },
  ];

  const defaultProps = {
    data: mockData,
    width: 600,
    height: 300,
    padding: { top: 10, bottom: 10, left: 10, right: 10 },
  };

  it("renders correctly with given data", () => {
    const { container } = render(<HorizontalBarGraph {...defaultProps} />);

    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 600 300");

    // Check for bars (rect elements with fill)
    const bars = Array.from(container.querySelectorAll("rect")).filter(
      (r) => r.getAttribute("fill") && r.getAttribute("fill") !== "none",
    );
    expect(bars.length).toBe(3);

    // Check for captions and value labels (text elements)
    const texts = container.querySelectorAll("text");
    // Each data point has a caption and a value label = 6 texts
    expect(texts.length).toBe(6);
  });

  it("calculates bar positions and widths correctly for positive and negative values", () => {
    const { container } = render(<HorizontalBarGraph {...defaultProps} />);
    const bars = Array.from(container.querySelectorAll("rect")).filter(
      (r) => r.getAttribute("fill") && r.getAttribute("fill") !== "none",
    );

    const bar1 = bars[0]; // width: 100
    const bar2 = bars[1]; // width: -50

    const w1 = parseFloat(bar1.getAttribute("width") || "0");
    const w2 = parseFloat(bar2.getAttribute("width") || "0");
    const x1 = parseFloat(bar1.getAttribute("x") || "0");
    const x2 = parseFloat(bar2.getAttribute("x") || "0");

    expect(w1).toBeGreaterThan(0);
    expect(w2).toBeGreaterThan(0);

    // Width 100 should be twice width 50
    expect(w1).toBeCloseTo(w2 * 2, -1);

    // Positive bar should start at middle (or after 0)
    // Negative bar should start to the left of 0
    // Midpoint of 600 width is 300
    expect(x1).toBeCloseTo(300, -1);
    expect(x2).toBeLessThan(300);
  });

  it("renders a central zero line", () => {
    const { container } = render(<HorizontalBarGraph {...defaultProps} />);
    const line = container.querySelector("line");
    expect(line).toBeInTheDocument();
    expect(line).toHaveAttribute("stroke", "#1a1a1a");

    const xPos = parseFloat(line?.getAttribute("x1") || "0");
    expect(xPos).toBeCloseTo(300, -1); // Centered at 0 in the domain
  });

  it("handles empty data gracefully", () => {
    // Component returns a NarrowContainer with a ClippedSVG but no bars
    const { container } = render(
      <HorizontalBarGraph {...defaultProps} data={[]} />,
    );
    const bars = Array.from(container.querySelectorAll("rect")).filter(
      (r) => r.getAttribute("fill") && r.getAttribute("fill") !== "none",
    );
    expect(bars.length).toBe(0);
  });

  it("accepts numeric padding", () => {
    const { container } = render(
      <HorizontalBarGraph {...defaultProps} padding={10} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
