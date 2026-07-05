"use client";

import { scaleLinear } from "d3-scale";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import VerticalMarker from "@/components/story/shared/VerticalMarker";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import { BASE_SLIDER_CONFIG } from "../../sliderConfig";
import { useWelfareChartData } from "./useWelfareChartData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 80 };
const AXIS_FONT = "11px";
const MARKER_RADIUS = 6;
const DEFAULT_REPLACEMENT_RATE = 0.3;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const UPSKILLING_SLIDER = {
  min: 0,
  max: 2,
  initialValue: DEFAULT_REPLACEMENT_RATE,
  title: (val: number) =>
    `Share of income replaced (benefits, retraining): ${Math.round(val * 100)}%`,
  color: COLORS.BLACK,
};

const FULL_SLIDER_CONFIG = [...BASE_SLIDER_CONFIG, UPSKILLING_SLIDER];

const WelfareChart = () => {
  const { values, sliderData } = useSliders(FULL_SLIDER_CONFIG);

  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);
  const replacementRate = values[4];

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
    workerYMin,
    workerYMax,
    workerYPad,
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

  const workerYScale = scaleLinear()
    .domain([workerYMin - workerYPad, workerYMax + workerYPad])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  const zeroY = yScale(0);
  const trapX = xScale(Math.min(socialOptimum, marketOutcome));
  const trapWidth = Math.abs(xScale(marketOutcome) - xScale(socialOptimum));
  const trapY = GRAPH_PADDING.top;
  const trapHeight = HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  return (
    <ColumnLayout break="sm">
      <div className="flex flex-col justify-center h-full">
        <SliderGroup data={sliderData} />
      </div>
      <div>
        <Legend
          labels={[
            { text: "Company profits", color: COLORS.ORANGE },
            { text: "Worker income", color: COLORS.BLUE },
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
            tickColor={COLORS.RED}
            color={COLORS.RED}
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
            tickColor={COLORS.DARK_GREEN}
            color={COLORS.DARK_GREEN}
            fontSize={AXIS_FONT}
          />
          <AxisLabel
            x={10}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(-90 10,${HEIGHT / 2})`}
            style={{ color: COLORS.RED }}
          >
            Company profit change
          </AxisLabel>
          <AxisLabel
            x={WIDTH - 22}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(90 ${WIDTH - 22},${HEIGHT / 2})`}
            style={{ color: COLORS.DARK_GREEN }}
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
            stroke={COLORS.RED}
            strokeWidth={3}
            curve="curveLinear"
          />
          <LinePlot
            graphData={workerData}
            stroke={COLORS.DARK_GREEN}
            strokeWidth={3}
            yScale={workerYScale}
            curve="curveLinear"
          />
          <circle
            cx={xScale(socialOptimum)}
            cy={yScale(coOwnerProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(socialOptimum)}
            cy={workerYScale(coWorkerIncome)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(marketOutcome)}
            cy={yScale(neOwnerProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(marketOutcome)}
            cy={workerYScale(neWorkerIncome)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <VerticalMarker
            x={socialOptimum}
            color={COLORS.DARK_GRAY}
            label="Coordinated"
          />
          <VerticalMarker
            x={marketOutcome}
            color={COLORS.DARK_GRAY}
            label="Market"
          />
        </Graph>
      </div>
    </ColumnLayout>
  );
};

export default WelfareChart;
