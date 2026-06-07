"use client";

import { extent, max } from "d3-array";
import type { AxisScale } from "d3-axis";
import { type NumberValue, scaleLinear } from "d3-scale";
import { type FC, useMemo } from "react";
import Caption from "@/components/story/shared/Caption";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import FlexContainer from "@/components/story/shared/FlexContainer";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import type { DiffEqFactory } from "@/utils/mathHelpers";
import { generateData } from "@/utils/mathHelpers";
import { visualizationData } from "../data/warming-dots";

interface WarmingDotsProps {
  vizIndex?: number | string;
  caption: string;
  graphPadding?: number;
  maxT?: number;
  minT?: number;
  stepT?: number;
  svgPadding?: { top: number; bottom: number; left: number; right: number };
}

const WarmingDots: FC<WarmingDotsProps> = ({
  vizIndex = 0,
  caption,
  graphPadding = 30,
  maxT = 10,
  minT = 0,
  stepT = 0.005,
  svgPadding = { top: 30, left: 0, bottom: 0, right: 30 },
}) => {
  const vizIndexNum =
    typeof vizIndex === "string" ? parseInt(vizIndex, 10) : vizIndex;
  const visData = visualizationData[vizIndexNum];

  const {
    initialData,
    width,
    height,
    svgIds,
    xLabel,
    yLabel,
    colors,
    integrationConstants,
    diffEqs,
    smallestY,
    largestY,
  } = visData;

  const sliderConfig = useMemo(() => {
    return colors.flatMap((color) =>
      initialData.filter((d) => d.color === color),
    );
  }, [colors, initialData]);

  const { values, sliderData } = useSliders(sliderConfig);

  const tickStep = (scale: AxisScale<NumberValue>) => {
    const [tickMin, tickMax] = scale.domain() as number[];
    return tickMax > 500 ? (tickMax - tickMin) / 1000 : 1;
  };

  type SliderItem = {
    initialValue: number;
    equationParameter: boolean;
    color: string;
  };

  const transformData = (dataValues: number[], diffEq: DiffEqFactory) => {
    const dataWithValues = (initialData as SliderItem[]).map((d, i) => ({
      ...d,
      value: dataValues[i] ?? d.initialValue,
    }));

    const diffEqValues = dataWithValues
      .filter((d) => d.equationParameter)
      .map((d) => d.value);

    return generateData(
      colors.length,
      minT,
      maxT,
      stepT,
      integrationConstants,
      diffEqValues,
      diffEq,
    );
  };

  const graphData = transformData(values, diffEqs[0]);
  const flatData = graphData.flat();
  const yMaxVal = max(flatData, (d) => Math.abs(d.y)) || 0;
  const yMax = Math.min(Math.max(Math.ceil(yMaxVal), smallestY), largestY);

  const xScale = scaleLinear()
    .domain(extent(graphData[0], (d) => d.x) as [number, number])
    .range([graphPadding, width - graphPadding]);

  const yScale = scaleLinear()
    .domain([0, yMax])
    .range([height - graphPadding, graphPadding]);

  const numSliders = sliderConfig.length;
  const compact = numSliders >= 6;

  const chartEl = (
    <FlexContainer cross="center" key="graph" className="mt-8">
      <Graph
        width={width}
        height={height}
        svgPadding={svgPadding}
        graphPadding={graphPadding}
        svgId={svgIds[0]}
        xLabel={xLabel}
        yLabel={yLabel}
        xScale={xScale}
        yScale={yScale}
        tickStep={tickStep}
      >
        {graphData
          .map((plot, i) => ({ plot, color: colors[i] }))
          .map(({ plot, color }) => (
            <LinePlot
              key={color}
              graphData={plot}
              stroke={color}
              xScale={xScale}
              yScale={yScale}
              strokeWidth={5}
            />
          ))}
      </Graph>
    </FlexContainer>
  );

  return (
    <Caption caption={caption}>
      {numSliders < 4 ? (
        <NarrowContainer width="75%">
          <SliderGroup data={sliderData} compact={compact} />
          {chartEl}
        </NarrowContainer>
      ) : (
        <ColumnLayout break="sm">
          <div className="flex flex-col justify-center h-full">
            <SliderGroup data={sliderData} compact={compact} />
          </div>
          {chartEl}
        </ColumnLayout>
      )}
    </Caption>
  );
};

export default WarmingDots;
