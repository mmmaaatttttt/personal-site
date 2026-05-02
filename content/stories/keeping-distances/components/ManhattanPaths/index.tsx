"use client";

import { scaleLinear } from "d3-scale";
import { type FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import LabeledSlider from "@/components/story/shared/Slider/LabeledSlider";
import COLORS from "@/utils/styles";
import {
  generateGridPoints,
  generatePathOptions,
  generatePathPoints,
} from "./helpers";

const WIDTH = 600;
const HEIGHT = 600;
const GRAPH_PADDING = 20;
const POINT_RADIUS = 8;

const xScale = scaleLinear()
  .domain([0, 5])
  .range([GRAPH_PADDING, WIDTH - GRAPH_PADDING]);
const yScale = scaleLinear()
  .domain([0, 5])
  .range([HEIGHT - GRAPH_PADDING, GRAPH_PADDING]);

const gridPoints = generateGridPoints(xScale, yScale);

interface ManhattanPathsProps {
  caption?: string;
}

const ManhattanPaths: FC<ManhattanPathsProps> = ({ caption }) => {
  const [activePoint, setActivePoint] = useState({ x: 2, y: 2 });
  const [sliderVal, setSliderVal] = useState(1);

  const paths = generatePathOptions(activePoint.y, activePoint.x);
  const pathPoints = generatePathPoints(paths[sliderVal - 1]).map((pt) => ({
    x: xScale(pt.x),
    y: yScale(pt.y),
  }));
  const polylinePoints = pathPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <Caption caption={caption}>
      <NarrowContainer width="50%">
        <LabeledSlider
          min={1}
          max={paths.length}
          step={1}
          value={sliderVal}
          title={`Path ${sliderVal} of ${paths.length}`}
          handleValueChange={setSliderVal}
          color={COLORS.DARK_GRAY}
        />
        <Graph
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          svgId="manhattan-paths"
          tickStep={() => 1}
          width={WIDTH}
          xScale={xScale}
          yScale={yScale}
        >
          {gridPoints.map((pt) => {
            const isActive = pt.x === activePoint.x && pt.y === activePoint.y;
            const color = isActive ? COLORS.BLACK : COLORS.LIGHT_GRAY;
            return (
              <circle
                key={`${pt.x}|${pt.y}`}
                cx={xScale(pt.x)}
                cy={yScale(pt.y)}
                r={POINT_RADIUS}
                fill={color}
                stroke={color}
                onClick={
                  isActive
                    ? undefined
                    : () => {
                        setActivePoint({ x: pt.x, y: pt.y });
                        setSliderVal(1);
                      }
                }
                style={{ cursor: isActive ? "default" : "pointer" }}
              />
            );
          })}
          <polyline
            points={polylinePoints}
            fill="none"
            stroke={COLORS.BLACK}
            strokeWidth={POINT_RADIUS / 2}
          />
        </Graph>
      </NarrowContainer>
    </Caption>
  );
};

export default ManhattanPaths;
