import React, { Component } from "react";
import PropTypes from "prop-types";

class SimulationStart extends Component {
  render() {
    return <button onClick={this.props.handleStart}>start</button>;
  }
}

SimulationStart.propTypes = {
  handleStart: PropTypes.func.isRequired
};

export default SimulationStart;
