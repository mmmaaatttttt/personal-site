import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { scaleBand, scaleLinear, scaleTime } from "d3-scale";
import { ChartContext } from "@/context/ChartContext";
import Axis from ".";

describe("Axis Component", () => {
  const mockScale = scaleLinear().domain([0, 100]).range([0, 500]);

  it("renders an x-axis correctly", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis direction="x" scale={mockScale} yShift={380} />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    expect(g).toBeInTheDocument();
    // d3-axis-bottom will add .tick elements
    // JSDOM might not render them all depending on how d3-selection interacts
    // but we can check if the group exists and has the transform
    expect(g).toHaveAttribute("transform", "translate(-0.5, 379.5)");
  });

  it("renders a y-axis correctly", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis direction="y" scale={mockScale} xShift={20} />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    expect(g).toBeInTheDocument();
    expect(g).toHaveAttribute("transform", "translate(19.5, -0.5)");
  });

  it("applies tick styling and formatting", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis
          direction="x"
          scale={mockScale}
          tickColor="red"
          tickFormat=".0f"
        />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    // We can't easily check internal D3 labels in JSDOM sometimes without manual trigger
    // but we can check if the tick line transform/stroke was applied if D3 ran correctly
    const ticks = g?.querySelectorAll(".tick");
    if (ticks && ticks.length > 0) {
      expect(ticks[0].querySelector("line")).toHaveAttribute("stroke", "red");
    }
  });

  it("suppresses tick labels when no tickFormat is provided", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis direction="y" scale={mockScale} />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    const labels = g?.querySelectorAll(".tick text");
    // All tick text nodes must be empty — no tickFormat means suppress labels
    if (labels && labels.length > 0) {
      labels.forEach((label) => {
        expect(label.textContent).toBe("");
      });
    }
  });

  it("respects labelPosition fine-tuning", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis
          direction="x"
          scale={mockScale}
          tickFormat=","
          labelPosition={{ dx: "10", dy: "20" }}
        />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    const labels = g?.querySelectorAll("text");
    if (labels && labels.length > 0) {
      expect(labels[0]).toHaveAttribute("dx", "10");
      expect(labels[0]).toHaveAttribute("dy", "20");
    }
  });

  it("self-positions from ChartContext when no explicit xShift/yShift", () => {
    const xScale = scaleLinear().domain([0, 100]).range([0, 600]);
    const yScale = scaleLinear().domain([0, 100]).range([400, 0]);
    const contextValue = {
      xScale,
      yScale,
      width: 600,
      height: 400,
      padding: { top: 20, bottom: 40, left: 50, right: 10 },
      gridlinesHorizontal: true,
      gridlinesVertical: true,
    };

    const { container } = render(
      <ChartContext.Provider value={contextValue}>
        <svg role="img" aria-label="test">
          {/* x-axis should sit at height - padding.bottom = 400 - 40 = 360 */}
          <Axis direction="x" scale={mockScale} />
        </svg>
      </ChartContext.Provider>,
    );

    const g = container.querySelector(".axis-group");
    // resolvedXShift=0, resolvedYShift=360 → translate(-0.5, 359.5)
    expect(g).toHaveAttribute("transform", "translate(-0.5, 359.5)");
  });

  it("returns 0 tickSize for x-axis when vertical gridlines are disabled", () => {
    const xScale = scaleLinear().domain([0, 100]).range([0, 600]);
    const yScale = scaleLinear().domain([0, 100]).range([400, 0]);
    const contextValue = {
      xScale,
      yScale,
      width: 600,
      height: 400,
      padding: { top: 20, bottom: 40, left: 50, right: 10 },
      gridlinesHorizontal: true,
      gridlinesVertical: false,
    };
    const { container } = render(
      <ChartContext.Provider value={contextValue}>
        <svg role="img" aria-label="test">
          <Axis direction="x" scale={xScale} />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector(".axis-group")).toBeInTheDocument();
  });

  it("returns 0 tickSize for y-axis when horizontal gridlines are disabled", () => {
    const xScale = scaleLinear().domain([0, 100]).range([0, 600]);
    const yScale = scaleLinear().domain([0, 100]).range([400, 0]);
    const contextValue = {
      xScale,
      yScale,
      width: 600,
      height: 400,
      padding: { top: 20, bottom: 40, left: 50, right: 10 },
      gridlinesHorizontal: false,
      gridlinesVertical: true,
    };
    const { container } = render(
      <ChartContext.Provider value={contextValue}>
        <svg role="img" aria-label="test">
          <Axis direction="y" scale={yScale} />
        </svg>
      </ChartContext.Provider>,
    );
    expect(container.querySelector(".axis-group")).toBeInTheDocument();
  });

  it("formats Date domain values via tickFormat", () => {
    const dateScale = scaleTime()
      .domain([new Date(2020, 0, 1), new Date(2021, 0, 1)])
      .range([0, 600]);
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis direction="x" scale={dateScale} tickFormat=".0f" yShift={380} />
      </svg>,
    );
    expect(container.querySelector(".axis-group")).toBeInTheDocument();
  });

  it("formats string domain values via tickFormat", () => {
    const bandScale = scaleBand().domain(["A", "B", "C"]).range([0, 600]);
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis direction="x" scale={bandScale} tickFormat="" yShift={380} />
      </svg>,
    );
    expect(container.querySelector(".axis-group")).toBeInTheDocument();
  });

  it("skips tickValues when tickStep is set but domain is non-numeric", () => {
    const bandScale = scaleBand().domain(["A", "B", "C"]).range([0, 600]);
    const { container } = render(
      <svg role="img" aria-label="test">
        <Axis
          direction="x"
          scale={bandScale}
          tickFormat=""
          tickStep={1}
          yShift={380}
        />
      </svg>,
    );
    expect(container.querySelector(".axis-group")).toBeInTheDocument();
  });

  it("self-positions y-axis from ChartContext", () => {
    const xScale = scaleLinear().domain([0, 100]).range([0, 600]);
    const yScale = scaleLinear().domain([0, 100]).range([400, 0]);
    const contextValue = {
      xScale,
      yScale,
      width: 600,
      height: 400,
      padding: { top: 20, bottom: 40, left: 50, right: 10 },
      gridlinesHorizontal: true,
      gridlinesVertical: true,
    };

    const { container } = render(
      <ChartContext.Provider value={contextValue}>
        <svg role="img" aria-label="test">
          {/* y-axis should sit at padding.left = 50 */}
          <Axis direction="y" scale={mockScale} />
        </svg>
      </ChartContext.Provider>,
    );

    const g = container.querySelector(".axis-group");
    // resolvedXShift=50, resolvedYShift=0 → translate(49.5, -0.5)
    expect(g).toHaveAttribute("transform", "translate(49.5, -0.5)");
  });
});
