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
import { usePigouvianTaxData } from "./usePigouvianTaxData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 80 };
const AXIS_FONT = "11px";
const MARKER_RADIUS = 6;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const workerYScale = scaleLinear()
  .domain([0, 1])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const TAX_SLIDER_CONFIG = {
  min: 0,
  max: 1.5,
  initialValue: 0,
  title: (val: number) =>
    `Tax as fraction of optimal: ${Math.round(val * 100)}%`,
  color: COLORS.BLACK,
};

const FULL_SLIDER_CONFIG = [...BASE_SLIDER_CONFIG, TAX_SLIDER_CONFIG];

const PigouvianTaxChart = () => {
  const { values, sliderData } = useSliders(FULL_SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);
  const taxFraction = values[4];

  const {
    ownerData,
    workerData,
    coordinatedOutcome,
    taxedMarketOutcome,
    coOwnerProfit,
    coWorkerIncome,
    taxedNeOwnerProfit,
    taxedNeWorkerIncome,
    yMin,
    yMax,
    yPad,
  } = usePigouvianTaxData(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    taxFraction,
  );

  const yScale = scaleLinear()
    .domain([yMin - yPad, yMax + yPad])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  const zeroY = yScale(0);
  const wedgeMin = Math.min(coordinatedOutcome, taxedMarketOutcome);
  const wedgeMax = Math.max(coordinatedOutcome, taxedMarketOutcome);
  const trapX = xScale(wedgeMin);
  const trapWidth = xScale(wedgeMax) - xScale(wedgeMin);
  const trapY = GRAPH_PADDING.top;
  const trapHeight = HEIGHT - GRAPH_PADDING.top - GRAPH_PADDING.bottom;

  return (
    <ColumnLayout break="sm">
      <div className="flex h-full flex-col justify-center">
        <SliderGroup data={sliderData} />
      </div>
      <div>
        <Legend
          labels={[
            { text: "Company profits", color: COLORS.RED },
            { text: "Worker income", color: COLORS.DARK_GREEN },
          ]}
        />
        <Graph
          axes={false}
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          width={WIDTH}
          svgId="pigouvian-tax-chart"
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
            cx={xScale(coordinatedOutcome)}
            cy={yScale(coOwnerProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(coordinatedOutcome)}
            cy={workerYScale(coWorkerIncome)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(taxedMarketOutcome)}
            cy={yScale(taxedNeOwnerProfit)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <circle
            cx={xScale(taxedMarketOutcome)}
            cy={workerYScale(taxedNeWorkerIncome)}
            r={MARKER_RADIUS}
            fill={COLORS.DARK_GRAY}
          />
          <VerticalMarker
            x={coordinatedOutcome}
            color={COLORS.DARK_GRAY}
            label="Coordinated"
          />
          <VerticalMarker
            x={taxedMarketOutcome}
            color={COLORS.DARK_GRAY}
            label="Market"
          />
        </Graph>
      </div>
    </ColumnLayout>
  );
};

export default PigouvianTaxChart;
