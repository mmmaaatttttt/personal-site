"use client";

import {
  forceSimulation,
  type Simulation,
  type SimulationNodeDatum,
} from "d3-force";
import forceBounce from "d3-force-bounce";
import forceSurface from "d3-force-surface";
import { select } from "d3-selection";
import { interval } from "d3-timer";
import { type FC, useEffect, useRef, useState } from "react";
import "d3-transition"; // For .transition()
import { easeCubicOut } from "d3-ease";

export interface HarassmentNode extends SimulationNodeDatum {
  key: string;
  properties: {
    color: string;
  };
  r: number;
  lastVx?: number | null;
  lastVy?: number | null;
}

interface HarassmentNodeGroupProps {
  width: number;
  height: number;
  greenCount: number;
  blueCount: number;
  playing: boolean;
  paused: boolean;
  initialV: number;
  handleShout: (key: string, shoutId: number) => void;
  blueOnBlueProb: number;
  greenOnGreenProb: number;
  blueOnGreenProb: number;
  greenOnBlueProb: number;
}

const COLORS = {
  BLUE: "#1E3A8A", // modern tailwind blue-900 or whatever legacy was. Legacy blue was 'blue' mostly, or a specific hex. Let's use blue-500 (#3B82F6) and green-500 (#22C55E)
  GREEN: "#22C55E",
  RED: "#EF4444",
};

const someNodesTouch = (
  nodes: HarassmentNode[],
  x: number,
  y: number,
  r: number,
) =>
  nodes.some(
    (node) =>
      node.x !== undefined &&
      node.y !== undefined &&
      (node.x - x) ** 2 + (node.y - y) ** 2 < (3 * r) ** 2,
  );

const HarassmentNodeGroup: FC<HarassmentNodeGroupProps> = ({
  width,
  height,
  greenCount,
  blueCount,
  playing,
  paused,
  initialV,
  handleShout,
  blueOnBlueProb,
  greenOnGreenProb,
  blueOnGreenProb,
  greenOnBlueProb,
}) => {
  const gRef = useRef<SVGGElement>(null);
  const simulationRef = useRef<Simulation<HarassmentNode, undefined> | null>(
    null,
  );
  const [shoutCount, setShoutCount] = useState(0);

  // We use refs to hold current values for the tick closure without causing re-renders
  const propsRef = useRef({
    blueOnBlueProb,
    greenOnGreenProb,
    blueOnGreenProb,
    greenOnBlueProb,
    playing,
    paused,
    handleShout,
  });
  const shoutCountRef = useRef(shoutCount);

  useEffect(() => {
    propsRef.current = {
      blueOnBlueProb,
      greenOnGreenProb,
      blueOnGreenProb,
      greenOnBlueProb,
      playing,
      paused,
      handleShout,
    };
  }, [
    blueOnBlueProb,
    greenOnGreenProb,
    blueOnGreenProb,
    greenOnBlueProb,
    playing,
    paused,
    handleShout,
  ]);

  useEffect(() => {
    shoutCountRef.current = shoutCount;
  }, [shoutCount]);

  useEffect(() => {
    if (!gRef.current) return;

    const generateWave = (node: HarassmentNode) => {
      const currentShoutCount = shoutCountRef.current;
      setShoutCount((prev) => prev + 1);

      const soundWave = interval(() => {
        const waveCount = 5;
        // @ts-expect-error
        soundWave.__calledCount = (soundWave.__calledCount || 0) + 1;
        // @ts-expect-error
        if (
          soundWave.__calledCount <= waveCount &&
          propsRef.current.playing &&
          !propsRef.current.paused
        ) {
          // @ts-expect-error
          const currentIdx = soundWave.__calledCount;

          select(gRef.current!)
            .insert("circle", "circle")
            .attr("cx", node.x!)
            .attr("cy", node.y!)
            .attr("r", node.r * 2)
            .attr("fill", COLORS.RED)
            .attr("fill-opacity", 0.75)
            .attr("stroke", COLORS.RED)
            .classed("shout", true)
            .datum({
              shoutCount: currentShoutCount,
              nodeKey: node.key,
              idx: currentIdx,
            })
            .transition()
            .duration(2000)
            .ease(Math.sqrt)
            .attr("r", node.r * 8)
            .style("stroke-opacity", 1e-6)
            .style("fill-opacity", 1e-6)
            .on("end", (d: { nodeKey: string; shoutCount: number }) => {
              const color = String(d.nodeKey).split("-")[0];
              const key =
                color === COLORS.BLUE
                  ? "blueShoutsHeardFromBlueOnly"
                  : "greenShoutsHeardFromGreenOnly";
              propsRef.current.handleShout(key, d.shoutCount);
            })
            .remove();
        } else {
          soundWave.stop();
        }
      }, 200);
    };

    const handleCollision = (node1: HarassmentNode, node2: HarassmentNode) => {
      if (propsRef.current.playing && !propsRef.current.paused) {
        const {
          blueOnBlueProb,
          greenOnGreenProb,
          blueOnGreenProb,
          greenOnBlueProb,
        } = propsRef.current;
        const probabilities: Record<string, [number, number]> = {
          [`${COLORS.BLUE}:${COLORS.BLUE}`]: [blueOnBlueProb, blueOnBlueProb],
          [`${COLORS.BLUE}:${COLORS.GREEN}`]: [
            blueOnGreenProb,
            greenOnBlueProb,
          ],
          [`${COLORS.GREEN}:${COLORS.BLUE}`]: [
            greenOnBlueProb,
            blueOnGreenProb,
          ],
          [`${COLORS.GREEN}:${COLORS.GREEN}`]: [
            greenOnGreenProb,
            greenOnGreenProb,
          ],
        };
        const nodeColors = [
          node1.properties.color,
          node2.properties.color,
        ].join(":");
        const probability = probabilities[nodeColors];

        [node1, node2].forEach((node, i) => {
          if (probability && Math.random() < probability[i]) {
            generateWave(node);
          }
        });
      }
    };

    const sim = forceSimulation<HarassmentNode>()
      .alphaDecay(0)
      .velocityDecay(0)
      .force(
        "bounce",
        forceBounce<HarassmentNode>()
          .radius((node: HarassmentNode) => node.r)
          .onImpact(handleCollision),
      )
      .force(
        "surface",
        forceSurface<HarassmentNode>()
          .surfaces([
            { from: { x: 0, y: 0 }, to: { x: 0, y: height } },
            { from: { x: 0, y: height }, to: { x: width, y: height } },
            { from: { x: width, y: height }, to: { x: width, y: 0 } },
            { from: { x: width, y: 0 }, to: { x: 0, y: 0 } },
          ])
          .oneWay(true)
          .radius((node: HarassmentNode) => node.r),
      );

    simulationRef.current = sim;

    return () => {
      sim.stop();
      if (gRef.current) {
        select(gRef.current).selectAll("*").remove();
      }
    };
  }, [width, height]);

  useEffect(() => {
    if (!simulationRef.current || !gRef.current) return;

    const sim = simulationRef.current;

    // Check intersections on tick
    const checkIntersections = () => {
      const gSelection = select(gRef.current!);
      const nodeSelection = gSelection.selectAll<
        SVGCircleElement,
        HarassmentNode
      >(".node");

      gSelection
        .selectAll<SVGCircleElement, { shoutCount: number; nodeKey: string }>(
          ".shout",
        )
        .each(function (d) {
          if (!d) return;
          const color = String(d.nodeKey).split("-")[0];
          const waveCircle = select(this);
          const waveX = +(waveCircle.attr("cx") || 0);
          const waveY = +(waveCircle.attr("cy") || 0);
          const waveR = +(waveCircle.attr("r") || 0);

          nodeSelection.each(function (nodeData) {
            const nodeColor = nodeData.properties.color;
            const { x, y, r } = nodeData;
            if (x === undefined || y === undefined) return;

            const distance = Math.hypot(x - waveX, y - waveY);
            if (nodeColor !== color && distance < r + waveR) {
              const node = select(this);
              // Quick red flash
              node
                .transition()
                .duration(0)
                .attr("fill", COLORS.RED)
                .transition()
                .duration(500)
                .ease(easeCubicOut)
                .attr("fill", nodeData.properties.color);

              const key =
                nodeColor === COLORS.BLUE
                  ? "blueShoutsHeardFromGreen"
                  : "greenShoutsHeardFromBlue";
              propsRef.current.handleShout(key, d.shoutCount);
            }
          });
        });
    };

    const tick = () => {
      const isMoving = propsRef.current.playing && !propsRef.current.paused;

      sim.nodes().forEach((node) => {
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

      const nodesSel = select(gRef.current!)
        .selectAll<SVGCircleElement, HarassmentNode>(".node")
        .data(
          sim.nodes().map((node) => {
            const { max, min } = Math;
            node.x = max(node.r, min(width - node.r, node.x || 0));
            node.y = max(node.r, min(height - node.r, node.y || 0));
            return node;
          }),
          (d) => d.key,
        );

      nodesSel.exit().remove();

      const enterNodes = nodesSel
        .enter()
        .append("circle")
        .classed("node", true)
        .attr("r", (d) => d.r)
        .attr("fill", (d) => d.properties.color)
        .attr("stroke", (d) => d.properties.color)
        .attr("stroke-width", 2);

      const nodesToUpdate = isMoving ? enterNodes.merge(nodesSel) : enterNodes;
      nodesToUpdate.attr("cx", (d) => d.x!).attr("cy", (d) => d.y!);

      if (isMoving) {
        checkIntersections();
      }
    };

    sim.on("tick", tick);

    // Generating nodes logic
    const colorBlue = COLORS.BLUE;
    const colorGreen = COLORS.GREEN;

    // We only reset nodes when playing toggles to start, or counts change
    const blueArr: HarassmentNode[] = Array.from(
      { length: blueCount },
      (_, i) => ({
        key: `${colorBlue}-${i}`,
        properties: { color: colorBlue },
        r: 15,
      }),
    );

    const greenArr: HarassmentNode[] = Array.from(
      { length: greenCount },
      (_, i) => ({
        key: `${colorGreen}-${i}`,
        properties: { color: colorGreen },
        r: 15,
      }),
    );

    const targetNodes = [...blueArr, ...greenArr];
    const currentNodes = sim.nodes();
    const existingNodes: HarassmentNode[] = [];
    const newNodes: HarassmentNode[] = [];

    targetNodes.forEach((node) => {
      const match = currentNodes.find((n) => n.key === node.key);
      if (match) {
        existingNodes.push({ ...match, ...node });
      } else {
        newNodes.push(node);
      }
    });

    const { cos, sin, PI, random } = Math;
    newNodes.forEach((node) => {
      const theta = 2 * PI * random();
      const vx = initialV * cos(theta);
      const vy = initialV * sin(theta);
      let x = 0,
        y = 0;
      do {
        x = random() * (width - 2 * node.r) + node.r;
        y = random() * (height - 2 * node.r) + node.r;
      } while (someNodesTouch(existingNodes, x, y, node.r));
      existingNodes.push({ ...node, x, y, vx, vy });
    });

    sim.nodes(existingNodes);

    if (playing && !paused) {
      sim.alpha(1).restart();
    } else {
      sim.stop();
      tick(); // Render at least once when paused/stopped
    }
  }, [blueCount, greenCount, playing, paused, initialV, height, width]);

  // Keep clearing shouts purely on reset (!playing)
  useEffect(() => {
    if (!playing) {
      select(gRef.current!).selectAll(".shout").remove();
      setShoutCount(0);
    }
  }, [playing]);

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="#d1d5db"
        strokeWidth={3}
        fill="none"
      />
      <g ref={gRef} />
    </g>
  );
};

export default HarassmentNodeGroup;
