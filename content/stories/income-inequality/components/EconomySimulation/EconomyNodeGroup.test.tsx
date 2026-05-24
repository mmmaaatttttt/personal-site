import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import updateSpeeds from "../../data";
import EconomyNodeGroup from "./EconomyNodeGroup";

const defaultProps = {
  width: 600,
  height: 600,
  speeds: [10, 10, 10],
  playing: false,
  paused: false,
  velocityMultiplier: 1,
  savingsRate: 0,
  initialV: 10,
  updateFn: updateSpeeds[0],
  onSpeedsChange: vi.fn(),
};

describe("EconomyNodeGroup", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} />
      </svg>,
    );
    expect(container.querySelector("g")).toBeInTheDocument();
  });

  it("renders the svg group container", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} />
      </svg>,
    );
    // Nodes are rendered imperatively by D3 on each tick;
    // JSDOM doesn't run the simulation, so we just verify the container is present.
    expect(container.querySelector("g")).toBeInTheDocument();
  });

  it("does not crash when speeds array changes length", () => {
    const { rerender } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} speeds={[10, 10]} />
      </svg>,
    );
    // Verify re-render with a larger population doesn't throw
    expect(() =>
      rerender(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} speeds={[10, 10, 10, 10, 10]} />
        </svg>,
      ),
    ).not.toThrow();
  });
});
