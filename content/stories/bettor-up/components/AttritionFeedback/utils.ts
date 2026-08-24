function survivalTerms(
  publishedProbability: number,
  trueResponseRate: number,
  baselineCompletionResponder: number,
  baselineCompletionNonResponder: number,
  responderMarketCompletion: number,
  nonResponderMarketCompletion: number,
) {
  const responderMarketSurvival =
    publishedProbability +
    (1 - responderMarketCompletion) * (1 - publishedProbability);
  const responderSurvival =
    trueResponseRate * baselineCompletionResponder * responderMarketSurvival;
  const responderSurvivalPrime =
    trueResponseRate * baselineCompletionResponder * responderMarketCompletion;

  const nonResponderMarketSurvival =
    publishedProbability +
    (1 - nonResponderMarketCompletion) * (1 - publishedProbability);
  const nonResponderSurvival =
    (1 - trueResponseRate) *
    baselineCompletionNonResponder *
    nonResponderMarketSurvival;
  const nonResponderSurvivalPrime =
    (1 - trueResponseRate) *
    baselineCompletionNonResponder *
    nonResponderMarketCompletion;

  return {
    responderSurvival,
    responderSurvivalPrime,
    nonResponderSurvival,
    nonResponderSurvivalPrime,
  };
}

export function observedResponseRate(
  publishedProbability: number,
  trueResponseRate: number,
  baselineCompletionResponder: number,
  baselineCompletionNonResponder: number,
  responderMarketCompletion: number,
  nonResponderMarketCompletion: number,
): number {
  const {
    responderSurvival,
    responderSurvivalPrime,
    nonResponderSurvival,
    nonResponderSurvivalPrime,
  } = survivalTerms(
    publishedProbability,
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
    responderMarketCompletion,
    nonResponderMarketCompletion,
  );
  const denominator = responderSurvival + nonResponderSurvival;
  if (denominator === 0) {
    return (
      responderSurvivalPrime /
      (responderSurvivalPrime + nonResponderSurvivalPrime)
    );
  }
  return responderSurvival / denominator;
}

export function observedResponseRatePrime(
  publishedProbability: number,
  trueResponseRate: number,
  baselineCompletionResponder: number,
  baselineCompletionNonResponder: number,
  responderMarketCompletion: number,
  nonResponderMarketCompletion: number,
): number {
  const {
    responderSurvival,
    responderSurvivalPrime,
    nonResponderSurvival,
    nonResponderSurvivalPrime,
  } = survivalTerms(
    publishedProbability,
    trueResponseRate,
    baselineCompletionResponder,
    baselineCompletionNonResponder,
    responderMarketCompletion,
    nonResponderMarketCompletion,
  );
  const denominator = responderSurvival + nonResponderSurvival;
  if (denominator === 0) {
    return 0; // flat to first order at this discontinuity
  }
  return (
    (responderSurvivalPrime * nonResponderSurvival -
      responderSurvival * nonResponderSurvivalPrime) /
    (denominator * denominator)
  );
}

export function partialAdjustment(
  target: number,
  current: number,
  adjustmentSpeed: number,
): number {
  return adjustmentSpeed * target + (1 - adjustmentSpeed) * current;
}

export function partialAdjustmentPrime(
  targetPrime: number,
  adjustmentSpeed: number,
): number {
  return adjustmentSpeed * targetPrime + (1 - adjustmentSpeed);
}
