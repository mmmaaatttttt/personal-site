import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import type React from "react";
import BarGraph from ".";

// Mock the BarItem component directly to bypass all framer-motion complexity
vi.mock("./BarItem", () => {
  const React = require("react");
  return {
    default: ({
      data,
      x,
      y,
      width,
      height,
      barLabel,
    }: {
      data: { key: string | number; height: number; color?: string };
      x: number;
      y: number;
      width: number;
      height: number;
      barLabel?: (d: { height: number }) => string | number;
    }) => {
      const labelText = barLabel ? barLabel(data) : null;
      return (
        <g data-testid="bar-item">
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill={data.color || "gray"}
          />
          {labelText && <text>{labelText}</text>}
        </g>
      );
    },
  };
});

// Mock Graph component since it handles its own SVG/Axis logic
vi.mock("../Graph", () => {
  return {
    default: ({ children, svgId }: { children?: React.ReactNode; svgId?: string }) => (
      <svg data-testid="mock-graph" id={svgId}>
        {children}
      </svg>
    ),
  };
});

describe("BarGraph Component", () => {
  const mockBarData = [
    { key: "A", height: 10, color: "red" },
    { key: "B", height: 20, color: "blue" },
    { key: "C", height: 30, color: "green" },
  ];

  const mockYScale = scaleLinear().domain([0, 30]).range([300, 0]);
  const defaultProps = {
    barData: mockBarData,
    color: "gray",
    height: 300,
    width: 600,
    yScale: mockYScale,
  };

  it("renders a BarItem for each data point", () => {
    const { getAllByTestId } = render(<BarGraph {...defaultProps} />);
    const bars = getAllByTestId("bar-item");
    expect(bars).toHaveLength(3);
  });

  it("calculates correct dimensions for bars", () => {
    // yScale(10) -> 200, height 300, padding 0 -> barHeight = 100
    // yScale(30) -> 0, height 300, padding 0 -> barHeight = 300
    const { getAllByTestId } = render(
      <BarGraph {...defaultProps} padding={0} />,
    );
    const bars = getAllByTestId("bar-item");

    const rect1 = bars[0].querySelector("rect");
    const rect3 = bars[2].querySelector("rect");

    expect(Number(rect1?.getAttribute("height"))).toBeCloseTo(100);
    expect(Number(rect3?.getAttribute("height"))).toBeCloseTo(300);
  });

  it("renders bar labels when provided", () => {
    const barLabel = (d: { height: number }) => `Value: ${d.height}`;
    render(<BarGraph {...defaultProps} barLabel={barLabel} />);

    expect(screen.getByText("Value: 10")).toBeInTheDocument();
  });

  it("handles histogram mode logic for widths and positions", () => {
    const histogramData = [
      { key: 0, x0: 0, x1: 10, height: 10 },
      { key: 1, x0: 10, x1: 20, height: 20 },
    ];
    const thresholds = [0, 10, 20];

    const { getAllByTestId } = render(
      <BarGraph
        {...defaultProps}
        barData={histogramData}
        histogram={true}
        thresholds={thresholds}
        padding={0}
      />,
    );

    const bars = getAllByTestId("bar-item");
    const rect1 = bars[0].querySelector("rect");

    // In histogram mode: x = xScale(x0) + 1, width = xScale(x1) - xScale(x0) - 2
    // With width 600 and domain [0, 20], xScale(10) should be 300.
    expect(rect1).toHaveAttribute("x", "1");
    expect(rect1).toHaveAttribute("width", "298");
  });
});
