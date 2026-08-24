import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import COLORS from "@/utils/styles";
import type { FixedPoint } from "../../mathUtils";
import CobwebChart, { CHART_HEIGHT, CHART_PADDING, CHART_WIDTH } from ".";

const identity = (probability: number) => probability;

describe("CobwebChart", () => {
  it("renders without crashing when there are no fixed points or cobweb path", () => {
    const { container } = render(
      <CobwebChart map={identity} cobwebPath={[]} fixedPoints={[]} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(0);
  });

  it("colors a stable fixed point green and an unstable one red", () => {
    const fixedPoints: FixedPoint[] = [
      { probability: 0.3, slope: 0.2, stable: true },
      { probability: 0.7, slope: 1.5, stable: false },
    ];
    const { container } = render(
      <CobwebChart map={identity} cobwebPath={[]} fixedPoints={fixedPoints} />,
    );
    const circles = container.querySelectorAll("circle");
    expect(circles).toHaveLength(2);
    expect(circles[0]).toHaveAttribute("fill", COLORS.DARK_GREEN);
    expect(circles[1]).toHaveAttribute("fill", COLORS.RED);
  });

  it("positions a fixed point using the default scale derived from width/height/padding", () => {
    const fixedPoints: FixedPoint[] = [
      { probability: 0, slope: 0, stable: true },
    ];
    const { container } = render(
      <CobwebChart map={identity} cobwebPath={[]} fixedPoints={fixedPoints} />,
    );
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("cx", String(CHART_PADDING.left));
    expect(circle).toHaveAttribute(
      "cy",
      String(CHART_HEIGHT - CHART_PADDING.bottom),
    );
  });

  it("uses explicit xScale/yScale props over the default when provided", () => {
    const xScale = scaleLinear().domain([0, 1]).range([0, CHART_WIDTH]);
    const yScale = scaleLinear().domain([0, 1]).range([CHART_HEIGHT, 0]);
    const fixedPoints: FixedPoint[] = [
      { probability: 0.5, slope: 0, stable: true },
    ];
    const { container } = render(
      <CobwebChart
        map={identity}
        cobwebPath={[]}
        fixedPoints={fixedPoints}
        xScale={xScale}
        yScale={yScale}
      />,
    );
    const circle = container.querySelector("circle");
    expect(circle).toHaveAttribute("cx", String(xScale(0.5)));
    expect(circle).toHaveAttribute("cy", String(yScale(0.5)));
  });

  it("renders children inside the chart", () => {
    const { getByTestId } = render(
      <CobwebChart map={identity} cobwebPath={[]} fixedPoints={[]}>
        <circle data-testid="overlay" cx={1} cy={1} r={1} />
      </CobwebChart>,
    );
    expect(getByTestId("overlay")).toBeInTheDocument();
  });
});
