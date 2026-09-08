"use client";

import type { FC } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import COLORS from "@/utils/styles";
import type { TierWeights } from "../../../utils";
import { DEFAULT_TIER_WEIGHTS } from "../constants";
import { pointToWeights, weightsToPoint } from "./barycentric";
import {
  HEIGHT,
  MARKER_ARM,
  POINT_RADIUS,
  VERTEX_BLACK,
  VERTEX_GOLD,
  VERTEX_SILVER,
  WIDTH,
} from "./constants";

interface TernaryPlotProps {
  value: TierWeights;
  onChange: (weights: TierWeights) => void;
  referenceValue?: TierWeights;
}

const TernaryPlot: FC<TernaryPlotProps> = ({
  value,
  onChange,
  referenceValue,
}) => {
  const point = weightsToPoint(value, VERTEX_BLACK, VERTEX_SILVER, VERTEX_GOLD);
  const referencePoint = referenceValue
    ? weightsToPoint(referenceValue, VERTEX_BLACK, VERTEX_SILVER, VERTEX_GOLD)
    : null;

  const trianglePoints = [VERTEX_GOLD, VERTEX_BLACK, VERTEX_SILVER]
    .map((vertex) => `${vertex.x},${vertex.y}`)
    .join(" ");

  // Not the geometric center -- tiers aren't equal-sized.
  const uniformPoint = weightsToPoint(
    DEFAULT_TIER_WEIGHTS,
    VERTEX_BLACK,
    VERTEX_SILVER,
    VERTEX_GOLD,
  );
  const snapTargets: TierWeights[] = referenceValue
    ? [DEFAULT_TIER_WEIGHTS, referenceValue]
    : [DEFAULT_TIER_WEIGHTS];

  return (
    <ClippedSVG id="tier-ternary-plot" width={WIDTH} height={HEIGHT}>
      <polygon
        points={trianglePoints}
        fill="none"
        stroke={COLORS.DARK_GRAY}
        strokeWidth={1.5}
      />
      <text
        x={VERTEX_GOLD.x}
        y={VERTEX_GOLD.y - 8}
        textAnchor="middle"
        fontSize={12}
        fontWeight="bold"
        fill={COLORS.DARK_GRAY}
      >
        {`Gold: ${(value.gold * 100).toFixed(1)}%`}
      </text>
      <text
        x={VERTEX_BLACK.x}
        y={VERTEX_BLACK.y + 18}
        textAnchor="start"
        fontSize={12}
        fontWeight="bold"
        fill={COLORS.DARK_GRAY}
      >
        {`Black: ${(value.black * 100).toFixed(1)}%`}
      </text>
      <text
        x={VERTEX_SILVER.x}
        y={VERTEX_SILVER.y + 18}
        textAnchor="end"
        fontSize={12}
        fontWeight="bold"
        fill={COLORS.DARK_GRAY}
      >
        {`Silver: ${(value.silver * 100).toFixed(1)}%`}
      </text>
      <line
        x1={uniformPoint.x - MARKER_ARM}
        y1={uniformPoint.y}
        x2={uniformPoint.x + MARKER_ARM}
        y2={uniformPoint.y}
        stroke={COLORS.GRAY}
        strokeWidth={1}
      />
      <line
        x1={uniformPoint.x}
        y1={uniformPoint.y - MARKER_ARM}
        x2={uniformPoint.x}
        y2={uniformPoint.y + MARKER_ARM}
        stroke={COLORS.GRAY}
        strokeWidth={1}
      />
      {referencePoint && (
        <>
          <line
            x1={referencePoint.x - MARKER_ARM}
            y1={referencePoint.y - MARKER_ARM}
            x2={referencePoint.x + MARKER_ARM}
            y2={referencePoint.y + MARKER_ARM}
            stroke={COLORS.GRAY}
            strokeWidth={1}
          />
          <line
            x1={referencePoint.x - MARKER_ARM}
            y1={referencePoint.y + MARKER_ARM}
            x2={referencePoint.x + MARKER_ARM}
            y2={referencePoint.y - MARKER_ARM}
            stroke={COLORS.GRAY}
            strokeWidth={1}
          />
        </>
      )}
      <DraggableCircle
        id={0}
        cx={point.x}
        cy={point.y}
        r={POINT_RADIUS}
        fill={COLORS.RED}
        onDrag={(_id, coords) =>
          onChange(
            pointToWeights(
              coords,
              VERTEX_BLACK,
              VERTEX_SILVER,
              VERTEX_GOLD,
              snapTargets,
            ),
          )
        }
      />
    </ClippedSVG>
  );
};

export default TernaryPlot;
