"use client";

import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import type React from "react";
import { useMemo } from "react";
import Caption from "@/components/story/shared/Caption";
import FlexContainer from "@/components/story/shared/FlexContainer";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import SliderProvider from "@/components/story/shared/Slider";
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

const WarmingDots: React.FC<WarmingDotsProps> = ({
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

  const sliderData = useMemo(() => {
    return colors.flatMap((color) =>
      initialData.filter((d) => d.color === color),
    );
  }, [colors, initialData]);

  const tickStep = (scale: any) => {
    const [tickMin, tickMax] = scale.domain();
    return tickMax > 500 ? (tickMax - tickMin) / 1000 : 1;
  };

  const transformData = (dataValues: number[], diffEq: any) => {
    const dataWithValues = initialData.map((d, i) => ({
      ...d,
      value: dataValues[i] ?? (d as any).initialValue,
    }));

    const diffEqValues = dataWithValues
      .filter((d) => (d as any).equationParameter)
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

  return (
    <Caption caption={caption}>
      <SliderProvider
        initialData={sliderData}
        width="100%"
        render={(sliderVals) => {
          const graphData = transformData(sliderVals, diffEqs[0]);

          const flatData = graphData.flat();
          const yMaxVal = max(flatData, (d) => Math.abs(d.y)) || 0;
          const yMax = Math.min(
            Math.max(Math.ceil(yMaxVal), smallestY),
            largestY,
          );

          const xScale = scaleLinear()
            .domain(extent(graphData[0], (d) => d.x) as [number, number])
            .range([graphPadding, width - graphPadding]);

          const yScale = scaleLinear()
            .domain([0, yMax])
            .range([height - graphPadding, graphPadding]);

          return (
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
                {graphData.map((plot, i) => (
                  <LinePlot
                    key={i}
                    graphData={plot}
                    stroke={colors[i]}
                    xScale={xScale}
                    yScale={yScale}
                    strokeWidth={5}
                  />
                ))}
              </Graph>
            </FlexContainer>
          );
        }}
      />
    </Caption>
  );
};

export default WarmingDots;
export { WarmingDots };
