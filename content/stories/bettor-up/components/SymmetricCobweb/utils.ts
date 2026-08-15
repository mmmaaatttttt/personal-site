/**
 * Symmetric teaching case: f(probability) = 1 / (1 + exp(-responseStrength*(probability - 0.5))).
 * Always has a fixed point at probability = 0.5, with slope responseStrength/4
 * there. Pitchfork bifurcation at responseStrength = 4.
 */
export function symmetricMap(
  probability: number,
  responseStrength: number,
): number {
  return 1 / (1 + Math.exp(-responseStrength * (probability - 0.5)));
}

export function symmetricMapPrime(
  probability: number,
  responseStrength: number,
): number {
  const sigmoidValue = symmetricMap(probability, responseStrength);
  return responseStrength * sigmoidValue * (1 - sigmoidValue);
}
