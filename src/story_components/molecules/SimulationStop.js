import React, { Component } from "react";
import PropTypes from "prop-types";

class SimulationStop extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.handlePause}>pause</button>
        <button onClick={this.props.handleStop}>reset</button>
      </div>
    );
  }
}

SimulationStop.propTypes = {
  handleStop: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired
};

export default SimulationStop;
