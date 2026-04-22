"use client";

import { FC, useState } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import Caption from "@/components/story/shared/Caption";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import FlexContainer from "@/components/story/shared/FlexContainer";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import { Button } from "@/components/ui/Button";
import ToggleSwitch from "./ToggleSwitch";
import { betaPdf } from "../../mathHelpers";
import COLORS from "@/utils/styles";

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

  const headsDisplay = heads;
  const tailsDisplay = tails;
  const a = uniform ? heads + 1 : heads + 51;
  const b = uniform ? tails + 1 : tails + 51;

  const color = uniform ? COLORS.RED : COLORS.BLUE;

  const graphData = X_COORDS.map((x) => ({ x, y: betaPdf(x, a, b) }));
  const yMax = max(graphData, (d) => d.y) ?? 1;

  const xScale = scaleLinear()
    .domain([0, 1])
    .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);
  const yScale = scaleLinear()
    .domain([0, 1.1 * yMax])
    .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

  return (
    <Caption caption={caption}>
      <NarrowContainer width="70%" fullWidthAt="sm">
        <ToggleSwitch
          leftText="All probs equally likely"
          rightText="Fair coin more likely"
          leftColor={COLORS.RED}
          rightColor={COLORS.BLUE}
          handleSwitchChange={(checked) => setUniform(!checked)}
        />
        <FlexContainer main="evenly" className="gap-2">
          <Button onClick={() => setHeads((h) => h + 1)}>
            Heads: {headsDisplay}
          </Button>
          <Button onClick={() => setTails((t) => t + 1)}>
            Tails: {tailsDisplay}
          </Button>
          <Button
            onClick={() => {
              setHeads(0);
              setTails(0);
            }}
            style={{ backgroundColor: COLORS.DARK_GRAY }}
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
            stroke={color}
            xScale={xScale}
            yScale={yScale}
          />
        </Graph>
      </NarrowContainer>
    </Caption>
  );
};

export default CoinFlipBayesianModel;
