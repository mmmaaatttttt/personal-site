import React, { Component } from "react";
import PropTypes from "prop-types";
import LabeledSlider from "../organisms/LabeledSlider";
import StyledButton from "../atoms/StyledButton";
import StyledFlexContainer from "../atoms/StyledFlexContainer";
import COLORS from "../../utils/styles";

class SimulationStart extends Component {
  render() {
    const { handleStart, handleSpeedCount, nodeCount } = this.props;
    return (
      <StyledFlexContainer column main="center">
        <LabeledSlider
          handleValueChange={handleSpeedCount}
          title="Population Size"
          value={nodeCount}
          min={2}
          max={50}
          step={1}
          color={COLORS.MAROON}
          tickCount={2}
          minIcon="user"
          maxIcon="users"
          fadeIcons={false}
        />
        <StyledButton onClick={handleStart} color={COLORS.MAROON}>
          Start
        </StyledButton>
      </StyledFlexContainer>
    );
  }
}

SimulationStart.propTypes = {
  handleStart: PropTypes.func.isRequired,
  handleSpeedCount: PropTypes.func.isRequired,
  nodeCount: PropTypes.number.isRequired
};

export default SimulationStart;
