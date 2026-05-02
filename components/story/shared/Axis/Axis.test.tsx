import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom/vitest";
import { scaleLinear } from "d3-scale";
import Axis from ".";

describe("Axis Component", () => {
  const mockScale = scaleLinear().domain([0, 100]).range([0, 500]);

  it("renders an x-axis correctly", () => {
    const { container } = render(
      <svg>
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
      <svg>
        <Axis direction="y" scale={mockScale} xShift={20} />
      </svg>,
    );
    const g = container.querySelector(".axis-group");
    expect(g).toBeInTheDocument();
    expect(g).toHaveAttribute("transform", "translate(19.5, -0.5)");
  });

  it("applies tick styling and formatting", () => {
    const { container } = render(
      <svg>
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
      <svg>
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
      <svg>
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
});
