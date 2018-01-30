import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import SimulationStart from "../molecules/SimulationStart";
import SimulationStop from "../molecules/SimulationStop";
import ClippedSVG from "../atoms/ClippedSVG";
import EconomyNodeGroup from "../molecules/EconomyNodeGroup";
import BarGraph from "../organisms/BarGraph";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import COLORS from "../../utils/styles";
import updateSpeeds from "../../data/income-inequality.js";

class EconomySimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      paused: false,
      showingSimulation: true,
      speeds: new Array(2).fill(this.props.initialV),
      velocityMultiplier: 1,
      savingsRate: 0
    };
  }

  handleStart = () => {
    this.setState({ playing: true });
  };

  handleStop = () => {
    this.setState({
      playing: false,
      paused: false,
      velocityMultiplier: 1,
      showingSimulation: true,
      speeds: new Array(2).fill(this.props.initialV),
      savingsRate: 0
    });
  };

  handlePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  handleShowingSimulation = () => {
    this.setState({ showingSimulation: !this.state.showingSimulation });
  };

  handleSpeedCount = newCount => {
    this.setState({ speeds: new Array(newCount).fill(this.props.initialV) });
  };

  handleVelocityChange = newMultiplier => {
    this.setState({ velocityMultiplier: newMultiplier });
  };

  handleSavingsChange = newSavingsRate => {
    this.setState({ savingsRate: newSavingsRate });
  };

  handleCollision = (...nodes) => {
    // NOTE: velocity isn't conserved, energy is
    const { speeds, velocityMultiplier, savingsRate } = this.state;
    const updateFn = updateSpeeds[this.props.idx];
    this.setState({
      speeds: updateFn(speeds, velocityMultiplier, savingsRate, nodes)
    });
  };

  render() {
    const {
      playing,
      paused,
      speeds,
      velocityMultiplier,
      showingSimulation,
      savingsRate
    } = this.state;
    const { width, height, padding, initialV, idx, editSavings } = this.props;
    const yScale = scaleLinear()
      .domain([0, Math.max(...speeds, 2.5 * initialV) ** 2 + 100])
      .range([height - padding, padding]);
    const barData = speeds
      .map((speed, i) => ({ key: i, height: speed ** 2 }))
      .sort((s1, s2) => s1.height - s2.height);
    const header = playing ? (
      <SimulationStop
        handleStop={this.handleStop}
        handlePause={this.handlePause}
        handleShowingSimulation={this.handleShowingSimulation}
        handleVelocityChange={this.handleVelocityChange}
        velocityMultiplier={velocityMultiplier}
        showingSimulation={showingSimulation}
      />
    ) : (
      <SimulationStart
        handleStart={this.handleStart}
        handleSpeedCount={this.handleSpeedCount}
        nodeCount={speeds.length}
        editSavings={editSavings}
        handleSavingsChange={this.handleSavingsChange}
        savingsRate={savingsRate}
      />
    );
    const barGraphArea = showingSimulation ? null : (
      <BarGraph
        svgId={`bar-${idx}`}
        width={width}
        height={height}
        padding={padding}
        barData={barData}
        yScale={yScale}
        initialV={initialV}
      />
    );
    return (
      <StyledNarrowContainer width="50%">
        {header}
        <div style={{ display: showingSimulation ? "block" : "none" }}>
          <ClippedSVG
            width={width}
            height={height}
            padding={padding}
            id={`simulation-${idx}`}
          >
            <EconomyNodeGroup
              speeds={speeds}
              width={width}
              height={height}
              playing={playing}
              paused={paused}
              velocityMultiplier={velocityMultiplier}
              handleCollision={this.handleCollision}
              initialV={initialV}
            />
          </ClippedSVG>
        </div>
        {barGraphArea}
      </StyledNarrowContainer>
    );
  }
}

EconomySimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  initialV: PropTypes.number.isRequired,
  idx: PropTypes.number.isRequired,
  editSavings: PropTypes.bool.isRequired
};

EconomySimulation.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  initialV: 10,
  editSavings: false
};

export default withCaption(EconomySimulation);
