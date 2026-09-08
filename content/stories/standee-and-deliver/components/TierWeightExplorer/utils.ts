import type { Point } from "@/types/geometry";
import type { Tier, TierWeights } from "../../utils";
import { getTier } from "../../utils";

export type TierCounts = Record<Tier, number>;

export function findMinimumPoint(data: Point[]): Point {
  return data.reduce((min, point) => (point.y < min.y ? point : min), data[0]);
}

export function countStandeesByTier(poses: string[]): TierCounts {
  const counts: TierCounts = { black: 0, silver: 0, gold: 0 };
  for (const pose of poses) counts[getTier(pose)]++;
  return counts;
}

export function tierCountsForCollectionSize(
  numStandees: number,
  characterPoseCycle: string[],
): TierCounts {
  const nonStarterPoses: string[] = [];
  let cycleIndex = 0;
  while (nonStarterPoses.length < numStandees) {
    const positionInCharacter = cycleIndex % characterPoseCycle.length;
    if (positionInCharacter !== 0) {
      nonStarterPoses.push(characterPoseCycle[positionInCharacter]);
    }
    cycleIndex++;
  }
  return countStandeesByTier(nonStarterPoses);
}

const UNIFORM_ODDS_EPSILON = 1e-9;

export function hasUniformOdds(
  tierCounts: TierCounts,
  tierWeights: TierWeights,
): boolean {
  const pBlack = tierWeights.black / tierCounts.black;
  const pSilver = tierWeights.silver / tierCounts.silver;
  const pGold = tierWeights.gold / tierCounts.gold;
  return (
    Math.abs(pBlack - pSilver) < UNIFORM_ODDS_EPSILON &&
    Math.abs(pSilver - pGold) < UNIFORM_ODDS_EPSILON
  );
}

export function expectedWeightedRandomDrawsByCount(
  tierCounts: TierCounts,
  tierWeights: TierWeights,
): number[] {
  const { black: nBlack, silver: nSilver, gold: nGold } = tierCounts;
  const total = nBlack + nSilver + nGold;
  const pBlack = tierWeights.black / nBlack;
  const pSilver = tierWeights.silver / nSilver;
  const pGold = tierWeights.gold / nGold;

  const blackStride = (nSilver + 1) * (nGold + 1);
  const silverStride = nGold + 1;
  const size = (nBlack + 1) * blackStride;

  let current = new Float64Array(size);
  let next = new Float64Array(size);
  current[nBlack * blackStride + nSilver * silverStride + nGold] = 1;

  const cumulativeDraws = new Array<number>(total + 1).fill(0);
  let cumulative = 0;

  for (let level = total; level >= 1; level--) {
    next.fill(0);
    let drawsThisLevel = 0;

    const remainingBlackMin = Math.max(0, level - nSilver - nGold);
    const remainingBlackMax = Math.min(nBlack, level);
    for (
      let remainingBlack = remainingBlackMin;
      remainingBlack <= remainingBlackMax;
      remainingBlack++
    ) {
      const remainingSilverMin = Math.max(0, level - remainingBlack - nGold);
      const remainingSilverMax = Math.min(nSilver, level - remainingBlack);
      const blackOffset = remainingBlack * blackStride;
      for (
        let remainingSilver = remainingSilverMin;
        remainingSilver <= remainingSilverMax;
        remainingSilver++
      ) {
        const remainingGold = level - remainingBlack - remainingSilver;
        const stateIndex =
          blackOffset + remainingSilver * silverStride + remainingGold;
        const mass = current[stateIndex];
        if (mass === 0) continue;

        const drawSuccessProbability =
          remainingBlack * pBlack +
          remainingSilver * pSilver +
          remainingGold * pGold;
        if (drawSuccessProbability === 0) {
          drawsThisLevel = Number.POSITIVE_INFINITY;
          continue;
        }
        drawsThisLevel += mass / drawSuccessProbability;

        if (remainingBlack > 0) {
          next[
            blackOffset -
              blackStride +
              remainingSilver * silverStride +
              remainingGold
          ] += (mass * (remainingBlack * pBlack)) / drawSuccessProbability;
        }
        if (remainingSilver > 0) {
          next[stateIndex - silverStride] +=
            (mass * (remainingSilver * pSilver)) / drawSuccessProbability;
        }
        if (remainingGold > 0) {
          next[stateIndex - 1] +=
            (mass * (remainingGold * pGold)) / drawSuccessProbability;
        }
      }
    }

    cumulative += drawsThisLevel;
    cumulativeDraws[total - level + 1] = cumulative;
    [current, next] = [next, current];
  }

  return cumulativeDraws;
}
