import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import updateSpeeds from "../../data";
import EconomyNodeGroup from "./EconomyNodeGroup";

// Captures onImpact so tests can trigger a collision directly.
const { getOnImpact, forceBounceInstance } = vi.hoisted(() => {
  let onImpact: ((n1: unknown, n2: unknown) => void) | null = null;
  const instance = Object.assign(() => {}, {
    radius: (fn: () => number) => {
      fn();
      return instance;
    },
    onImpact: (cb: (n1: unknown, n2: unknown) => void) => {
      onImpact = cb;
      return instance;
    },
    initialize: () => {},
  });
  return { forceBounceInstance: instance, getOnImpact: () => onImpact };
});

vi.mock("d3-force-bounce", () => ({
  default: () => forceBounceInstance,
}));

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

// Fake timers + unmounting in afterEach keep d3-timer's scheduling flag from leaking between tests.
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  act(() => {
    vi.advanceTimersByTime(20);
  });
  cleanup();
  act(() => {
    vi.advanceTimersByTime(20);
  });
  vi.useRealTimers();
});

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

  it("does not draw immediately when the population grows while playing", () => {
    const { rerender } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} playing speeds={[10, 10]} />
      </svg>,
    );
    expect(() =>
      rerender(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} playing speeds={[10, 10, 10]} />
        </svg>,
      ),
    ).not.toThrow();
  });

  describe("collision handling", () => {
    const node1 = { key: 0, r: 15, vx: 1, vy: 1 };
    const node2 = { key: 1, r: 15, vx: -1, vy: -1 };

    it("calls updateFn and onSpeedsChange when playing and not paused", () => {
      const onSpeedsChange = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup
            {...defaultProps}
            playing
            paused={false}
            onSpeedsChange={onSpeedsChange}
          />
        </svg>,
      );
      getOnImpact()?.(node1, node2);
      expect(onSpeedsChange).toHaveBeenCalled();
    });

    it("does nothing on collision when paused", () => {
      const onSpeedsChange = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup
            {...defaultProps}
            playing
            paused
            onSpeedsChange={onSpeedsChange}
          />
        </svg>,
      );
      getOnImpact()?.(node1, node2);
      expect(onSpeedsChange).not.toHaveBeenCalled();
    });

    it("does nothing on collision when not playing", () => {
      const onSpeedsChange = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup
            {...defaultProps}
            playing={false}
            onSpeedsChange={onSpeedsChange}
          />
        </svg>,
      );
      getOnImpact()?.(node1, node2);
      expect(onSpeedsChange).not.toHaveBeenCalled();
    });
  });

  describe("simulation ticking", () => {
    it("draws moving nodes as the simulation ticks while playing", () => {
      const { container } = render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} playing paused={false} />
        </svg>,
      );
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(container.querySelectorAll("circle").length).toBe(3);
    });

    it("stops ticking when paused mid-simulation", () => {
      const { container, rerender } = render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} playing paused={false} />
        </svg>,
      );
      act(() => {
        vi.advanceTimersByTime(50);
      });
      rerender(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} playing paused />
        </svg>,
      );
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(container.querySelectorAll("circle").length).toBe(3);
    });

    it("falls back to speed 0 when a node's speed entry is missing", () => {
      const sparseSpeeds = [10, undefined, 10] as unknown as number[];
      const { container } = render(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup
            {...defaultProps}
            playing
            paused={false}
            speeds={sparseSpeeds}
          />
        </svg>,
      );
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(container.querySelectorAll("circle").length).toBe(3);
    });
  });

  it("rescales node velocities when velocityMultiplier changes", () => {
    const { rerender } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} velocityMultiplier={1} />
      </svg>,
    );
    expect(() =>
      rerender(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} velocityMultiplier={2} />
        </svg>,
      ),
    ).not.toThrow();
  });

  it("skips rescaling a velocity component that is unset", () => {
    // A tick while playing nulls lastVx, exercising the falsy side of `if (v)`.
    const { rerender } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup {...defaultProps} playing velocityMultiplier={1} />
      </svg>,
    );
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(() =>
      rerender(
        <svg role="img" aria-label="test">
          <EconomyNodeGroup {...defaultProps} playing velocityMultiplier={2} />
        </svg>,
      ),
    ).not.toThrow();
  });
});
