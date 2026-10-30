"use client";

import type { Simulation } from "d3-force";
import { useCallback, useEffect, useRef, useState } from "react";
import type { StoryMap } from "@/utils/content";
import { seededRandom } from "@/utils/mathHelpers";
import {
  type BubbleLink,
  type BubbleNode,
  bubbleRadius,
  createBubbleSimulation,
  HOVER_SCALE,
  layoutTargets,
  prefersReducedMotion,
  type Size,
} from "./utils";

const SEED = 7;
const SETTLE_TICKS = 300;

export function useBubbleMap(storyMap: StoryMap, { width, height }: Size) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [, setFrame] = useState(0);
  const nodesRef = useRef<BubbleNode[]>([]);
  const simulationRef = useRef<Simulation<BubbleNode, BubbleLink> | null>(null);
  const activeRef = useRef<string | null>(null);
  const reducedMotion = useRef(false);

  const radius = bubbleRadius(width);

  const render = useCallback(() => setFrame((frame) => frame + 1), []);

  const settleNow = useCallback(
    (simulation: Simulation<BubbleNode, BubbleLink>) => {
      for (const node of nodesRef.current) node.r = node.targetR;
      simulation.stop();
      simulation.alpha(1).tick(SETTLE_TICKS);
      render();
    },
    [render],
  );

  useEffect(() => {
    if (width === 0 || height === 0) return;
    reducedMotion.current = prefersReducedMotion();
    const random = seededRandom(SEED);
    const previous = new Map(nodesRef.current.map((node) => [node.slug, node]));
    const targets = layoutTargets(storyMap.points, { width, height }, radius);
    nodesRef.current = storyMap.points.map(({ article }, index) => {
      const existing = previous.get(article.slug);
      const targetR =
        article.slug === activeRef.current ? radius * HOVER_SCALE : radius;
      return {
        slug: article.slug,
        x: existing?.x ?? width / 2 + (random() - 0.5) * 20,
        y: existing?.y ?? height / 2 + (random() - 0.5) * 20,
        vx: 0,
        vy: 0,
        r: existing?.r ?? 0,
        targetR,
        ...targets[index],
      };
    });
    const simulation = createBubbleSimulation(
      nodesRef.current,
      storyMap.links,
      { width, height },
      random,
    );
    simulation.on("tick", render);
    simulationRef.current = simulation;
    if (reducedMotion.current) settleNow(simulation);
    else render();
    return () => {
      simulation.stop();
    };
  }, [storyMap, width, height, radius, render, settleNow]);

  const nudge = useCallback(
    (alpha: number) => {
      const simulation = simulationRef.current;
      if (!simulation) return;
      if (reducedMotion.current) {
        settleNow(simulation);
        return;
      }
      simulation.alpha(Math.max(simulation.alpha(), alpha)).restart();
    },
    [settleNow],
  );

  const activate = useCallback(
    (slug: string | null) => {
      if (activeRef.current === slug) return;
      activeRef.current = slug;
      setActiveSlug(slug);
      for (const node of nodesRef.current) {
        node.targetR = node.slug === slug ? radius * HOVER_SCALE : radius;
      }
      nudge(0.35);
    },
    [radius, nudge],
  );

  const findNode = (slug: string) =>
    nodesRef.current.find((node) => node.slug === slug);

  const startDrag = (slug: string) => {
    const node = findNode(slug);
    const simulation = simulationRef.current;
    if (!node || !simulation) return;
    node.fx = node.x;
    node.fy = node.y;
    simulation.alphaTarget(0.25).restart();
  };

  const moveDrag = (slug: string, point: { x: number; y: number }) => {
    const node = findNode(slug);
    if (!node) return;
    node.fx = point.x;
    node.fy = point.y;
  };

  const endDrag = (slug: string) => {
    const node = findNode(slug);
    const simulation = simulationRef.current;
    if (!node || !simulation) return;
    node.fx = null;
    node.fy = null;
    simulation.alphaTarget(0);
    if (reducedMotion.current) settleNow(simulation);
  };

  return {
    nodes: nodesRef.current,
    activeSlug,
    activate,
    startDrag,
    moveDrag,
    endDrag,
  };
}
