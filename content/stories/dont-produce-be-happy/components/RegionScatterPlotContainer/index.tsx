"use client";

import { scaleLinear } from "d3-scale";
import {
  CHART_CONTAINER_WIDTH,
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  GDP_PER_CAPITA_DOMAIN,
  LIFE_LADDER_DOMAIN,
  LIFE_LADDER_LABEL,
} from "../../constants";
import RegionScatterPlot from "./RegionScatterPlot";
import useRegionScatterData, {
  type RegionScatterPlotContainerProps,
} from "./useRegionScatterData";

const X_RANGE = [CHART_PADDING.left, CHART_WIDTH - CHART_PADDING.right];
const Y_RANGE = [CHART_HEIGHT - CHART_PADDING.bottom, CHART_PADDING.top];

const gdpXScale = scaleLinear().domain(GDP_PER_CAPITA_DOMAIN).range(X_RANGE);
const gdpYScale = scaleLinear().domain(LIFE_LADDER_DOMAIN).range(Y_RANGE);

const healthXScale = scaleLinear().domain([0, 14000]).range(X_RANGE);
const healthYScale = scaleLinear().domain([45, 87]).range(Y_RANGE);

export default function RegionScatterPlotContainer(
  props: RegionScatterPlotContainerProps,
) {
  const { sliderData, data } = useRegionScatterData(props);

  if (props.variant === "gdp-happiness") {
    return (
      <RegionScatterPlot
        data={data}
        sliderData={sliderData}
        width={CHART_WIDTH}
        height={CHART_HEIGHT}
        graphPadding={CHART_PADDING}
        xScale={gdpXScale}
        yScale={gdpYScale}
        xTickFormat="$,"
        yTickFormat=".1f"
        xAxisLabel="GDP per capita"
        yAxisLabel={LIFE_LADDER_LABEL}
        containerWidth={CHART_CONTAINER_WIDTH}
      />
    );
  }

  return (
    <RegionScatterPlot
      data={data}
      sliderData={sliderData}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      graphPadding={CHART_PADDING}
      xScale={healthXScale}
      yScale={healthYScale}
      xTickFormat="$,"
      yTickFormat="d"
      xAxisLabel="Healthcare spending per capita"
      yAxisLabel="Life expectancy (years)"
      containerWidth={CHART_CONTAINER_WIDTH}
    />
  );
}
