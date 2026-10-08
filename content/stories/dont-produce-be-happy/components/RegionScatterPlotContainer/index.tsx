"use client";

import { scaleLinear } from "d3-scale";
import RegionScatterPlot from "./RegionScatterPlot";
import useRegionScatterData, {
  type RegionScatterPlotContainerProps,
} from "./useRegionScatterData";

const GDP_WIDTH = 600;
const GDP_HEIGHT = 400;
const GDP_PADDING = { top: 20, bottom: 50, left: 70, right: 20 };
const gdpXScale = scaleLinear()
  .domain([0, 150000])
  .range([GDP_PADDING.left, GDP_WIDTH - GDP_PADDING.right]);
const gdpYScale = scaleLinear()
  .domain([2, 8])
  .range([GDP_HEIGHT - GDP_PADDING.bottom, GDP_PADDING.top]);

const HEALTH_WIDTH = 800;
const HEALTH_HEIGHT = 450;
const HEALTH_PADDING = { top: 20, bottom: 50, left: 70, right: 20 };
const HEALTH_AXIS_FONT = "12px";
const healthXScale = scaleLinear()
  .domain([0, 14000])
  .range([HEALTH_PADDING.left, HEALTH_WIDTH - HEALTH_PADDING.right]);
const healthYScale = scaleLinear()
  .domain([45, 87])
  .range([HEALTH_HEIGHT - HEALTH_PADDING.bottom, HEALTH_PADDING.top]);

export default function RegionScatterPlotContainer(
  props: RegionScatterPlotContainerProps,
) {
  const { sliderData, data } = useRegionScatterData(props);

  if (props.variant === "gdp-happiness") {
    return (
      <RegionScatterPlot
        data={data}
        sliderData={sliderData}
        width={GDP_WIDTH}
        height={GDP_HEIGHT}
        graphPadding={GDP_PADDING}
        xScale={gdpXScale}
        yScale={gdpYScale}
        xTickFormat="$,"
        yTickFormat=".1f"
        xAxisLabel="GDP per capita"
        yAxisLabel="Life Ladder Score"
        containerWidth="75%"
      />
    );
  }

  return (
    <RegionScatterPlot
      data={data}
      sliderData={sliderData}
      width={HEALTH_WIDTH}
      height={HEALTH_HEIGHT}
      graphPadding={HEALTH_PADDING}
      xScale={healthXScale}
      yScale={healthYScale}
      xTickFormat="$,"
      yTickFormat="d"
      xAxisLabel="Healthcare Spending Per Capita (USD)"
      yAxisLabel="Life Expectancy (years)"
      axisFontSize={HEALTH_AXIS_FONT}
      containerWidth="85%"
    />
  );
}
