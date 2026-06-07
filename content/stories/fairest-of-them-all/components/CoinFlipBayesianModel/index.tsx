"use client";

import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { type FC, useEffect, useState } from "react";
import Figure from "@/components/story/shared/Figure";
import FlexContainer from "@/components/story/shared/FlexContainer";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import ToggleSwitch from "@/components/story/shared/ToggleSwitch";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";
import { betaPdf } from "../../mathHelpers";

const X_COORDS = Array.from({ length: 101 }, (_, i) => i / 100);
const GRAPH_PADDING = { top: 0, right: 10, bottom: 100, left: 10 };
const WIDTH = 800;
const HEIGHT = 500;

interface CoinFlipBayesianModelProps {
  caption?: string;
}

const CoinFlipBayesianModel: FC<CoinFlipBayesianModelProps> = ({ caption }) => {
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [uniform, setUniform] = useState(true);

  const targetA = uniform ? heads + 1 : heads + 51;
  const targetB = uniform ? tails + 1 : tails + 51;
  const targetColor = uniform ? COLORS.RED : COLORS.BLUE;

  // Animated display values — interpolate smoothly on every state change
  const aMotion = useMotionValue(targetA);
  const bMotion = useMotionValue(targetB);
  const colorMotion = useMotionValue(targetColor);
  const [displayA, setDisplayA] = useState(targetA);
  const [displayB, setDisplayB] = useState(targetB);
  const [displayColor, setDisplayColor] = useState(targetColor);

  useMotionValueEvent(aMotion, "change", setDisplayA);
  useMotionValueEvent(bMotion, "change", setDisplayB);
  useMotionValueEvent(colorMotion, "change", setDisplayColor);

  useEffect(() => {
    animate(aMotion, targetA, { duration: 0.4, ease: "easeOut" });
    animate(bMotion, targetB, { duration: 0.4, ease: "easeOut" });
    animate(colorMotion, targetColor, { duration: 0.4, ease: "easeOut" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetA, targetB, targetColor, colorMotion, bMotion, aMotion]);

  const graphData = X_COORDS.map((x) => ({
    x,
    y: betaPdf(x, displayA, displayB),
  }));
  const yMax = max(graphData, (d) => d.y) ?? 1;

  const xScale = scaleLinear()
    .domain([0, 1])
    .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);
  const yScale = scaleLinear()
    .domain([0, 1.1 * yMax])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <Figure caption={caption}>
      <NarrowContainer width="65%" fullWidthAt="sm">
        <ToggleSwitch
          leftText="All probs equally likely"
          rightText="Fair coin more likely"
          leftColor={COLORS.RED}
          rightColor={COLORS.BLUE}
          handleSwitchChange={(checked) => setUniform(!checked)}
        />
        <FlexContainer main="evenly" margin="1rem 0" className="gap-2">
          <Button
            size="sm"
            variant="white"
            onClick={() => setHeads((h) => h + 1)}
          >
            Heads: {heads}
          </Button>
          <Button
            size="sm"
            variant="white"
            onClick={() => setTails((t) => t + 1)}
          >
            Tails: {tails}
          </Button>
          <Button
            size="sm"
            variant="white"
            onClick={() => {
              setHeads(0);
              setTails(0);
            }}
          >
            Reset Counts
          </Button>
        </FlexContainer>
        <Graph
          width={WIDTH}
          height={HEIGHT}
          svgPadding={0}
          graphPadding={GRAPH_PADDING}
          svgId="bayesian-graph"
          xLabel="Coin flip distribution"
          xScale={xScale}
          yScale={yScale}
          tickStep={() => 0.1}
          tickFormatX=".0%"
        >
          <LinePlot
            graphData={graphData}
            stroke={displayColor}
            xScale={xScale}
            yScale={yScale}
          />
        </Graph>
      </NarrowContainer>
    </Figure>
  );
};

export default CoinFlipBayesianModel;
