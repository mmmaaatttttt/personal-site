import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import USMap from ".";

// Mock ClippedSVG
vi.mock("../ClippedSVG", () => ({
  default: ({ children }: { children?: ReactNode }) => (
    <svg data-testid="mock-svg" role="img" aria-label="test">
      {children}
    </svg>
  ),
}));

// Mock USState
vi.mock("./USState", () => ({
  default: ({ fill, title }: { fill?: string; title?: string }) => (
    <path data-testid="us-state" fill={fill} data-title={title} />
  ),
}));

describe("USMap Component", () => {
  const mockData = [
    { state: "Alabama", value: 10 },
    { state: "Alaska", value: 20 },
  ];

  const colors = ["#ffffff", "#000000"];

  type MockProperties = { name: string; values: (typeof mockData)[0][] };

  const defaultProps = {
    colors,
    data: mockData,
    fillAccessor: (props: MockProperties) => {
      const matching = mockData.find((d) => d.state === props.name);
      return matching ? matching.value : null;
    },
    getTooltipTitle: (props: MockProperties) => props.name,
    getTooltipBody: (props: MockProperties) => `Value: ${props.name}`,
  };

  it("renders a USState for each feature in the topojson", () => {
    const { getAllByTestId } = render(<USMap {...defaultProps} />);
    const states = getAllByTestId("us-state");

    // us-topo.json typically has 51 state-level objects (50 states + DC)
    expect(states.length).toBeGreaterThan(50);
  });

  it("applies the correct fill based on data and color scale", () => {
    const { getAllByTestId } = render(
      <USMap {...defaultProps} domain={[10, 20]} />,
    );
    const states = getAllByTestId("us-state");

    const alabama = states.find(
      (s) => s.getAttribute("data-title") === "Alabama",
    );
    const alaska = states.find(
      (s) => s.getAttribute("data-title") === "Alaska",
    );
    const wyoming = states.find(
      (s) => s.getAttribute("data-title") === "Wyoming",
    ); // No data

    // Linear scale [10, 20] -> ['#ffffff', '#000000']
    // 10 -> #ffffff
    // 20 -> #000000
    expect(alabama?.getAttribute("fill")).toMatch(
      /#ffffff|rgb\(255, 255, 255\)/i,
    );
    expect(alaska?.getAttribute("fill")).toMatch(/#000000|rgb\(0, 0, 0\)/i);
    expect(wyoming?.getAttribute("fill")).toMatch(
      /#eeeeee|rgb\(238, 238, 238\)/i,
    );
  });
});
