import React, { Component } from "react";
import SimulationStart from "../molecules/SimulationStart";
import SimulationStop from "../molecules/SimulationStop";
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
    const header = this.state.playing ? (
      <SimulationStop
        handleStop={this.handleStop}
        handlePause={this.handlePause}
      />
    ) : (
      <SimulationStart
        handleStart={this.handleStart}
        handlePersonCount={this.handlePersonCount}
        personCount={this.state.personCount}
      />
    );
    return (
      <div>
        {header}
        <div>
          <p>Playing: {this.state.playing.toString()}</p>
          <p>Paused: {this.state.paused.toString()}</p>
        </div>
      </div>
    );
  }
}

export default withCaption(EconomySimulation);
