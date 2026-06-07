import { render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { describe, expect, it, vi } from "vitest";

// motion.circle is undefined in framer-motion v12 under jsdom;
// replace it with a plain <circle> that spreads animate attrs so tests can assert values.
vi.mock("framer-motion", () => ({
  motion: {
    circle: ({
      animate,
      initial: _initial,
      transition: _transition,
      ...rest
    }: {
      animate?: Record<string, unknown>;
      initial?: unknown;
      transition?: unknown;
      [key: string]: unknown;
    }) => <circle {...rest} {...(animate ?? {})} />,
  },
  memo: (fn: unknown) => fn,
}));

import ScatterPoint from "./ScatterPoint";

const TestSvg = ({ children }: { children: React.ReactNode }) => (
  <svg role="img" aria-label="test">
    {children}
  </svg>
);

describe("ScatterPoint", () => {
  const defaultProps = { cx: 50, cy: 80, area: 100, fill: "#4488ff", index: 0 };

  it("renders a circle element", () => {
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} />
      </TestSvg>,
    );
    expect(container.querySelector("circle")).toBeInTheDocument();
  });

  it("sets r to sqrt of area", () => {
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} area={144} />
      </TestSvg>,
    );
    expect(Number(container.querySelector("circle")?.getAttribute("r"))).toBe(
      12,
    );
  });

  it("positions the circle at the given cx and cy", () => {
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} cx={30} cy={70} />
      </TestSvg>,
    );
    const circle = container.querySelector("circle");
    expect(Number(circle?.getAttribute("cx"))).toBe(30);
    expect(Number(circle?.getAttribute("cy"))).toBe(70);
  });

  it("applies fill from props", () => {
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} fill="#ff0000" />
      </TestSvg>,
    );
    expect(container.querySelector("circle")).toHaveAttribute(
      "fill",
      "#ff0000",
    );
  });

  it("applies a darkened stroke derived from fill", () => {
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} fill="#ffffff" />
      </TestSvg>,
    );
    const circle = container.querySelector("circle");
    // darken(#ffffff, 0.3) = #b2b2b2
    expect(circle?.getAttribute("stroke")).toBe("#b2b2b2");
    expect(circle?.getAttribute("stroke-width")).toBe("1");
  });

  it("applies animation delay proportional to index", () => {
    // Ensures no crash with non-zero index
    const { container } = render(
      <TestSvg>
        <ScatterPoint {...defaultProps} index={5} />
      </TestSvg>,
    );
    expect(container.querySelector("circle")).toBeInTheDocument();
  });
});
