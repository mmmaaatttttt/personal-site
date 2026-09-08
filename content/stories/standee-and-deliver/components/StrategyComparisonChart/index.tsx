"use client";

import { scaleLinear } from "d3-scale";
import { type FC, useMemo } from "react";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
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
  SWITCH_POINT_KEY,
} from "../../sliderStore";
import type { StandeeInteractiveProps } from "../../types";
import { expectedCost } from "../../utils";
import { GRAPH_PADDING, HEIGHT, WIDTH } from "./constants";

const StrategyComparisonChart: FC<StandeeInteractiveProps> = ({
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
    {
      key: "switchPoint",
      initialValue: Math.round(initialNumStandees / 2),
      storageKey: SWITCH_POINT_KEY,
      min: 0,
      max: initialNumStandees,
      step: 1,
      title: (val: number) => `Strategy Switch Point: ${val}`,
      color: COLORS.GREEN,
    },
  ]);
  const [numStandees, randomCost, guaranteedMultiplier, rawSwitchPoint] =
    values;
  const guaranteedCost = randomCost * guaranteedMultiplier;
  const clampedSwitchPoint = Math.min(rawSwitchPoint, numStandees);

  const displaySliderData = sliderData.map((slider) =>
    slider.key === "switchPoint"
      ? { ...slider, value: clampedSwitchPoint, max: numStandees }
      : slider,
  );

  const graphData = useMemo(
    () =>
      Array.from({ length: numStandees + 1 }, (_, x) => ({
        x,
        y: expectedCost(numStandees, x, randomCost, guaranteedCost),
      })),
    [numStandees, randomCost, guaranteedCost],
  );

  const markerPoint = graphData[clampedSwitchPoint];

  const xScale = scaleLinear()
    .domain([0, numStandees])
    .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

  const maxY = Math.max(...graphData.map((point) => point.y));
  const yScale = scaleLinear()
    .domain([0, maxY * 1.1])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <NarrowContainer width="85%" fullWidthAt="sm">
      <SliderGroup data={displaySliderData} />
      <Graph
        svgId="strategy-comparison-chart"
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
          graphData={graphData}
          curve="curveLinear"
          stroke={COLORS.GREEN}
        />
        <circle
          cx={xScale(markerPoint.x)}
          cy={yScale(markerPoint.y)}
          r={6}
          fill={COLORS.RED}
        />
      </Graph>
    </NarrowContainer>
  );
};

export default StrategyComparisonChart;
