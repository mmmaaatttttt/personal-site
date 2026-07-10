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
import { useLevelInstrumentsData } from "./useLevelInstrumentsData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 30 };
const AXIS_FONT = "11px";
const MARKER_RADIUS = 6;
const DEFAULT_UBI_BENEFIT = 0;
const DEFAULT_CAPITAL_TAX_RATE = 0;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const UBI_SLIDER = {
  min: 0,
  max: 1,
  initialValue: DEFAULT_UBI_BENEFIT,
  title: (val: number) => `UBI benefit: ${Math.round(val * 100)}%`,
  color: COLORS.RED,
};

const CAPITAL_TAX_SLIDER = {
  min: 0,
  max: 1,
  initialValue: DEFAULT_CAPITAL_TAX_RATE,
  title: (val: number) => `Capital tax rate: ${Math.round(val * 100)}%`,
  color: COLORS.DARK_GREEN,
};

const FULL_SLIDER_CONFIG = [
  ...BASE_SLIDER_CONFIG,
  UBI_SLIDER,
  CAPITAL_TAX_SLIDER,
];

const LevelInstrumentsChart = () => {
  const { values, sliderData } = useSliders(FULL_SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);
  const ubiBenefit = values[4];
  const capitalTaxRate = values[5];

  const {
    baselineData,
    ubiData,
    capitalTaxData,
    marketOutcome,
    coordinatedOutcome,
    coBaselineProfit,
    neBaselineProfit,
    coUbiProfit,
    neUbiProfit,
    coCapitalTaxProfit,
    neCapitalTaxProfit,
    yMin,
    yMax,
    yPad,
  } = useLevelInstrumentsData(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    ubiBenefit,
    capitalTaxRate,
  );

  const yScale = scaleLinear()
    .domain([yMin - yPad, yMax + yPad])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  const wedgeMin = Math.min(coordinatedOutcome, marketOutcome);
  const wedgeMax = Math.max(coordinatedOutcome, marketOutcome);
  const trapX = xScale(wedgeMin);
  const trapWidth = xScale(wedgeMax) - xScale(wedgeMin);
  const trapY = GRAPH_PADDING.top;
  const trapHeight = HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  return (
    <ColumnLayout break="sm">
      <div className="flex h-full flex-col justify-center gap-4">
        <SliderGroup data={sliderData} />
      </div>
      <div>
        <Legend
          labels={[
            { text: "Baseline", color: COLORS.GRAY },
            { text: "UBI", color: COLORS.RED },
            { text: "Capital Tax", color: COLORS.DARK_GREEN },
          ]}
        />
        <Graph
          axes={false}
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          width={WIDTH}
          svgId="level-instruments-chart"
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
          <AxisLabel
            x={10}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(-90 10,${HEIGHT / 2})`}
          >
            Company profit change
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
            y1={yScale(0)}
            y2={yScale(0)}
            stroke={COLORS.GRAY}
            strokeWidth={1}
            strokeDasharray="4 2"
          />
          <LinePlot
            graphData={baselineData}
            stroke={COLORS.GRAY}
            strokeWidth={2}
            opacity={0.5}
            curve="curveLinear"
          />
          <LinePlot
            graphData={ubiData}
            stroke={COLORS.RED}
            strokeWidth={3}
            curve="curveLinear"
          />
          <LinePlot
            graphData={capitalTaxData}
            stroke={COLORS.DARK_GREEN}
            strokeWidth={3}
            curve="curveLinear"
          />
          <circle
            cx={xScale(coordinatedOutcome)}
            cy={yScale(coBaselineProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(marketOutcome)}
            cy={yScale(neBaselineProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(coordinatedOutcome)}
            cy={yScale(coUbiProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(marketOutcome)}
            cy={yScale(neUbiProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(coordinatedOutcome)}
            cy={yScale(coCapitalTaxProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(marketOutcome)}
            cy={yScale(neCapitalTaxProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <VerticalMarker
            x={coordinatedOutcome}
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

export default LevelInstrumentsChart;
