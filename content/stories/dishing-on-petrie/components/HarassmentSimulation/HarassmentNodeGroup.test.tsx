import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import HarassmentNodeGroup from "./HarassmentNodeGroup";

describe("HarassmentNodeGroup Component", () => {
  const defaultProps = {
    width: 600,
    height: 400,
    greenCount: 5,
    blueCount: 3,
    playing: false,
    paused: false,
    initialV: 2,
    handleShout: vi.fn(),
    blueOnBlueProb: 0.05,
    greenOnGreenProb: 0.05,
    blueOnGreenProb: 0.05,
    greenOnBlueProb: 0.05,
  };

  it("renders without crashing and outputs an svg group with border", () => {
    const { container } = render(
      <svg>
        <HarassmentNodeGroup {...defaultProps} />
      </svg>,
    );
    expect(container.querySelector("rect")).toBeInTheDocument();
  });

  it("renders correct number of nodes when initial counts are passed", () => {
    const { container } = render(
      <svg>
        <HarassmentNodeGroup {...defaultProps} />
      </svg>,
    );
    // 5 green + 3 blue = 8 circles
    const circles = container.querySelectorAll("circle.node");
    expect(circles.length).toBe(8);
  });
});
