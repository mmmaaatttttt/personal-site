"use client";

import { scaleLinear } from "d3-scale";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
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
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 80 };
const AXIS_FONT = "11px";
const MARKER_RADIUS = 6;
const N_MAX = 20;
const DEFAULT_REPLACEMENT_RATE = 0.3;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const workerYScale = scaleLinear()
  .domain([0, 1])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const BASE_SLIDER_CONFIG = [
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_SAVINGS,
    storageKey: SAVINGS_KEY,
    title: (val: number) =>
      `How much automation saves per task: ${Math.round(val * 100)}%`,
    color: COLORS.ORANGE,
  },
  {
    min: 0,
    max: 1,
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
            axes={false}
            graphPadding={GRAPH_PADDING}
            height={HEIGHT}
            width={WIDTH}
            svgId="welfare-chart"
            xScale={xScale}
            yScale={yScale}
            gridlinesVertical={false}
          >
            <Axis
              key="y-axis"
              direction="y"
              scale={yScale}
              tickFormat=".2f"
              tickSize={5}
              tickColor={COLORS.GRAY}
              color={COLORS.ORANGE}
              fontSize={AXIS_FONT}
            />
            <Axis
              key="x-axis"
              direction="x"
              scale={xScale}
              tickFormat=".1f"
              rotateLabels={false}
              textAnchor="middle"
              labelPosition={{ dy: "0.71em" }}
              tickColor={COLORS.GRAY}
              fontSize={AXIS_FONT}
            />
            <Axis
              key="y-right-axis"
              direction="y"
              xShift={WIDTH - GRAPH_PADDING.right}
              scale={workerYScale}
              tickFormat=".2f"
              tickSize={5}
              textAnchor="start"
              labelPosition={{ x: "8" }}
              tickColor={COLORS.BLUE}
              color={COLORS.BLUE}
              fontSize={AXIS_FONT}
            />
            <AxisLabel
              x={10}
              y={HEIGHT / 2}
              dy={10}
              transform={`rotate(-90 10,${HEIGHT / 2})`}
              style={{ color: COLORS.ORANGE }}
            >
              Company profit change
            </AxisLabel>
            <AxisLabel
              x={WIDTH - 22}
              y={HEIGHT / 2}
              dy={10}
              transform={`rotate(90 ${WIDTH - 22},${HEIGHT / 2})`}
              style={{ color: COLORS.BLUE }}
            >
              Worker income
            </AxisLabel>
            <AxisLabel
              x={WIDTH / 2}
              y={HEIGHT - GRAPH_PADDING.bottom}
              dy={`${GRAPH_PADDING.bottom * 0.7}`}
              anchor="middle"
            >
              Share of jobs automated
            </AxisLabel>
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
              yScale={workerYScale}
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
              cy={workerYScale(coWorkerIncome)}
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
              cy={workerYScale(neWorkerIncome)}
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
        </div>
      </ColumnLayout>
    </Caption>
  );
};

export default WelfareChart;
