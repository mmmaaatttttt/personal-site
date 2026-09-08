import type { Point } from "@/types/geometry";
import { clamp } from "@/utils/mathHelpers";
import type { TierWeights } from "../../../utils";
import { MIN_TIER_WEIGHT, SNAP_RADIUS } from "./constants";

export function weightsToPoint(
  weights: TierWeights,
  blackVertex: Point,
  silverVertex: Point,
  goldVertex: Point,
): Point {
  return {
    x:
      weights.black * blackVertex.x +
      weights.silver * silverVertex.x +
      weights.gold * goldVertex.x,
    y:
      weights.black * blackVertex.y +
      weights.silver * silverVertex.y +
      weights.gold * goldVertex.y,
  };
}

function clampToSimplex(
  black: number,
  silver: number,
  gold: number,
): TierWeights {
  const clampedBlack = Math.max(MIN_TIER_WEIGHT, black);
  const clampedSilver = Math.max(MIN_TIER_WEIGHT, silver);
  const clampedGold = Math.max(MIN_TIER_WEIGHT, gold);
  const total = clampedBlack + clampedSilver + clampedGold;
  return {
    black: clampedBlack / total,
    silver: clampedSilver / total,
    gold: clampedGold / total,
  };
}

function barycentricCoordinates(
  point: Point,
  blackVertex: Point,
  silverVertex: Point,
  goldVertex: Point,
): TierWeights {
  const blackToSilver = {
    x: silverVertex.x - blackVertex.x,
    y: silverVertex.y - blackVertex.y,
  };
  const blackToGold = {
    x: goldVertex.x - blackVertex.x,
    y: goldVertex.y - blackVertex.y,
  };
  const blackToPoint = {
    x: point.x - blackVertex.x,
    y: point.y - blackVertex.y,
  };

  const blackToSilverLengthSquared =
    blackToSilver.x * blackToSilver.x + blackToSilver.y * blackToSilver.y;
  const blackToSilverDotBlackToGold =
    blackToSilver.x * blackToGold.x + blackToSilver.y * blackToGold.y;
  const blackToGoldLengthSquared =
    blackToGold.x * blackToGold.x + blackToGold.y * blackToGold.y;
  const blackToPointDotBlackToSilver =
    blackToPoint.x * blackToSilver.x + blackToPoint.y * blackToSilver.y;
  const blackToPointDotBlackToGold =
    blackToPoint.x * blackToGold.x + blackToPoint.y * blackToGold.y;

  const denominator =
    blackToSilverLengthSquared * blackToGoldLengthSquared -
    blackToSilverDotBlackToGold * blackToSilverDotBlackToGold;
  const silver =
    (blackToGoldLengthSquared * blackToPointDotBlackToSilver -
      blackToSilverDotBlackToGold * blackToPointDotBlackToGold) /
    denominator;
  const gold =
    (blackToSilverLengthSquared * blackToPointDotBlackToGold -
      blackToSilverDotBlackToGold * blackToPointDotBlackToSilver) /
    denominator;
  const black = 1 - silver - gold;

  return { black, silver, gold };
}

function closestPointOnSegment(
  point: Point,
  segmentStart: Point,
  segmentEnd: Point,
): Point {
  const segmentX = segmentEnd.x - segmentStart.x;
  const segmentY = segmentEnd.y - segmentStart.y;
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;
  const projectionFraction = clamp(
    ((point.x - segmentStart.x) * segmentX +
      (point.y - segmentStart.y) * segmentY) /
      segmentLengthSquared,
    0,
    1,
  );
  return {
    x: segmentStart.x + projectionFraction * segmentX,
    y: segmentStart.y + projectionFraction * segmentY,
  };
}

function squaredDistance(pointA: Point, pointB: Point): number {
  return (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
}

function closestPointInTriangle(
  point: Point,
  blackVertex: Point,
  silverVertex: Point,
  goldVertex: Point,
): Point {
  const candidates = [
    closestPointOnSegment(point, blackVertex, silverVertex),
    closestPointOnSegment(point, silverVertex, goldVertex),
    closestPointOnSegment(point, goldVertex, blackVertex),
  ];
  return candidates.reduce((closest, candidate) =>
    squaredDistance(candidate, point) < squaredDistance(closest, point)
      ? candidate
      : closest,
  );
}

export function pointToWeights(
  point: Point,
  blackVertex: Point,
  silverVertex: Point,
  goldVertex: Point,
  snapTargets: TierWeights[] = [],
): TierWeights {
  for (const target of snapTargets) {
    const targetPoint = weightsToPoint(
      target,
      blackVertex,
      silverVertex,
      goldVertex,
    );
    if (squaredDistance(point, targetPoint) <= SNAP_RADIUS ** 2) {
      return target;
    }
  }

  const raw = barycentricCoordinates(
    point,
    blackVertex,
    silverVertex,
    goldVertex,
  );
  if (raw.black >= 0 && raw.silver >= 0 && raw.gold >= 0) {
    return clampToSimplex(raw.black, raw.silver, raw.gold);
  }

  const clampedPoint = closestPointInTriangle(
    point,
    blackVertex,
    silverVertex,
    goldVertex,
  );
  const clamped = barycentricCoordinates(
    clampedPoint,
    blackVertex,
    silverVertex,
    goldVertex,
  );
  return clampToSimplex(clamped.black, clamped.silver, clamped.gold);
}
