"use client";

import { scaleLinear } from "d3-scale";
import type { FC } from "react";
import Caption from "@/components/story/shared/Caption";
import Graph from "@/components/story/shared/Graph";
import SliderProvider from "@/components/story/shared/Slider";
import COLORS from "@/utils/styles";
import { generateCirclePoints } from "./helpers";

const WIDTH = 600;
const HEIGHT = 600;

const sliderData = [
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 1,
    title: (r: number) => `Circle radius: ${r}`,
    color: COLORS.DARK_GRAY,
  },
];

interface ManhattanCircleProps {
  caption?: string;
}

const ManhattanCircle: FC<ManhattanCircleProps> = ({ caption }) => {
  return (
    <Caption caption={caption}>
      <SliderProvider
        fullWidthAt="sm"
        width="55%"
        initialData={sliderData}
        render={([r]) => {
          const bound = Math.max(r + 1, 10);
          const xScale = scaleLinear()
            .domain([-bound, bound])
            .range([1, WIDTH - 1]);
          const yScale = scaleLinear()
            .domain([-bound, bound])
            .range([HEIGHT - 1, 1]);
          const points = generateCirclePoints(r);
          return (
            <Graph
              height={HEIGHT}
              width={WIDTH}
              svgId="manhattan-circle"
              xAxisPosition="center"
              xScale={xScale}
              yAxisPosition="center"
              yScale={yScale}
            >
              <circle cx={xScale(0)} cy={yScale(0)} fill={COLORS.RED} r={8} />
              {points.map((pt) => (
                <circle
                  cx={xScale(pt.x)}
                  cy={yScale(pt.y)}
                  r={4}
                  key={`${pt.x}|${pt.y}`}
                />
              ))}
            </Graph>
          );
        }}
      />
    </Caption>
  );
};

export default ManhattanCircle;
