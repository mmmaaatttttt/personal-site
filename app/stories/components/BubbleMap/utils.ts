import {
  forceCollide,
  forceLink,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { scaleLinear } from "d3-scale";
import type { StoryMapLink } from "@/utils/content";
import { clamp } from "@/utils/mathHelpers";

export interface BubbleNode extends SimulationNodeDatum {
  slug: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  targetR: number;
  tx: number;
  ty: number;
}

export interface BubbleLink extends SimulationLinkDatum<BubbleNode> {
  score: number;
}

export interface Size {
  width: number;
  height: number;
}

export const HOVER_SCALE = 1.8;
const COLLIDE_GAP = 5;
const LINK_GAP = 24;
const PREVIEW_GAP = 14;
const OUTSIDE_PENALTY = 1e9;
const SELF_OVERLAP_WEIGHT = 10;
const GROWTH_RATE = 0.18;
const VELOCITY_DECAY = 0.32;

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function bubbleRadius(width: number): number {
  return clamp(width * 0.06, 26, 58);
}

export function layoutTargets(
  points: { x: number; y: number }[],
  { width, height }: Size,
  radius: number,
): { tx: number; ty: number }[] {
  const padding = radius * 1.6;
  const portrait = height > width;
  return points.map(({ x, y }) => {
    const across = portrait ? y : x;
    const down = portrait ? x : 1 - y;
    return {
      tx: padding + across * (width - 2 * padding),
      ty: padding + down * (height - 2 * padding),
    };
  });
}

export function relatedScores(
  slug: string,
  links: StoryMapLink[],
): Map<string, number> {
  return new Map(
    links.flatMap(({ source, target, score }): [string, number][] => {
      if (source === slug) return [[target, score]];
      if (target === slug) return [[source, score]];
      return [];
    }),
  );
}

export function threadEndpoints(
  from: { x: number; y: number; r: number },
  to: { x: number; y: number; r: number },
): { x1: number; y1: number; x2: number; y2: number } {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  return {
    x1: from.x + (dx / length) * from.r,
    y1: from.y + (dy / length) * from.r,
    x2: to.x - (dx / length) * to.r,
    y2: to.y - (dy / length) * to.r,
  };
}

export const threadWidth = scaleLinear([0, 0.8], [1.5, 9]).clamp(true);
export const threadOpacity = scaleLinear([0, 0.8], [0.3, 0.95]).clamp(true);

function overlapArea(
  left: number,
  top: number,
  card: Size,
  circle: { x: number; y: number; r: number },
): number {
  const overlapX =
    Math.min(left + card.width, circle.x + circle.r) -
    Math.max(left, circle.x - circle.r);
  const overlapY =
    Math.min(top + card.height, circle.y + circle.r) -
    Math.max(top, circle.y - circle.r);
  return Math.max(0, overlapX) * Math.max(0, overlapY);
}

export function placePreview(
  active: { x: number; y: number; r: number },
  relatives: { x: number; y: number; r: number }[],
  card: Size,
  stage: Size,
): { left: number; top: number } {
  const clampLeft = (left: number) =>
    clamp(left, 0, Math.max(0, stage.width - card.width));
  const clampTop = (top: number) =>
    clamp(top, 0, Math.max(0, stage.height - card.height));
  const candidates = [
    {
      left: active.x + active.r + PREVIEW_GAP,
      top: clampTop(active.y - card.height / 2),
    },
    {
      left: active.x - active.r - PREVIEW_GAP - card.width,
      top: clampTop(active.y - card.height / 2),
    },
    {
      left: clampLeft(active.x - card.width / 2),
      top: active.y - active.r - PREVIEW_GAP - card.height,
    },
    {
      left: clampLeft(active.x - card.width / 2),
      top: active.y + active.r + PREVIEW_GAP,
    },
  ];
  const cost = ({ left, top }: { left: number; top: number }) => {
    const outside =
      left < 0 ||
      top < 0 ||
      left + card.width > stage.width ||
      top + card.height > stage.height;
    return (
      (outside ? OUTSIDE_PENALTY : 0) +
      overlapArea(left, top, card, active) * SELF_OVERLAP_WEIGHT +
      relatives.reduce(
        (sum, circle) => sum + overlapArea(left, top, card, circle),
        0,
      )
    );
  };
  return candidates.reduce((best, candidate) =>
    cost(candidate) < cost(best) ? candidate : best,
  );
}

export function createBubbleSimulation(
  nodes: BubbleNode[],
  links: StoryMapLink[],
  stage: Size,
  random: () => number,
): Simulation<BubbleNode, BubbleLink> {
  const collide = forceCollide<BubbleNode>()
    .radius((node) => node.r + COLLIDE_GAP)
    .strength(0.9)
    .iterations(2);
  const link = forceLink<BubbleNode, BubbleLink>(
    links.map(({ source, target, score }) => ({ source, target, score })),
  )
    .id((node) => node.slug)
    .distance(
      (edge) =>
        (edge.source as BubbleNode).r +
        (edge.target as BubbleNode).r +
        LINK_GAP,
    )
    .strength((edge) => 0.02 + 0.35 * Math.max(0, edge.score));

  const grow = () => {
    for (const node of nodes) {
      node.r += (node.targetR - node.r) * GROWTH_RATE;
    }
    collide.radius((node) => node.r + COLLIDE_GAP);
    link.distance(
      (edge) =>
        (edge.source as BubbleNode).r +
        (edge.target as BubbleNode).r +
        LINK_GAP,
    );
  };

  const keepInside = (
    position: number,
    velocity: number,
    r: number,
    extent: number,
  ) => {
    const inside = clamp(position, r, extent - r);
    const next = inside + velocity * (1 - VELOCITY_DECAY);
    const bounded = clamp(next, r, extent - r);
    return {
      position: inside,
      velocity: (bounded - inside) / (1 - VELOCITY_DECAY),
    };
  };

  const contain = () => {
    for (const node of nodes) {
      const horizontal = keepInside(node.x, node.vx, node.r, stage.width);
      const vertical = keepInside(node.y, node.vy, node.r, stage.height);
      node.x = horizontal.position;
      node.vx = horizontal.velocity;
      node.y = vertical.position;
      node.vy = vertical.velocity;
    }
  };

  return forceSimulation<BubbleNode, BubbleLink>(nodes)
    .randomSource(random)
    .force("grow", grow)
    .force("x", forceX<BubbleNode>((node) => node.tx).strength(0.09))
    .force("y", forceY<BubbleNode>((node) => node.ty).strength(0.09))
    .force("collide", collide)
    .force("link", link)
    .force("contain", contain)
    .alphaDecay(0.02)
    .velocityDecay(VELOCITY_DECAY);
}
