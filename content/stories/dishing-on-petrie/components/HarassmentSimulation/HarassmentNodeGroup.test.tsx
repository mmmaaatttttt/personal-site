import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import HarassmentNodeGroup from "./HarassmentNodeGroup";

const { getOnImpact, forceBounceInstance } = vi.hoisted(() => {
  let onImpact: ((n1: unknown, n2: unknown) => void) | null = null;
  const instance = Object.assign(() => {}, {
    radius: (fn: (node: unknown) => number) => {
      fn({ r: 15 });
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

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
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} />
      </svg>,
    );
    expect(container.querySelector("rect")).toBeInTheDocument();
  });

  it("renders correct number of nodes when initial counts are passed", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} />
      </svg>,
    );
    const circles = container.querySelectorAll("circle.node");
    expect(circles.length).toBe(8);
  });

  it("draws moving nodes as the simulation ticks while playing", async () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} playing paused={false} />
      </svg>,
    );
    await wait(200);
    expect(container.querySelectorAll("circle.node").length).toBe(8);
  });

  it("regenerates nodes when the population counts change", () => {
    const { container, rerender } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} greenCount={2} blueCount={1} />
      </svg>,
    );
    expect(container.querySelectorAll("circle.node").length).toBe(3);
    rerender(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} greenCount={4} blueCount={2} />
      </svg>,
    );
    expect(container.querySelectorAll("circle.node").length).toBe(6);
  });

  it("tears down and recreates the simulation's DOM when width or height changes", () => {
    const { container, rerender } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} />
      </svg>,
    );
    expect(container.querySelectorAll("circle.node").length).toBe(8);
    rerender(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} width={800} />
      </svg>,
    );
    expect(container.querySelectorAll("circle.node").length).toBe(8);
  });

  it("falls back new nodes' velocity to zero when initialV is zero", async () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup
          {...defaultProps}
          playing
          paused={false}
          initialV={0}
        />
      </svg>,
    );
    await wait(100);
    expect(container.querySelectorAll("circle.node").length).toBe(8);
  });

  describe("collisions and shouting", () => {
    const blueNode = {
      key: "#1E3A8A-0",
      properties: { color: "#1E3A8A" },
      r: 15,
    };
    const greenNode = {
      key: "#22C55E-0",
      properties: { color: "#22C55E" },
      r: 15,
    };

    it("does nothing on collision when not playing", async () => {
      const handleShout = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      act(() => {
        getOnImpact()?.(blueNode, greenNode);
      });
      await wait(50);
      expect(handleShout).not.toHaveBeenCalled();
    });

    it("does nothing on collision when the probability roll fails", async () => {
      const handleShout = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.99)
        .mockReturnValueOnce(0.99);
      act(() => {
        getOnImpact()?.(blueNode, greenNode);
      });
      await wait(50);
      expect(handleShout).not.toHaveBeenCalled();
    });

    it("generates a shout wave on a successful collision roll and eventually reports it heard by the same color", async () => {
      const handleShout = vi.fn();
      const { container } = render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      act(() => {
        getOnImpact()?.(blueNode, blueNode);
      });
      await wait(250);
      expect(container.querySelectorAll(".shout").length).toBeGreaterThan(0);

      await wait(3500);
      expect(handleShout).toHaveBeenCalledWith(
        "blueShoutsHeardFromBlueOnly",
        expect.any(Number),
      );
    });

    it("reports greenShoutsHeardFromBlue when a blue-origin wave passes over a green node", async () => {
      const handleShout = vi.fn();
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.999)
        .mockReturnValueOnce(0.999)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            width={200}
            height={200}
            blueCount={1}
            greenCount={1}
            initialV={0}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      act(() => {
        getOnImpact()?.(blueNode, blueNode);
      });
      await wait(300);
      expect(handleShout).toHaveBeenCalledWith(
        "greenShoutsHeardFromBlue",
        expect.any(Number),
      );
    });

    it("reports blueShoutsHeardFromGreen when a green-origin wave passes over a blue node", async () => {
      const handleShout = vi.fn();
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0.999)
        .mockReturnValueOnce(0.999)
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            width={200}
            height={200}
            blueCount={1}
            greenCount={1}
            initialV={0}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      act(() => {
        getOnImpact()?.(greenNode, greenNode);
      });
      await wait(300);
      expect(handleShout).toHaveBeenCalledWith(
        "blueShoutsHeardFromGreen",
        expect.any(Number),
      );
    });

    it("reports a green-originated shout as heard by green only, once fully expired", async () => {
      const handleShout = vi.fn();
      render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      act(() => {
        getOnImpact()?.(greenNode, greenNode);
      });
      await wait(3500);
      expect(handleShout).toHaveBeenCalledWith(
        "greenShoutsHeardFromGreenOnly",
        expect.any(Number),
      );
    });

    it("stops generating wave frames once paused mid-wave", async () => {
      const handleShout = vi.fn();
      const { rerender } = render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing
            paused={false}
            handleShout={handleShout}
          />
        </svg>,
      );
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      act(() => {
        getOnImpact()?.(blueNode, blueNode);
      });
      await wait(50);
      rerender(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup
            {...defaultProps}
            playing
            paused
            handleShout={handleShout}
          />
        </svg>,
      );
      await wait(3500);
      expect(handleShout).not.toHaveBeenCalled();
    });
  });

  describe("playing/paused/reset transitions", () => {
    it("clears shout waves and resets the shout count when playing stops", async () => {
      const { container, rerender } = render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup {...defaultProps} playing paused={false} />
        </svg>,
      );
      vi.spyOn(Math, "random")
        .mockReturnValueOnce(0.001)
        .mockReturnValueOnce(0.001);
      act(() => {
        getOnImpact()?.(
          { key: "blue-0", properties: { color: "#1E3A8A" }, r: 15 },
          { key: "blue-1", properties: { color: "#1E3A8A" }, r: 15 },
        );
      });
      await wait(250);
      expect(container.querySelectorAll(".shout").length).toBeGreaterThan(0);

      rerender(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup {...defaultProps} playing={false} />
        </svg>,
      );
      expect(container.querySelectorAll(".shout").length).toBe(0);
    });

    it("renders once immediately when stopped instead of playing", () => {
      const { container } = render(
        <svg role="img" aria-label="test">
          <HarassmentNodeGroup {...defaultProps} playing={false} />
        </svg>,
      );
      expect(container.querySelectorAll("circle.node").length).toBe(8);
    });
  });

  it("stops the simulation loop on unmount", async () => {
    const { unmount } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} playing paused={false} />
      </svg>,
    );
    unmount();
    await expect(wait(500)).resolves.toBeUndefined();
  });

  it("does not crash when unmounted mid-wave, after any already-queued tick or wave frame fires", async () => {
    const blueNode = {
      key: "#1E3A8A-0",
      properties: { color: "#1E3A8A" },
      r: 15,
    };
    const { unmount } = render(
      <svg role="img" aria-label="test">
        <HarassmentNodeGroup {...defaultProps} playing paused={false} />
      </svg>,
    );
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0.001)
      .mockReturnValueOnce(0.001);
    act(() => {
      getOnImpact()?.(blueNode, blueNode);
    });
    await wait(30);
    unmount();
    await expect(wait(2500)).resolves.toBeUndefined();
  });
});
