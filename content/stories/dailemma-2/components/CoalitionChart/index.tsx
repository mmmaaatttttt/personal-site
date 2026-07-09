"use client";

import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import VerticalMarker from "@/components/story/shared/VerticalMarker";
import useSliders, { type SliderInitialData } from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { BASE_SLIDER_CONFIG } from "../../sliderConfig";
import { useCoalitionData } from "./useCoalitionData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 65, right: 30 };
const AXIS_FONT = "11px";
const MARKER_RADIUS = 6;

const xScale = scaleLinear()
  .domain([0, 1])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

function buildCoalitionSliderConfig(maxSize: number): SliderInitialData[] {
  return [
    {
      min: 1,
      max: maxSize,
      step: 1,
      initialValue: 1,
      title: (val: number) =>
        `Coalition size: ${Math.round(val)} of ${maxSize} firms`,
      color: COLORS.BLACK,
    },
  ];
}

const CoalitionChart = () => {
  const { values, sliderData } = useSliders(BASE_SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);

  const coalitionSliderConfig = useMemo(
    () => buildCoalitionSliderConfig(numFirms),
    [numFirms],
  );
  const { values: coalitionValues, sliderData: coalitionSliderData } =
    useSliders(coalitionSliderConfig);

  // numFirms can shrink below a previously-chosen coalition size; clamp the
  // displayed/used value without discarding the raw preference, so it
  // reappears if numFirms is raised again.
  const coalitionSize = Math.min(Math.round(coalitionValues[0]), numFirms);
  const clampedCoalitionSliderData = coalitionSliderData.map((d) => ({
    ...d,
    value: Math.min(d.value, numFirms),
  }));

  const {
    ownerData,
    coordinatedOutcome,
    marketOutcome,
    coalitionOutcome,
    coOwnerProfit,
    neOwnerProfit,
    coalitionOwnerProfit,
    yMin,
    yMax,
    yPad,
  } = useCoalitionData(
    savings,
    demandLoss,
    numFirms,
    difficulty,
    coalitionSize,
  );

  const yScale = scaleLinear()
    .domain([yMin - yPad, yMax + yPad])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <ColumnLayout break="sm">
      <div className="flex h-full flex-col justify-center">
        <SliderGroup data={[...sliderData, ...clampedCoalitionSliderData]} />
      </div>
      <div>
        <Graph
          axes={false}
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          width={WIDTH}
          svgId="coalition-chart"
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
            graphData={ownerData}
            stroke={COLORS.RED}
            strokeWidth={3}
            curve="curveLinear"
          />
          <circle
            cx={xScale(coordinatedOutcome)}
            cy={yScale(coOwnerProfit)}
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
            cx={xScale(coalitionOutcome)}
            cy={yScale(coalitionOwnerProfit)}
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
          <VerticalMarker
            x={coalitionOutcome}
            color={COLORS.DARK_GRAY}
            label="Coalition"
            labelYOffset={28}
          />
        </Graph>
      </div>
    </ColumnLayout>
  );
};

export default CoalitionChart;
