import { afterEach, describe, expect, it, vi } from "vitest";
import type { EconomyNode } from "./data";
import updateSpeeds from "./data";

const makeNode = (overrides: Partial<EconomyNode>): EconomyNode => ({
  key: 0,
  r: 15,
  ...overrides,
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("updateSpeeds[0] (normalCollision)", () => {
  it("returns speeds unchanged when both nodes have zero velocity", () => {
    const nodes = [
      makeNode({ key: 0, vx: 0, vy: 0 }),
      makeNode({ key: 1, vx: 0, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[0](speeds, 1, 0.5, nodes);
    expect(result).toBe(speeds);
  });

  it("falls back to zero velocity for a node with undefined vx/vy", () => {
    const nodes = [makeNode({ key: 0, vx: 3, vy: 4 }), makeNode({ key: 1 })];
    const speeds = [1, 1];
    const result = updateSpeeds[0](speeds, 1, 0.5, nodes);
    expect(result[1]).toBe(0);
  });

  it("moves energy from node 0 to node 1 when the random roll is below 0.5", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const nodes = [
      makeNode({ key: 0, vx: 3, vy: 4 }),
      makeNode({ key: 1, vx: 1, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[0](speeds, 1, 0.5, nodes);
    expect(result[0]).not.toBe(speeds[0]);
    expect(result[1]).not.toBe(speeds[1]);
  });

  it("moves energy from node 1 to node 0 when the random roll is 0.5 or above", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const nodes = [
      makeNode({ key: 0, vx: 3, vy: 4 }),
      makeNode({ key: 1, vx: 1, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[0](speeds, 1, 0.5, nodes);
    expect(result[0]).not.toBe(speeds[0]);
    expect(result[1]).not.toBe(speeds[1]);
  });
});

describe("updateSpeeds[1] (collisionMaximizedByLeastWealth)", () => {
  it("moves energy toward node 0 when the random roll is below 0.5", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const nodes = [
      makeNode({ key: 0, vx: 3, vy: 4 }),
      makeNode({ key: 1, vx: 1, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[1](speeds, 1, 0.5, nodes);
    expect(result[0]).not.toBe(speeds[0]);
    expect(result[1]).not.toBe(speeds[1]);
  });

  it("moves energy toward node 1 when the random roll is 0.5 or above", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const nodes = [
      makeNode({ key: 0, vx: 3, vy: 4 }),
      makeNode({ key: 1, vx: 1, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[1](speeds, 1, 0.5, nodes);
    expect(result[0]).not.toBe(speeds[0]);
    expect(result[1]).not.toBe(speeds[1]);
  });
});

describe("updateSpeeds[2]", () => {
  it("is the same normalCollision behavior as updateSpeeds[0]", () => {
    const nodes = [
      makeNode({ key: 0, vx: 0, vy: 0 }),
      makeNode({ key: 1, vx: 0, vy: 0 }),
    ];
    const speeds = [1, 1];
    const result = updateSpeeds[2](speeds, 1, 0.5, nodes);
    expect(result).toBe(speeds);
  });
});
