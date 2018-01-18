import React, { Component } from "react";
import PropTypes from "prop-types";
import SimulationStart from "../molecules/SimulationStart";
import SimulationStop from "../molecules/SimulationStop";
import ClippedSVG from "../atoms/ClippedSVG";
import EconomyNodeGroup from "../molecules/EconomyNodeGroup";
import withCaption from "../../hocs/withCaption";
import StyledNarrowContainer from "../atoms/StyledNarrowContainer";
import { euclideanDistance } from "../../utils/mathHelpers";
import COLORS from "../../utils/styles";

class EconomySimulation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
      paused: false,
      speeds: new Array(2).fill(this.props.initialV),
      velocityMultiplier: 1
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
      speeds: new Array(2).fill(this.props.initialV)
    });
  };

  handlePause = () => {
    this.setState({ paused: !this.state.paused });
  };

  handleSpeedCount = newCount => {
    this.setState({ speeds: new Array(newCount).fill(this.props.initialV) });
  };

  handleVelocityChange = newMultiplier => {
    this.setState({ velocityMultiplier: newMultiplier });
  };

  handleCollision = (node1, node2) => {
    // NOTE: velocity isn't conserved, energy is
    const speeds = [...this.state.speeds];
    speeds[node1.i] =
      euclideanDistance(node1.vx, node1.vy) / this.state.velocityMultiplier;
    speeds[node2.i] =
      euclideanDistance(node2.vx, node2.vy) / this.state.velocityMultiplier;
    this.setState({ speeds });
  };

  render() {
    const { playing, paused, speeds, velocityMultiplier } = this.state;
    const { width, height, padding, initialV } = this.props;
    const header = playing ? (
      <SimulationStop
        handleStop={this.handleStop}
        handlePause={this.handlePause}
        handleVelocityChange={this.handleVelocityChange}
        velocityMultiplier={velocityMultiplier}
      />
    ) : (
      <SimulationStart
        handleStart={this.handleStart}
        handleSpeedCount={this.handleSpeedCount}
        nodeCount={speeds.length}
      />
    );
    return (
      <StyledNarrowContainer width="60%">
        {header}
        <div>
          <ClippedSVG
            width={width}
            height={height}
            padding={padding}
            id="simulation"
            borderColor={COLORS.MAROON}
            borderWidth="3px"
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
      </StyledNarrowContainer>
    );
  }
}

EconomySimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  initialV: PropTypes.number.isRequired
};

EconomySimulation.defaultProps = {
  width: 600,
  height: 600,
  padding: 0,
  initialV: 10
};

export default withCaption(EconomySimulation);
