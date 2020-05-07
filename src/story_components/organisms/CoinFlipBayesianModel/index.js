import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import Animate from "react-move/Animate";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { interpolate } from "d3-interpolate";
import { beta } from "jStat";
import {
  Button,
  FlexContainer,
  Graph,
  LinePlot,
  NarrowContainer,
  ToggleSwitch
} from "story_components";
import { withCaption } from "providers";
import { useToggle } from "hooks";
import COLORS from "utils/styles";

const defaultPadding = {
  top: 0,
  right: 10,
  bottom: 100,
  left: 10
};

const defaultCoords = Array.from({ length: 101 }, (_, i) => i / 100);

function CoinFlipBayesianModel({
  graphPadding = defaultPadding,
  height = 500,
  width = 800,
  xCoords = defaultCoords
}) {
  const [heads, setHeads] = useState(0);
  const [tails, setTails] = useState(0);
  const [uniform, toggleUniform] = useToggle(true);

  const resetCounts = useCallback(() => {
    setHeads(0);
    setTails(0);
  }, []);
  const incrementHeads = useCallback(() => setHeads(h => h + 1), []);
  const incrementTails = useCallback(() => setTails(t => t + 1), []);
  const tickStep = useCallback(() => 0.1, []);

  // regardless of true values, only show the user counts
  // corresponding to button clicks
  let headsDisplay = heads;
  let tailsDisplay = tails;
  let headsForGraph = uniform ? heads : heads + 50
  let tailsForGraph = uniform ? tails : tails + 50

  return (
    <NarrowContainer width="70%" fullWidthAt="small">
      <ToggleSwitch
        leftText="All probs equally likely"
        rightText="Fair coin more likely"
        leftColor={COLORS.RED}
        rightColor={COLORS.BLUE}
        handleSwitchChange={toggleUniform}
        checked={!uniform}
      />
      <FlexContainer main="space-evenly">
        <Button onClick={incrementHeads}>
          Heads: {headsDisplay}
        </Button>
        <Button onClick={incrementTails}>
          Tails: {tailsDisplay}
        </Button>
        <Button onClick={resetCounts} color={COLORS.DARK_GRAY}>
          Reset Counts
        </Button>
      </FlexContainer>
      <Animate
        show
        start={{ heads: headsForGraph, tails: tailsForGraph, color: COLORS.RED }}
        update={{
          heads: [headsForGraph],
          tails: [tailsForGraph],
          color: [uniform ? COLORS.RED : COLORS.BLUE],
          timing: { duration: 400 }
        }}
        interpolation={interpolate}
      >
        {({ heads, tails, color }) => {
          const graphData = xCoords.map(x => ({
            x,
            y: beta.pdf(x, heads + 1, tails + 1)
          }));
          const yMax = max(graphData, d => d.y);
          const xScale = scaleLinear()
            .domain([0, 1])
            .range([graphPadding.left, width - graphPadding.right]);
          const yScale = scaleLinear()
            .domain([0, 1.1 * yMax])
            .range([height - graphPadding.bottom, graphPadding.top]);
          return (
            <Graph
              width={width}
              height={height}
              svgPadding={0}
              graphPadding={graphPadding}
              svgId="bayesian-graph"
              xLabel="Coin flip distribution"
              xScale={xScale}
              yScale={yScale}
              tickStep={tickStep}
              tickFormatX=".0%"
            >
              <LinePlot
                graphData={graphData}
                stroke={color}
                xScale={xScale}
                yScale={yScale}
              />
            </Graph>
          );
        }}
      </Animate>
    </NarrowContainer>
  );
}

CoinFlipBayesianModel.propTypes = {
  graphPadding: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number
  }),
  height: PropTypes.number,
  width: PropTypes.number,
  xCoords: PropTypes.arrayOf(PropTypes.number)
};

export default withCaption(React.memo(CoinFlipBayesianModel));

export { CoinFlipBayesianModel };
