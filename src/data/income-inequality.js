import { euclideanDistance } from "../utils/mathHelpers";

const normalCollision = (speeds, multiplier, nodes) => {
  const newSpeeds = [...speeds];
  nodes.forEach(node => {
    newSpeeds[node.i] = euclideanDistance(node.vx, node.vy) / multiplier;
  });
  return newSpeeds;
};

const collisionMaximizedByLeastWealth = (speeds, multiplier, nodes) => {
  const originalEnergies = nodes.map(node => speeds[node.i] ** 2);
  const newEnergies = nodes.map(
    node => (euclideanDistance(node.vx, node.vy) / multiplier) ** 2
  );

  // leave early if unpausing
  if (newEnergies[0] === 0 && newEnergies[1] === 0) return speeds;

  const epsilon = newEnergies[0] / (originalEnergies[0] + originalEnergies[1]);
  const newDelta = epsilon * Math.min(...originalEnergies);
  const updatedNewEnergies =
    Math.random() < 0.5
      ? [originalEnergies[0] + newDelta, originalEnergies[1] - newDelta]
      : [originalEnergies[0] - newDelta, originalEnergies[1] + newDelta];
  const newSpeeds = [...speeds];
  nodes.forEach((node, idx) => {
    const scaleFactor = (updatedNewEnergies[idx] / newEnergies[idx]) ** (1 / 2);
    node.vx *= scaleFactor;
    node.vy *= scaleFactor;
    newSpeeds[node.i] = euclideanDistance(node.vx, node.vy) / multiplier;
  });

  return newSpeeds;
};

const updateSpeeds = [normalCollision, collisionMaximizedByLeastWealth];

export default updateSpeeds;
