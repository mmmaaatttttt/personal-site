import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Animate from "react-move/Animate";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";
import { beta } from "jStat";
import withCaption from "hocs/withCaption";
import {
  Button,
  FlexContainer,
  Graph,
  LinePlot,
  NarrowContainer,
  ToggleSwitch
} from "story_components";
import COLORS from "utils/styles";

class CoinFlipBayesianModel extends PureComponent {
  state = {
    heads: 0,
    tails: 0,
    uniform: true
  };

  resetCounts = () => this.setState({ heads: 0, tails: 0 });

  increment = key =>
    this.setState(prevState => ({ [key]: prevState[key] + 1 }));

  toggleDistribution = () => {
    this.setState(prevState => ({ uniform: !prevState.uniform }));
  };

  render() {
    let { heads, tails, uniform } = this.state;
    // regardless of true values, only show the user counts
    // corresponding to button clicks
    let headsDisplay = heads;
    let tailsDisplay = tails;
    if (!uniform) {
      heads += 50;
      tails += 50;
    }

    return (
      <NarrowContainer width="70%" fullWidthAt="small">
        <ToggleSwitch
          leftText="All probs equally likely"
          rightText="Fair coin more likely"
          leftColor={COLORS.RED}
          rightColor={COLORS.BLUE}
          handleSwitchChange={this.toggleDistribution}
        />
        <FlexContainer main="space-evenly">
          <Button onClick={() => this.increment("heads")}>
            Heads: {headsDisplay}
          </Button>
          <Button onClick={() => this.increment("tails")}>
            Tails: {tailsDisplay}
          </Button>
          <Button onClick={this.resetCounts} color={COLORS.DARK_GRAY}>Reset Counts</Button>
        </FlexContainer>
        <Animate
          show
          start={{ heads, tails, color: COLORS.RED }}
          update={{
            heads: [heads],
            tails: [tails],
            color: [uniform ? COLORS.RED : COLORS.BLUE],
            timing: { duration: 400 }
          }}
        >
          {({ heads, tails, color }) => {
            const { graphPadding, height, width, xCoords } = this.props;
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
                // svgPadding={{
                //   top: graphPadding,
                //   left: 0,
                //   bottom: 0,
                //   right: 0
                // }}
                svgPadding={0}
                graphPadding={graphPadding}
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
            );
          }}
        </Animate>
      </NarrowContainer>
    );
  }
}

CoinFlipBayesianModel.propTypes = {
  graphPadding: PropTypes.shape({
    top: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
  height: PropTypes.number.isRequired,
  xCoords: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired
};

CoinFlipBayesianModel.defaultProps = {
  graphPadding: {
    top: 0,
    right: 10,
    bottom: 100,
    left: 10
  },
  height: 500,
  width: 800,
  xCoords: Array.from({ length: 101 }, (_, i) => i / 100)
};

export default withCaption(CoinFlipBayesianModel);

export { CoinFlipBayesianModel };
