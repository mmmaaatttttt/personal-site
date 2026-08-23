import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import type { EconomyNode } from "../../data";
import updateSpeeds from "../../data";
import EconomyNodeGroup from "./EconomyNodeGroup";

// A fake forceSimulation gives control over sim.nodes() and the tick callback.
const { mockSim, getTickCallback } = vi.hoisted(() => {
  let tickCallback: (() => void) | null = null;
  let nodes: unknown[] = [];
  const sim = {
    alphaDecay: () => sim,
    velocityDecay: () => sim,
    force: () => sim,
    nodes: (arr?: unknown[]) => {
      if (arr) {
        nodes = arr;
        return sim;
      }
      return nodes;
    },
    on: (event: string, cb: () => void) => {
      if (event === "tick") tickCallback = cb;
      return sim;
    },
    alpha: () => sim,
    restart: () => sim,
    stop: () => sim,
  };
  return { mockSim: sim, getTickCallback: () => tickCallback };
});

vi.mock("d3-force", async (importOriginal) => {
  const actual = await importOriginal<typeof import("d3-force")>();
  return { ...actual, forceSimulation: () => mockSim };
});

describe("EconomyNodeGroup velocity fallback", () => {
  it("uses vx/vy when set, falls back to lastVx/lastVy, then to 0", () => {
    const { container } = render(
      <svg role="img" aria-label="test">
        <EconomyNodeGroup
          width={600}
          height={600}
          speeds={[10, 10, 10]}
          playing
          paused={false}
          velocityMultiplier={1}
          savingsRate={0}
          initialV={10}
          updateFn={updateSpeeds[0]}
          onSpeedsChange={vi.fn()}
        />
      </svg>,
    );

    const nodes: EconomyNode[] = [
      { key: 0, r: 15, x: 100, y: 100, vx: 5, vy: 5 },
      { key: 1, r: 15, x: 200, y: 200, vx: 0, vy: 0, lastVx: 3, lastVy: 3 },
      {
        key: 2,
        r: 15,
        x: 300,
        y: 300,
        vx: 0,
        vy: 0,
        lastVx: 0,
        lastVy: 0,
      },
    ];
    mockSim.nodes(nodes);

    act(() => {
      getTickCallback()?.();
    });

    expect(container.querySelectorAll("circle").length).toBe(3);
    expect(nodes[0].vx).toBe(5);
    expect(nodes[1].vx).toBe(3);
    expect(nodes[2].vx).toBe(0);
  });
});
