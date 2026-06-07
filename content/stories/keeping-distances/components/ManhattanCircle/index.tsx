"use client";

import { scaleLinear } from "d3-scale";
import type { FC } from "react";
import Graph from "@/components/story/shared/Graph";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { generateCirclePoints } from "./helpers";

const WIDTH = 600;
const HEIGHT = 600;

const SLIDER_CONFIG = [
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 1,
    title: (r: number) => `Circle radius: ${r}`,
    color: COLORS.DARK_GRAY,
  },
];

const ManhattanCircle: FC = () => {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [r] = values;
  const bound = Math.max(r + 1, 10);
  const xScale = scaleLinear()
    .domain([-bound, bound])
    .range([1, WIDTH - 1]);
  const yScale = scaleLinear()
    .domain([-bound, bound])
    .range([HEIGHT - 1, 1]);
  const points = generateCirclePoints(r);

  return (
    <NarrowContainer width="55%">
      <SliderGroup data={sliderData} />
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
    </NarrowContainer>
  );
};

export default ManhattanCircle;
