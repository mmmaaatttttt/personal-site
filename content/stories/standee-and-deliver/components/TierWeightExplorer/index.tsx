"use client";

import { scaleLinear } from "d3-scale";
import { type FC, useMemo, useState } from "react";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import TooltipMarker from "@/components/story/shared/TooltipMarker";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { characterNames, standees } from "../../data";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_NUM_STANDEES,
  DEFAULT_RANDOM_COST,
  GUARANTEED_MULTIPLIER_KEY,
  MAX_GUARANTEED_MULTIPLIER,
  MAX_NUM_STANDEES,
  MAX_RANDOM_COST,
  MIN_GUARANTEED_MULTIPLIER,
  MIN_NUM_STANDEES,
  MIN_RANDOM_COST,
  NUM_STANDEES_KEY,
  RANDOM_COST_KEY,
} from "../../sliderStore";
import type { StandeeInteractiveProps } from "../../types";
import { expectedCost } from "../../utils";
import {
  DEFAULT_TIER_WEIGHTS,
  GRAPH_PADDING,
  HEIGHT,
  REAL_OBSERVED_TIER_WEIGHTS,
  WIDTH,
} from "./constants";
import TernaryPlot from "./TernaryPlot";
import {
  expectedWeightedRandomDrawsByCount,
  findMinimumPoint,
  hasUniformOdds,
  tierCountsForCollectionSize,
} from "./utils";

const CHARACTER_POSE_CYCLE = standees
  .slice(0, standees.length / characterNames.length)
  .map((standee) => standee.pose);

const TierWeightExplorer: FC<StandeeInteractiveProps> = ({
  numStandees: initialNumStandees = DEFAULT_NUM_STANDEES,
}) => {
  const { values, sliderData } = useSliders([
    {
      key: "numStandees",
      initialValue: initialNumStandees,
      storageKey: NUM_STANDEES_KEY,
      min: MIN_NUM_STANDEES,
      max: MAX_NUM_STANDEES,
      step: 1,
      title: (val: number) => `Number of Standees: ${val}`,
      color: COLORS.ORANGE,
    },
    {
      key: "randomCost",
      initialValue: DEFAULT_RANDOM_COST,
      storageKey: RANDOM_COST_KEY,
      min: MIN_RANDOM_COST,
      max: MAX_RANDOM_COST,
      step: 1,
      title: (val: number) =>
        `Random Cost per Standee: ${val} coin${val !== 1 ? "s" : ""}`,
      color: COLORS.BLUE,
    },
    {
      key: "guaranteedMultiplier",
      initialValue: DEFAULT_GUARANTEED_MULTIPLIER,
      storageKey: GUARANTEED_MULTIPLIER_KEY,
      min: MIN_GUARANTEED_MULTIPLIER,
      max: MAX_GUARANTEED_MULTIPLIER,
      step: 1,
      title: (val: number) =>
        `Guaranteed Cost Per Standee: ${val}x Random Cost`,
      color: COLORS.MAROON,
    },
  ]);
  const [numStandees, randomCost, guaranteedMultiplier] = values;
  const [tierWeights, setTierWeights] = useState(DEFAULT_TIER_WEIGHTS);
  const guaranteedCost = randomCost * guaranteedMultiplier;
  const { tooltip, showTooltip, showTooltipAt, hideTooltip } = useTooltip();

  const tierCounts = useMemo(
    () => tierCountsForCollectionSize(numStandees, CHARACTER_POSE_CYCLE),
    [numStandees],
  );

  const { weightedData, uniformData, weightedMinimum, uniformMinimum } =
    useMemo(() => {
      const uniformData = Array.from(
        { length: numStandees + 1 },
        (_, switchPoint) => ({
          x: switchPoint,
          y: expectedCost(numStandees, switchPoint, randomCost, guaranteedCost),
        }),
      );

      const weightedData = hasUniformOdds(tierCounts, tierWeights)
        ? uniformData
        : expectedWeightedRandomDrawsByCount(tierCounts, tierWeights)
            .map((draws, switchPoint) => ({
              x: switchPoint,
              y:
                randomCost * draws +
                guaranteedCost * (numStandees - switchPoint),
            }))
            .filter((point) => Number.isFinite(point.y));

      return {
        weightedData,
        uniformData,
        weightedMinimum: findMinimumPoint(weightedData),
        uniformMinimum: findMinimumPoint(uniformData),
      };
    }, [numStandees, tierCounts, tierWeights, randomCost, guaranteedCost]);

  const xScale = scaleLinear()
    .domain([0, numStandees])
    .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

  const maxY = Math.max(
    ...weightedData.map((point) => point.y),
    ...uniformData.map((point) => point.y),
  );
  const yScale = scaleLinear()
    .domain([0, maxY * 1.1])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <NarrowContainer width="85%" fullWidthAt="sm">
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div className="w-[280px]">
          <TernaryPlot
            value={tierWeights}
            onChange={setTierWeights}
            referenceValue={REAL_OBSERVED_TIER_WEIGHTS}
          />
        </div>
        <div className="min-w-[240px] flex-1">
          <SliderGroup data={sliderData} />
        </div>
      </div>
      <Legend
        labels={[
          { text: "Uniform Odds (Exact)", color: COLORS.GREEN },
          { text: "Weighted Odds (Exact)", color: COLORS.DARK_BLUE },
        ]}
      />
      <Graph
        svgId="tier-weight-explorer"
        width={WIDTH}
        height={HEIGHT}
        graphPadding={GRAPH_PADDING}
        xScale={xScale}
        yScale={yScale}
        tickFormatX=","
        tickFormatY=","
        xLabel="Strategy Switch Point"
        yLabel="Expected Total Cost"
      >
        <LinePlot
          graphData={uniformData}
          curve="curveLinear"
          stroke={COLORS.GREEN}
        />
        <LinePlot
          graphData={weightedData}
          curve="curveLinear"
          stroke={COLORS.DARK_BLUE}
        />
        <TooltipMarker
          cx={xScale(uniformMinimum.x)}
          cy={yScale(uniformMinimum.y)}
          r={6}
          fill={COLORS.GREEN}
          body={`Switch after you have ${uniformMinimum.x} standees in your collection`}
          showTooltip={showTooltip}
          showTooltipAt={showTooltipAt}
          hideTooltip={hideTooltip}
        />
        <TooltipMarker
          cx={xScale(weightedMinimum.x)}
          cy={yScale(weightedMinimum.y)}
          r={6}
          fill={COLORS.DARK_BLUE}
          body={`Switch after you have ${weightedMinimum.x} standees in your collection`}
          showTooltip={showTooltip}
          showTooltipAt={showTooltipAt}
          hideTooltip={hideTooltip}
        />
      </Graph>
      <Tooltip info={tooltip} />
    </NarrowContainer>
  );
};

export default TierWeightExplorer;
