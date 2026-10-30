import { afterEach, describe, expect, it, vi } from "vitest";
import { seededRandom } from "@/utils/mathHelpers";
import {
  type BubbleNode,
  bubbleRadius,
  createBubbleSimulation,
  layoutTargets,
  placePreview,
  prefersReducedMotion,
  relatedScores,
  threadEndpoints,
  threadOpacity,
  threadWidth,
} from "./utils";

const makeNode = (overrides: Partial<BubbleNode> = {}): BubbleNode => ({
  slug: "node",
  x: 100,
  y: 100,
  vx: 0,
  vy: 0,
  r: 10,
  targetR: 10,
  tx: 100,
  ty: 100,
  ...overrides,
});

describe("prefersReducedMotion", () => {
  afterEach(() => {
    Reflect.deleteProperty(window, "matchMedia");
  });

  it("reflects the reduced motion media query", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    expect(prefersReducedMotion()).toBe(true);
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-reduced-motion: reduce)",
    );
  });
});

describe("bubbleRadius", () => {
  it("scales with width between a minimum and maximum", () => {
    expect(bubbleRadius(200)).toBe(26);
    expect(bubbleRadius(600)).toBe(36);
    expect(bubbleRadius(2000)).toBe(58);
  });
});

describe("layoutTargets", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ];

  it("maps x across and y up on a landscape stage", () => {
    expect(layoutTargets(points, { width: 200, height: 100 }, 10)).toEqual([
      { tx: 16, ty: 84 },
      { tx: 184, ty: 16 },
    ]);
  });

  it("rotates the layout on a portrait stage", () => {
    expect(layoutTargets(points, { width: 100, height: 200 }, 10)).toEqual([
      { tx: 16, ty: 16 },
      { tx: 84, ty: 184 },
    ]);
  });
});

describe("relatedScores", () => {
  const links = [
    { source: "a", target: "b", score: 0.2 },
    { source: "c", target: "a", score: 0.5 },
    { source: "b", target: "c", score: 0.9 },
  ];

  it("maps linked stories in either direction to their scores", () => {
    expect(relatedScores("a", links)).toEqual(
      new Map([
        ["b", 0.2],
        ["c", 0.5],
      ]),
    );
  });

  it("returns nothing for an unlinked story", () => {
    expect(relatedScores("d", links).size).toBe(0);
  });
});

describe("threadEndpoints", () => {
  it("trims the thread to the edges of both bubbles", () => {
    expect(
      threadEndpoints({ x: 0, y: 0, r: 10 }, { x: 100, y: 0, r: 20 }),
    ).toEqual({ x1: 10, y1: 0, x2: 80, y2: 0 });
  });

  it("does not divide by zero for overlapping centers", () => {
    expect(threadEndpoints({ x: 5, y: 5, r: 1 }, { x: 5, y: 5, r: 1 })).toEqual(
      { x1: 5, y1: 5, x2: 5, y2: 5 },
    );
  });
});

describe("thread scales", () => {
  it("clamp width and opacity to their ranges", () => {
    expect(threadWidth(-1)).toBe(1.5);
    expect(threadWidth(2)).toBe(9);
    expect(threadOpacity(-1)).toBe(0.3);
    expect(threadOpacity(2)).toBe(0.95);
  });
});

describe("placePreview", () => {
  const stage = { width: 600, height: 400 };
  const card = { width: 100, height: 50 };
  const active = { x: 300, y: 200, r: 20 };

  it("goes right of the active bubble when nothing is in the way", () => {
    expect(placePreview(active, [], card, stage)).toEqual({
      left: 334,
      top: 175,
    });
  });

  it("avoids covering related bubbles", () => {
    const relatives = [
      { x: 380, y: 200, r: 30 },
      { x: 220, y: 200, r: 30 },
    ];
    expect(placePreview(active, relatives, card, stage)).toEqual({
      left: 250,
      top: 116,
    });
  });

  it("stays inside the stage near an edge", () => {
    expect(placePreview({ x: 560, y: 30, r: 20 }, [], card, stage)).toEqual({
      left: 426,
      top: 5,
    });
  });

  it("falls back to the first candidate when nothing fits", () => {
    expect(
      placePreview(active, [], { width: 1000, height: 1000 }, stage),
    ).toEqual({ left: 334, top: 0 });
  });
});

describe("createBubbleSimulation", () => {
  const stage = { width: 400, height: 300 };

  it("pulls bubbles toward their targets and grows them to size", () => {
    const nodes = [
      makeNode({
        slug: "a",
        x: 200,
        y: 150,
        r: 0,
        targetR: 20,
        tx: 80,
        ty: 80,
      }),
      makeNode({
        slug: "b",
        x: 205,
        y: 150,
        r: 0,
        targetR: 20,
        tx: 320,
        ty: 220,
      }),
    ];
    const simulation = createBubbleSimulation(
      nodes,
      [{ source: "a", target: "b", score: 0.5 }],
      stage,
      seededRandom(1),
    );
    simulation.stop();
    simulation.tick(300);
    expect(nodes[0].r).toBeCloseTo(20);
    expect(nodes[0].x).toBeLessThan(200);
    expect(nodes[1].x).toBeGreaterThan(205);
  });

  it("keeps bubbles inside the stage", () => {
    const nodes = [
      makeNode({
        slug: "a",
        x: -50,
        y: 500,
        r: 20,
        targetR: 20,
        tx: -100,
        ty: 600,
      }),
      makeNode({
        slug: "b",
        x: 900,
        y: -40,
        r: 20,
        targetR: 20,
        tx: 1000,
        ty: -100,
      }),
    ];
    const simulation = createBubbleSimulation(
      nodes,
      [],
      stage,
      seededRandom(2),
    );
    simulation.stop();
    simulation.tick(5);
    for (const node of nodes) {
      expect(node.x).toBeGreaterThanOrEqual(node.r - 1);
      expect(node.x).toBeLessThanOrEqual(stage.width - node.r + 1);
      expect(node.y).toBeGreaterThanOrEqual(node.r - 1);
      expect(node.y).toBeLessThanOrEqual(stage.height - node.r + 1);
    }
  });

  it("is deterministic for the same seed", () => {
    const run = () => {
      const nodes = [
        makeNode({ slug: "a", x: 200, y: 150 }),
        makeNode({ slug: "b", x: 200, y: 150 }),
      ];
      const simulation = createBubbleSimulation(
        nodes,
        [],
        stage,
        seededRandom(3),
      );
      simulation.stop();
      simulation.tick(50);
      return nodes.map(({ x, y }) => [x, y]);
    };
    expect(run()).toEqual(run());
  });
});
