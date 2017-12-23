import React, { Component } from "react";
import PropTypes from "prop-types";
import LabeledSlider from "../organisms/LabeledSlider";

class SimulationStart extends Component {
  render() {
    return (
      <div>
        <LabeledSlider />
        <button onClick={this.props.handleStart}>start</button>
      </div>
    );
  }
}

SimulationStart.propTypes = {
  handleStart: PropTypes.func.isRequired
};

export default SimulationStart;
