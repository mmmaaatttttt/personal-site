import React, { Component } from "react";
import PropTypes from "prop-types";
import SimulationStart from "../molecules/SimulationStart";
import SimulationStop from "../molecules/SimulationStop";
import ClippedSVG from "../atoms/ClippedSVG";
import EconomyForceGraph from "../molecules/EconomyForceGraph";
import withCaption from "../../hocs/withCaption";

class EconomySimulation extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false, paused: false, personCount: 2 };
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handlePersonCount = this.handlePersonCount.bind(this);
  }

  handleStart() {
    this.setState({ playing: true });
  }

  handleStop() {
    this.setState({ playing: false, paused: false });
  }

  handlePause() {
    this.setState({ paused: !this.state.paused });
  }

  handlePersonCount(newCount) {
    this.setState({ personCount: newCount });
  }

  render() {
    const { playing, paused, personCount } = this.state;
    const { width, height, padding } = this.props;
    const header = playing ? (
      <SimulationStop
        handleStop={this.handleStop}
        handlePause={this.handlePause}
      />
    ) : (
      <SimulationStart
        handleStart={this.handleStart}
        handlePersonCount={this.handlePersonCount}
        personCount={personCount}
      />
    );
    return (
      <div>
        {header}
        <div>
          <p>Playing: {playing.toString()}</p>
          <p>Paused: {paused.toString()}</p>
          <ClippedSVG
            width={width}
            height={height}
            padding={padding}
            id="simulation"
          >
            <EconomyForceGraph
              people={personCount}
              cx={width / 2}
              cy={height / 2}
              playing={playing}
              paused={paused}
            />
          </ClippedSVG>
        </div>
      </div>
    );
  }
}

EconomySimulation.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

EconomySimulation.defaultProps = {
  width: 600,
  height: 600,
  padding: 20
};

export default withCaption(EconomySimulation);
