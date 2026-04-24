"use client";

import { FC } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import Caption from "@/components/story/shared/Caption";
import SliderProvider from "@/components/story/shared/Slider";
import BarGraph from "@/components/story/shared/BarGraph";
import COLORS from "@/utils/styles";
import { binomialDensityValues } from "../../mathHelpers";

const HEIGHT = 400;
const PADDING = { top: 10, left: 10, bottom: 20, right: 10 };

const sliderData = [
  {
    min: 1,
    max: 100,
    step: 1,
    initialValue: 20,
    title: (val: number) => `Number of coin flips: ${val}`,
    color: COLORS.GREEN,
  },
  {
    min: 0,
    max: 1,
    step: 0.01,
    initialValue: 0.05,
    title: (val: number) =>
      `Probability of flipping heads: ${(val * 100).toFixed(0)}%`,
    color: COLORS.GREEN,
  },
];

interface CoinFlipHistogramProps {
  caption?: string;
}

const CoinFlipHistogram: FC<CoinFlipHistogramProps> = ({ caption }) => {
  return (
    <Caption caption={caption}>
      <SliderProvider
        initialData={sliderData}
        width="60%"
        render={(sliderVals) => {
          const [numTrials, headsProb] = sliderVals;
          const barData = binomialDensityValues(numTrials, headsProb).map(
            (h, key) => ({ key, height: h, x0: key, x1: key + 1 }),
          );
          const maxH = max(barData, (d) => d.height) ?? 0;
          const yScale = scaleLinear()
            .domain([0, Math.max(maxH, 0.1)])
            .range([HEIGHT - PADDING.bottom, PADDING.top]);
          return (
            <BarGraph
              animated={false}
              barData={barData}
              color={COLORS.GREEN}
              gridlinesVertical={false}
              height={HEIGHT}
              histogram
              padding={PADDING}
              svgId="coinflips"
              thresholds={barData
                .map((d) => d.key as number)
                .concat(numTrials + 1)}
              yLabelSide="right"
              yTickFormat=".0%"
              tickStep={0.02}
              width={600}
              yScale={yScale}
            />
          );
        }}
      />
    </Caption>
  );
};

export default CoinFlipHistogram;
