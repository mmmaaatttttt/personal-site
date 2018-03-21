import { forceSimulation } from "d3-force";
import { forceBounce } from "d3-force-bounce";
import { forceSurface } from "d3-force-surface";

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

const generateSimulationNodes = (simulation, nodeCount, velocity, r = 15) => {
  const { cos, sin, PI, random } = Math;
  const currentNodes = simulation.nodes();
  const { x: width, y: height } = simulation.force("surface").surfaces()[1].to;
  const newNodes = currentNodes.slice(0, nodeCount);
  while (newNodes.length < nodeCount) {
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
      newNodes.some(
        node => (node.x - x) ** 2 + (node.y - y) ** 2 < (3 * r) ** 2
      )
    );
    const node = { i: newNodes.length, x, y, vx, vy, r };
    newNodes.push(node);
  }
  simulation.nodes(newNodes);
};

export { initializeSimulation, generateSimulationNodes };
