"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type FC, useState } from "react";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import {
  HEIGHT,
  LEVEL_COLORS,
  PRIME_OPTIONS,
  WIDTH,
  xScale,
  yScale,
} from "./constants";
import { generatePAdicPoints, getStartIdx, showLabel } from "./helpers";

const LEVEL_SLIDER = [
  {
    color: COLORS.BLACK,
    min: 1,
    max: 3,
    step: 1,
    initialValue: 1,
    title: (val: number) => `Number of generations: ${val}`,
    tickCount: 3,
  },
];

const PAdicFractalDistance: FC = () => {
  const [primeOpt, setPrimeOpt] = useState(PRIME_OPTIONS[0]);
  const prime = Number(primeOpt.value);
  const { values, sliderData } = useSliders(LEVEL_SLIDER);
  const [level] = values;
  const points = generatePAdicPoints(prime, level);

  return (
    <NarrowContainer width="58%">
      <SliderGroup data={sliderData} />
      <div className="flex flex-col items-center gap-4">
        <Select
          name="padic-fractal-prime"
          value={primeOpt.value}
          onChange={setPrimeOpt}
          options={PRIME_OPTIONS}
        />
        <ClippedSVG
          id="p-adic-distances"
          width={WIDTH}
          height={HEIGHT}
          clipChildren={false}
        >
          <AnimatePresence>
            {points.map((pt, i) => {
              const startPt = points[getStartIdx(i, prime, points)];
              const fill = LEVEL_COLORS[pt.fillIdx] ?? COLORS.BLACK;
              const tx = xScale(pt.cx);
              const ty = yScale(pt.cy);
              const sx = xScale(startPt.cx);
              const sy = yScale(startPt.cy);
              return (
                <motion.g
                  key={pt.num}
                  initial={{ x: sx, y: sy, opacity: 0 }}
                  animate={{ x: tx, y: ty, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.01 }}
                  fill={fill}
                >
                  <circle r={3} />
                  {showLabel(prime, level, pt.num) && (
                    <text
                      textAnchor="middle"
                      dy={-10}
                      fontSize={16}
                      fill={fill}
                    >
                      {pt.num}
                    </text>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </ClippedSVG>
      </div>
    </NarrowContainer>
  );
};

export default PAdicFractalDistance;
