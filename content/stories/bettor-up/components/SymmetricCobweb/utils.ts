// Always has a fixed point at 0.5, slope responseStrength/4 there —
// pitchfork bifurcation at responseStrength = 4.
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
