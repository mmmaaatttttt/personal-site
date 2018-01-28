import { euclideanDistance } from "../utils/mathHelpers";

const normalCollision = (speeds, multiplier, savingsRate, nodes) =>
  _handleCollision(
    speeds,
    multiplier,
    savingsRate,
    nodes,
    _updateHandlerNormal
  );

const collisionMaximizedByLeastWealth = (
  speeds,
  multiplier,
  savingsRate,
  nodes
) =>
  _handleCollision(
    speeds,
    multiplier,
    savingsRate,
    nodes,
    _updateHandlerLeastWealth
  );

const _handleCollision = (
  speeds,
  multiplier,
  savingsRate,
  nodes,
  updateHandler
) => {
  const originalEnergies = nodes.map(node => speeds[node.i] ** 2);
  const newEnergies = nodes.map(
    node => (euclideanDistance(node.vx, node.vy) / multiplier) ** 2
  );

  // leave early if unpausing
  if (newEnergies[0] === 0 && newEnergies[1] === 0) return speeds;

  const epsilon = newEnergies[0] / (originalEnergies[0] + originalEnergies[1]);
  const updatedNewEnergies = updateHandler(
    epsilon,
    savingsRate,
    originalEnergies
  );
  const newSpeeds = [...speeds];
  nodes.forEach((node, idx) => {
    const scaleFactor = (updatedNewEnergies[idx] / newEnergies[idx]) ** (1 / 2);
    node.vx *= scaleFactor;
    node.vy *= scaleFactor;
    newSpeeds[node.i] = euclideanDistance(node.vx, node.vy) / multiplier;
  });
  return newSpeeds;
};

const _updateHandlerNormal = (eps, savingsRate, energies) => {
  if (Math.random() < 0.5) {
    const delta = (1 - savingsRate) * eps * energies[1];
    return [energies[0] + delta, energies[1] - delta];
  } else {
    const delta = (1 - savingsRate) * eps * energies[0];
    return [energies[0] - delta, energies[1] + delta];
  }
};

const _updateHandlerLeastWealth = (eps, savingsRate, energies) => {
  const delta = eps * Math.min(...energies);
  return Math.random() < 0.5
    ? [energies[0] + delta, energies[1] - delta]
    : [energies[0] - delta, energies[1] + delta];
};

const updateSpeeds = [
  normalCollision,
  collisionMaximizedByLeastWealth,
  normalCollision
];

export default updateSpeeds;
