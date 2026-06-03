"use client";

import { scaleLinear } from "d3-scale";
import Caption from "@/components/story/shared/Caption";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import {
  DEFAULT_DEMAND_LOSS,
  DEFAULT_DIFFICULTY,
  DEFAULT_NUM_FIRMS,
  DEFAULT_SAVINGS,
  DEMAND_LOSS_KEY,
  DIFFICULTY_KEY,
  NUM_FIRMS_KEY,
  SAVINGS_KEY,
} from "../../sliderStore";
import VerticalMarker from "../VerticalMarker";
import { useWelfareChartData } from "./useWelfareChartData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 20 };
const MARKER_RADIUS = 6;
const N_MAX = 20;
const DEFAULT_REPLACEMENT_RATE = 0.3;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const BASE_SLIDER_CONFIG = [
  {
    min: 0.05,
    max: 0.95,
    initialValue: DEFAULT_SAVINGS,
    storageKey: SAVINGS_KEY,
    title: (val: number) =>
      `How much automation saves per task: ${Math.round(val * 100)}%`,
    color: COLORS.ORANGE,
  },
  {
    min: 0.05,
    max: 0.9,
    initialValue: DEFAULT_DEMAND_LOSS,
    storageKey: DEMAND_LOSS_KEY,
    title: (val: number) =>
      `Consumer spending lost per job cut: ${Math.round(val * 100)}%`,
    color: COLORS.BLUE,
  },
  {
    min: 0.2,
    max: 3,
    initialValue: DEFAULT_DIFFICULTY,
    storageKey: DIFFICULTY_KEY,
    title: (val: number) => `How hard it is to automate: ${val.toFixed(1)}`,
    color: COLORS.PURPLE,
  },
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_REPLACEMENT_RATE,
    title: (val: number) =>
      `Share of income replaced (benefits, retraining): ${Math.round(val * 100)}%`,
    color: COLORS.GREEN,
  },
];

const FIRMS_SLIDER = {
  min: 1,
  max: N_MAX,
  step: 1,
  initialValue: DEFAULT_NUM_FIRMS,
  storageKey: NUM_FIRMS_KEY,
  title: (val: number) => `Number of competing firms: ${Math.round(val)}`,
  color: COLORS.DARK_GRAY,
};

// numFirms is 4th (index 3), replacementRate is 5th (index 4)
const FULL_SLIDER_CONFIG = [
  BASE_SLIDER_CONFIG[0],
  BASE_SLIDER_CONFIG[1],
  BASE_SLIDER_CONFIG[2],
  FIRMS_SLIDER,
  BASE_SLIDER_CONFIG[3],
];

interface WelfareChartProps {
  caption?: string;
  numFirms?: number;
}

const WelfareChart = ({ caption, numFirms: fixedFirms }: WelfareChartProps) => {
  const { values, sliderData } = useSliders(
    fixedFirms !== undefined ? BASE_SLIDER_CONFIG : FULL_SLIDER_CONFIG,
  );

  const [savings, demandLoss, difficulty] = values;
  const numFirms =
    fixedFirms !== undefined ? fixedFirms : Math.round(values[3]);
  const replacementRate = fixedFirms !== undefined ? values[3] : values[4];

  const {
    ownerData,
    workerData,
    socialOptimum,
    marketOutcome,
    coOwnerProfit,
    neOwnerProfit,
    coWorkerIncome,
    neWorkerIncome,
    ownerPctLost,
    workerPctLost,
    showComparison,
    yMin,
    yMax,
    yPad,
  } = useWelfareChartData(
    savings,
    demandLoss,
    difficulty,
    replacementRate,
    numFirms,
  );

  const yScale = scaleLinear()
    .domain([yMin - yPad, yMax + yPad])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  const zeroY = yScale(0);
  const trapX = xScale(socialOptimum);
  const trapWidth = Math.max(0, xScale(marketOutcome) - xScale(socialOptimum));
  const trapY = GRAPH_PADDING.top;
  const trapHeight = HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  return (
    <Caption caption={caption}>
      <ColumnLayout break="sm">
        <div className="flex flex-col justify-center h-full">
          <SliderGroup data={sliderData} />
        </div>
        <div>
          <Legend
            labels={[
              { text: "Company profits", color: COLORS.ORANGE },
              { text: "Worker income", color: COLORS.BLUE },
              { text: "Coordinated outcome", color: COLORS.GREEN },
              { text: "Market outcome", color: COLORS.RED },
            ]}
          />
          <Graph
            graphPadding={GRAPH_PADDING}
            height={HEIGHT}
            width={WIDTH}
            svgId="welfare-chart"
            xScale={xScale}
            yScale={yScale}
            tickFormatX=".1f"
            tickFormatY=".2f"
            xLabel="Share of jobs automated"
            yLabel="Outcome"
            gridlinesVertical={false}
          >
            <rect
              x={trapX}
              y={trapY}
              width={trapWidth}
              height={trapHeight}
              fill={hexToRgba(COLORS.RED, 0.06)}
            />
            <line
              x1={GRAPH_PADDING.left}
              x2={WIDTH - GRAPH_PADDING.right}
              y1={zeroY}
              y2={zeroY}
              stroke={COLORS.GRAY}
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <LinePlot
              graphData={ownerData}
              stroke={COLORS.ORANGE}
              strokeWidth={3}
              curve="curveLinear"
            />
            <LinePlot
              graphData={workerData}
              stroke={COLORS.BLUE}
              strokeWidth={3}
              curve="curveLinear"
            />
            <circle
              cx={xScale(socialOptimum)}
              cy={yScale(coOwnerProfit)}
              r={MARKER_RADIUS}
              fill={COLORS.GREEN}
            />
            <circle
              cx={xScale(socialOptimum)}
              cy={yScale(coWorkerIncome)}
              r={MARKER_RADIUS}
              fill={COLORS.GREEN}
            />
            <circle
              cx={xScale(marketOutcome)}
              cy={yScale(neOwnerProfit)}
              r={MARKER_RADIUS}
              fill={COLORS.RED}
            />
            <circle
              cx={xScale(marketOutcome)}
              cy={yScale(neWorkerIncome)}
              r={MARKER_RADIUS}
              fill={COLORS.RED}
            />
            <VerticalMarker
              x={socialOptimum}
              color={COLORS.GREEN}
              label="Coordinated"
            />
            <VerticalMarker
              x={marketOutcome}
              color={COLORS.RED}
              label="Market"
            />
          </Graph>
          {showComparison && (
            <p className="mt-4 text-sm text-center font-medium text-gray-700">
              At the market outcome, companies earn{" "}
              <span style={{ color: COLORS.RED }}>
                {ownerPctLost}% less profit
              </span>{" "}
              and workers keep{" "}
              <span style={{ color: COLORS.RED }}>
                {workerPctLost}% less income
              </span>{" "}
              than if firms had coordinated.
            </p>
          )}
        </div>
      </ColumnLayout>
    </Caption>
  );
};

export default WelfareChart;
