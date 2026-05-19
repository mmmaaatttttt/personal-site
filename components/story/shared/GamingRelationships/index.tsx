"use client";

import { extent } from "d3-array";
import type { AxisScale } from "d3-axis";
import { type NumberValue, scaleLinear } from "d3-scale";
import { useCallback, useMemo, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import FlexContainer from "@/components/story/shared/FlexContainer";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import SliderGroup from "@/components/story/shared/Slider/SliderGroup";
import { generateData } from "@/utils/mathHelpers";

function tickStep(scale: AxisScale<NumberValue>): number {
  const domain = scale.domain() as number[];
  const [tickMin, tickMax] = domain;
  return tickMax > 500 ? (tickMax - tickMin) / 1e3 : 1;
}

function getYDomain(
  graphData: { x: number; y: number }[][],
  smallestY: number,
  largestY: number,
): [number, number] {
  const allY = graphData.flatMap((series) => series.map((d) => Math.abs(d.y)));
  const yMax0 = allY.length > 0 ? Math.max(...allY) : 0;
  const yMax = Math.min(Math.max(Math.ceil(yMax0), smallestY), largestY);
  return [-yMax, yMax];
}

export interface SliderDatum {
  min: number;
  max: number;
  initialValue: number;
  title: string;
  color: string;
  equationParameter: boolean;
}

export type DiffEq = (
  ...params: number[]
) => (x: number, y: number[]) => number[];

export interface GamingVisData {
  initialData: SliderDatum[];
  diffEqs: DiffEq[];
  colors: string[];
  width: number;
  height: number;
  smallestY: number;
  largestY: number;
  svgIds: string[];
  xLabel: string;
  yLabel: string;
}

interface GamingRelationshipsProps {
  visData: GamingVisData;
  caption?: string;
  compact?: boolean;
  min?: number;
  max?: number;
  step?: number;
  svgPadding?: number;
  graphPadding?: number;
}

export default function GamingRelationships({
  visData,
  caption,
  compact = false,
  min = 0,
  max = 20,
  step = 0.1,
  svgPadding = 30,
  graphPadding = 30,
}: GamingRelationshipsProps) {
  const [values, setValues] = useState<number[]>(
    visData.initialData.map((d) => d.initialValue),
  );

  const handleValueChange = useCallback((idx: number, newVal: number) => {
    setValues((prev) => {
      const next = [...prev];
      next[idx] = newVal;
      return next;
    });
  }, []);

  const data = useMemo(
    () =>
      visData.initialData.map((d, i) => ({ ...d, value: values[i], key: i })),
    [visData.initialData, values],
  );

  const {
    width,
    height,
    diffEqs,
    svgIds,
    xLabel,
    yLabel,
    colors,
    smallestY,
    largestY,
  } = visData;

  const uniqueColors = Array.from(new Set(colors));

  const graphs = useMemo(() => {
    const transformData = (diffEq: DiffEq) => {
      const diffEqValues = data
        .filter((d) => d.equationParameter)
        .map((d) => d.value);
      const graphCount = colors.length;
      let initialValues = data
        .filter((d) => !d.equationParameter)
        .map((d) => d.value);
      if (initialValues.length === 0) initialValues = [0, 0];
      return generateData(
        graphCount,
        min,
        max,
        step,
        initialValues,
        diffEqValues,
        diffEq,
      );
    };

    return diffEqs
      .map((diffEq, i) => ({ diffEq, graphIdx: i }))
      .map(({ diffEq, graphIdx }) => {
        const sliceIdx = graphIdx === 1 && colors.length === 4 ? 2 : 0;
        const allGraphData = transformData(diffEq).slice(
          sliceIdx,
          sliceIdx + 2,
        );
        const xDomain = extent(allGraphData[0], (d) => d.x) as [number, number];
        const xScale = scaleLinear()
          .domain(xDomain)
          .range([graphPadding, width - graphPadding]);
        const yScale = scaleLinear()
          .domain(getYDomain(allGraphData, smallestY, largestY))
          .range([height - graphPadding, graphPadding]);

        const linePlots = allGraphData
          .map((graphData, j) => ({ graphData, lineIdx: 2 * graphIdx + j }))
          .map(({ graphData, lineIdx }) => (
            <LinePlot
              key={lineIdx}
              stroke={colors[lineIdx % colors.length]}
              graphData={graphData}
              xScale={xScale}
              yScale={yScale}
            />
          ));

        return (
          <Graph
            key={graphIdx}
            graphPadding={graphPadding}
            gridlinesVertical={false}
            height={height}
            svgId={svgIds[graphIdx]}
            svgPadding={svgPadding}
            tickStep={tickStep}
            width={width}
            xAxisPosition="center"
            xLabel={xLabel}
            xScale={xScale}
            yLabel={yLabel}
            yScale={yScale}
          >
            {linePlots}
          </Graph>
        );
      });
  }, [
    data,
    diffEqs,
    colors,
    width,
    height,
    graphPadding,
    svgPadding,
    svgIds,
    xLabel,
    yLabel,
    smallestY,
    largestY,
    min,
    max,
    step,
  ]);

  const sliderGroups = uniqueColors.map((color) => {
    const sliderData = data
      .filter((d) => d.color === color)
      .map((d) => ({
        ...d,
        tickCount: 3 as const,
        fadeIcons: true,
        handleValueChange: (val: number) => handleValueChange(d.key, val),
      }));
    return <SliderGroup key={color} data={sliderData} compact={compact} />;
  });

  const content =
    graphs.length === 1 ? (
      <ColumnLayout break="sm">
        <FlexContainer column>{sliderGroups}</FlexContainer>
        {graphs[0]}
      </ColumnLayout>
    ) : (
      <FlexContainer column>
        <ColumnLayout break="sm">{sliderGroups}</ColumnLayout>
        <ColumnLayout>{graphs}</ColumnLayout>
      </FlexContainer>
    );

  return <Caption caption={caption}>{content}</Caption>;
}
