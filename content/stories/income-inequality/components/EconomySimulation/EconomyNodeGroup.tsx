"use client";

import { FC, useEffect, useRef } from "react";
import { select } from "d3-selection";
import { forceSimulation, Simulation } from "d3-force";
import { scaleLinear } from "d3-scale";
import forceBounce from "d3-force-bounce";
import forceSurface from "d3-force-surface";

import COLORS from "@/utils/styles";
import type { EconomyNode, CollisionFn } from "../../data";

/** Simple hex darkening — avoids a polished dependency */
function darkenHex(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

const NODE_RADIUS = 15;

interface EconomyNodeGroupProps {
  width: number;
  height: number;
  speeds: number[];
  playing: boolean;
  paused: boolean;
  velocityMultiplier: number;
  savingsRate: number;
  initialV: number;
  updateFn: CollisionFn;
  onSpeedsChange: (speeds: number[]) => void;
}

const someNodesTouch = (nodes: EconomyNode[], x: number, y: number, r: number) =>
  nodes.some(
    n =>
      n.x !== undefined &&
      n.y !== undefined &&
      (n.x - x) ** 2 + (n.y - y) ** 2 < (3 * r) ** 2
  );

const EconomyNodeGroup: FC<EconomyNodeGroupProps> = ({
  width,
  height,
  speeds,
  playing,
  paused,
  velocityMultiplier,
  savingsRate,
  initialV,
  updateFn,
  onSpeedsChange,
}) => {
  const gRef = useRef<SVGGElement>(null);
  const simRef = useRef<Simulation<EconomyNode, undefined> | null>(null);

  // Always-current snapshot of props for closures that can't close over changing values
  const stateRef = useRef({ speeds, playing, paused, velocityMultiplier, savingsRate, initialV, updateFn, onSpeedsChange });
  useEffect(() => {
    stateRef.current = { speeds, playing, paused, velocityMultiplier, savingsRate, initialV, updateFn, onSpeedsChange };
  });

  // drawRef lets population/reset effects render nodes immediately without restarting the sim
  const drawRef = useRef<(() => void) | null>(null);

  // Initialize simulation once per mount
  useEffect(() => {
    if (!gRef.current) return;

    const handleCollision = (node1: EconomyNode, node2: EconomyNode) => {
      if (!stateRef.current.playing || stateRef.current.paused) return;
      const { speeds, velocityMultiplier, savingsRate, updateFn, onSpeedsChange } = stateRef.current;
      const newSpeeds = updateFn(speeds, velocityMultiplier, savingsRate, [node1, node2]);
      onSpeedsChange(newSpeeds);
    };

    const sim = forceSimulation<EconomyNode>()
      .alphaDecay(0)
      .velocityDecay(0)
      .force(
        "bounce",
        forceBounce<EconomyNode>()
          .radius(() => NODE_RADIUS)
          .onImpact(handleCollision)
      )
      .force(
        "surface",
        forceSurface<EconomyNode>()
          .surfaces([
            { from: { x: 0, y: 0 }, to: { x: 0, y: height } },
            { from: { x: 0, y: height }, to: { x: width, y: height } },
            { from: { x: width, y: height }, to: { x: width, y: 0 } },
            { from: { x: width, y: 0 }, to: { x: 0, y: 0 } },
          ])
          .oneWay(true)
          .radius(() => NODE_RADIUS)
      );

    simRef.current = sim;

    const draw = () => {
      if (!gRef.current) return;
      const { playing, paused, speeds, velocityMultiplier, initialV } = stateRef.current;
      const isMoving = playing && !paused;

      sim.nodes().forEach(node => {
        if (isMoving) {
          node.fx = null;
          node.fy = null;
          node.vx = node.vx || node.lastVx || 0;
          node.vy = node.vy || node.lastVy || 0;
          node.lastVx = null;
          node.lastVy = null;
        } else {
          node.lastVx = node.lastVx || node.vx;
          node.lastVy = node.lastVy || node.vy;
          node.fx = node.x;
          node.fy = node.y;
        }
      });

      const scaledInitialSpeed = initialV * velocityMultiplier;
      const colorScale = scaleLinear<string>()
        .domain([0, scaledInitialSpeed, scaledInitialSpeed * 2])
        .range([COLORS.BLUE, COLORS.MAROON, COLORS.RED]);

      const nodesSel = select(gRef.current)
        .selectAll<SVGCircleElement, EconomyNode>(".node")
        .data(
          sim.nodes().map(node => {
            node.x = Math.max(NODE_RADIUS, Math.min(width - NODE_RADIUS, node.x ?? 0));
            node.y = Math.max(NODE_RADIUS, Math.min(height - NODE_RADIUS, node.y ?? 0));
            return node;
          }),
          d => d.key
        );

      nodesSel.exit().remove();

      const entered = nodesSel
        .enter()
        .append("circle")
        .classed("node", true)
        .attr("r", NODE_RADIUS);

      const toUpdate = isMoving ? entered.merge(nodesSel) : entered;

      toUpdate
        .attr("cx", d => d.x ?? 0)
        .attr("cy", d => d.y ?? 0)
        .attr("fill", d => {
          const speed = speeds[d.key] ?? 0;
          return colorScale(speed * velocityMultiplier);
        })
        .attr("stroke", d => {
          const speed = speeds[d.key] ?? 0;
          const fill = colorScale(speed * velocityMultiplier);
          return darkenHex(fill, 0.3);
        })
        .attr("stroke-width", 2);
    };

    drawRef.current = draw;
    sim.on("tick", draw);

    return () => {
      sim.stop();
      drawRef.current = null;
      if (gRef.current) select(gRef.current).selectAll("*").remove();
    };
  }, [width, height]); // eslint-disable-line react-hooks/exhaustive-deps

  // React to population count changes; draw once so circles are visible even before start
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;

    const count = speeds.length;
    const currentNodes = sim.nodes();

    if (currentNodes.length !== count) {
      const existingNodes: EconomyNode[] = [];
      const newNodes: EconomyNode[] = [];

      for (let i = 0; i < count; i++) {
        const match = currentNodes.find(n => n.key === i);
        if (match) {
          existingNodes.push(match);
        } else {
          newNodes.push({ key: i, r: NODE_RADIUS });
        }
      }

      const { cos, sin, PI, random } = Math;
      newNodes.forEach(node => {
        const theta = 2 * PI * random();
        const vx = initialV * velocityMultiplier * cos(theta);
        const vy = initialV * velocityMultiplier * sin(theta);
        let x = 0, y = 0;
        do {
          x = random() * (width - 2 * NODE_RADIUS) + NODE_RADIUS;
          y = random() * (height - 2 * NODE_RADIUS) + NODE_RADIUS;
        } while (someNodesTouch(existingNodes, x, y, NODE_RADIUS));
        existingNodes.push({ ...node, x, y, vx, vy });
      });

      sim.nodes(existingNodes);
      if (!playing) drawRef.current?.();
    }
  }, [speeds.length, width, height, initialV, velocityMultiplier]); // eslint-disable-line react-hooks/exhaustive-deps

  // React to playing/paused changes
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;

    if (playing && !paused) {
      sim.alpha(1).restart();
    } else {
      sim.stop();
    }
  }, [playing, paused]);

  // Rescale existing node velocities when multiplier changes
  const prevMultiplierRef = useRef(velocityMultiplier);
  useEffect(() => {
    const sim = simRef.current;
    if (!sim) return;
    const prev = prevMultiplierRef.current;
    if (prev === velocityMultiplier) return;
    sim.nodes().forEach(node => {
      (["vx", "vy", "lastVx", "lastVy"] as const).forEach(key => {
        const v = node[key];
        if (v) node[key] = (v * velocityMultiplier) / prev;
      });
    });
    prevMultiplierRef.current = velocityMultiplier;
  }, [velocityMultiplier]);

  // Reset: clear and reinitialize nodes, draw once so circles are visible at rest
  useEffect(() => {
    const sim = simRef.current;
    if (!sim || playing) return;

    if (gRef.current) select(gRef.current).selectAll("*").remove();

    const existingNodes: EconomyNode[] = [];
    const { cos, sin, PI, random } = Math;
    for (let i = 0; i < speeds.length; i++) {
      const theta = 2 * PI * random();
      const vx = initialV * cos(theta);
      const vy = initialV * sin(theta);
      let x = 0, y = 0;
      do {
        x = random() * (width - 2 * NODE_RADIUS) + NODE_RADIUS;
        y = random() * (height - 2 * NODE_RADIUS) + NODE_RADIUS;
      } while (someNodesTouch(existingNodes, x, y, NODE_RADIUS));
      existingNodes.push({ key: i, r: NODE_RADIUS, x, y, vx, vy });
    }
    sim.nodes(existingNodes);
    drawRef.current?.();
  }, [playing]); // eslint-disable-line react-hooks/exhaustive-deps

  return <g ref={gRef} />;
};

export default EconomyNodeGroup;
