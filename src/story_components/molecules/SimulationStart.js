import React, { Component } from "react";
import PropTypes from "prop-types";
import LabeledSlider from "../organisms/LabeledSlider";
import COLORS from "../../utils/styles";

class SimulationStart extends Component {
  render() {
    const { handleStart, handlePersonCount, personCount } = this.props;
    return (
      <div>
        <LabeledSlider
          handleValueChange={handlePersonCount}
          title="Population Size"
          value={personCount}
          min={2}
          max={50}
          step={1}
          color={COLORS.MAROON}
          tickCount={2}
          minIcon="user"
          maxIcon="users"
        />
        <button onClick={handleStart}>start</button>
      </div>
    );
  }
}

SimulationStart.propTypes = {
  handleStart: PropTypes.func.isRequired,
  handlePersonCount: PropTypes.func.isRequired
};

export default SimulationStart;
