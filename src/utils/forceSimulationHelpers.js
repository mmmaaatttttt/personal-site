import { select } from "d3-selection";
import { forceSimulation } from "d3-force";
import { forceBounce } from "d3-force-bounce";
import { forceSurface } from "d3-force-surface";
import { darken } from "polished";

function initializeSimulation(width, height, handleCollision = null) {
  const bounceForce = forceBounce().radius(node => node.r);
  if (handleCollision) bounceForce.onImpact(handleCollision);
  return forceSimulation()
    .alphaDecay(0)
    .velocityDecay(0)
    .force("bounce", bounceForce)
    .force(
      "surface",
      forceSurface()
        .surfaces([
          {
            from: { x: 0, y: 0 },
            to: { x: 0, y: height }
          },
          {
            from: { x: 0, y: height },
            to: { x: width, y: height }
          },
          {
            from: { x: width, y: height },
            to: { x: width, y: 0 }
          },
          {
            from: { x: width, y: 0 },
            to: { x: 0, y: 0 }
          }
        ])
        .oneWay(true)
        .radius(node => node.r)
    );
}

const generateSimulationNodes = (simulation, nodeData, velocity, r = 15) => {
  const { cos, sin, PI, random } = Math;
  const currentNodes = simulation.nodes();
  const { x: width, y: height } = simulation.force("surface").surfaces()[1].to;
  if (!Array.isArray(nodeData))
    nodeData = Array.from({ length: nodeData }, (_, i) => ({ key: i }));
  const existingNodes = [];
  const newNodes = [];
  nodeData.forEach(node => {
    const currentNode = currentNodes.find(n => n.key === node.key);
    if (currentNode) existingNodes.push({ ...currentNode, ...node });
    else newNodes.push(node);
  });
  newNodes.forEach(node => {
    const theta = 2 * PI * random();
    const vx = velocity * cos(theta);
    const vy = velocity * sin(theta);
    let x, y;
    // ensure that nodes don't intersect
    // not optimal, but there aren't many nodes
    do {
      x = random() * (width - 2 * r) + r;
      y = random() * (height - 2 * r) + r;
    } while (
      existingNodes.some(
        node => (node.x - x) ** 2 + (node.y - y) ** 2 < (3 * r) ** 2
      )
    );
    existingNodes.push({ ...node, x, y, vx, vy, r });
  });
  simulation.nodes(existingNodes);
};

const updateSimulationNodes = (
  simulation,
  circleGp,
  colorFn,
  isMoving = true
) => {
  simulation.nodes().forEach(node => {
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

  const { x: width, y: height } = simulation.force("surface").surfaces()[1].to;
  const nodes = select(circleGp)
    .selectAll("circle.node")
    .data(
      simulation.nodes().map(node => {
        const { max, min } = Math;
        node.x = max(node.r, min(width - node.r, node.x));
        node.y = max(node.r, min(height - node.r, node.y));
        return node;
      }),
      d => d.key
    );
  nodes.exit().remove();

  const enterNodes = nodes
    .enter()
    .append("circle")
    .classed("node", true)
    .attr("r", d => d.r);

  const nodesToUpdate = isMoving ? enterNodes.merge(nodes) : enterNodes;

  nodesToUpdate
    .attr("fill", colorFn)
    .attr("stroke", d => darken(0.3, colorFn(d)))
    .attr("stroke-width", 2)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
};

export { initializeSimulation, generateSimulationNodes, updateSimulationNodes };
