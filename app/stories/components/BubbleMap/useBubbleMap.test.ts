import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ArticleMeta, StoryMap } from "@/utils/content";
import { useBubbleMap } from "./useBubbleMap";

const storyMap: StoryMap = {
  points: [
    { article: { slug: "a" } as ArticleMeta, x: 0, y: 0 },
    { article: { slug: "b" } as ArticleMeta, x: 1, y: 1 },
  ],
  links: [{ source: "a", target: "b", score: 0.5 }],
};

const size = { width: 1000, height: 700 };

const reduceMotion = () => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: true });
};

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({ matches: false });
});

afterEach(() => {
  Reflect.deleteProperty(window, "matchMedia");
});

describe("useBubbleMap", () => {
  it("lays out nothing until the stage has a size", () => {
    const { result } = renderHook(() =>
      useBubbleMap(storyMap, { width: 0, height: 0 }),
    );
    expect(result.current.nodes).toEqual([]);
    act(() => result.current.activate("a"));
    act(() => result.current.startDrag("a"));
    act(() => result.current.endDrag("a"));
    expect(result.current.activeSlug).toBe("a");
  });

  it("animates bubbles out from the center", async () => {
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    const [first] = result.current.nodes;
    expect(first.r).toBe(0);
    await waitFor(() => expect(result.current.nodes[0].r).toBeGreaterThan(0));
  });

  it("places bubbles immediately when motion is reduced", () => {
    reduceMotion();
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    const [first, second] = result.current.nodes;
    expect(first.r).toBe(58);
    expect(first.x).toBeLessThan(second.x);
    expect(first.y).toBeGreaterThan(second.y);
  });

  it("enlarges the active bubble and shrinks it when deactivated", () => {
    reduceMotion();
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    act(() => result.current.activate("a"));
    expect(result.current.activeSlug).toBe("a");
    expect(result.current.nodes[0].r).toBeCloseTo(104.4);
    expect(result.current.nodes[1].r).toBe(58);
    act(() => result.current.activate("a"));
    act(() => result.current.activate(null));
    expect(result.current.activeSlug).toBeNull();
    expect(result.current.nodes[0].r).toBe(58);
  });

  it("restarts the animation when the active bubble changes", async () => {
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    act(() => result.current.activate("b"));
    await waitFor(() => expect(result.current.nodes[1].r).toBeGreaterThan(58));
  });

  it("keeps positions and the active size when the stage resizes", () => {
    reduceMotion();
    const { result, rerender } = renderHook(
      ({ width, height }) => useBubbleMap(storyMap, { width, height }),
      { initialProps: size },
    );
    act(() => result.current.activate("a"));
    rerender({ width: 900, height: 700 });
    expect(result.current.nodes[0].targetR).toBeCloseTo(97.2);
    expect(result.current.nodes[1].targetR).toBe(54);
  });

  it("pins a dragged bubble to the pointer and releases it", () => {
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    const [first] = result.current.nodes;
    act(() => result.current.startDrag("a"));
    expect(first.fx).toBe(first.x);
    act(() => result.current.moveDrag("a", { x: 10, y: 20 }));
    expect(first.fx).toBe(10);
    expect(first.fy).toBe(20);
    act(() => result.current.endDrag("a"));
    expect(first.fx).toBeNull();
    expect(first.fy).toBeNull();
  });

  it("settles immediately after a drag when motion is reduced", () => {
    reduceMotion();
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    const [first] = result.current.nodes;
    act(() => result.current.startDrag("a"));
    act(() => result.current.moveDrag("a", { x: 500, y: 300 }));
    act(() => result.current.endDrag("a"));
    expect(first.x).toBeLessThan(500);
  });

  it("ignores drags on unknown stories", () => {
    const { result } = renderHook(() => useBubbleMap(storyMap, size));
    act(() => result.current.startDrag("missing"));
    act(() => result.current.moveDrag("missing", { x: 1, y: 1 }));
    act(() => result.current.endDrag("missing"));
    expect(result.current.nodes.every((node) => node.fx === undefined)).toBe(
      true,
    );
  });
});
