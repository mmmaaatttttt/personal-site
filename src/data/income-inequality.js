import { euclideanDistance } from "../utils/mathHelpers";

const normalCollision = (speeds, node1, node2, velocityMultiplier) => {
  const newSpeeds = [...speeds];
  newSpeeds[node1.i] =
    euclideanDistance(node1.vx, node1.vy) / velocityMultiplier;
  newSpeeds[node2.i] =
    euclideanDistance(node2.vx, node2.vy) / velocityMultiplier;
  return newSpeeds;
};

const updateSpeeds = [normalCollision];

export default updateSpeeds;
