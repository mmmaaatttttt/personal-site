import React, { Component } from "react";
import PropTypes from "prop-types";
import StyledButton from "../atoms/StyledButton";
import StyledFlexContainer from "../atoms/StyledFlexContainer";
import LabeledSlider from "../organisms/LabeledSlider";
import COLORS from "../../utils/styles";

class SimulationStop extends Component {
  render() {
    const {
      handlePause,
      handleStop,
      handleVelocityChange,
      handleShowingSimulation,
      velocityMultiplier,
      showingSimulation
    } = this.props;
    const btnText = showingSimulation ? "Show Bar Chart" : "Show Simulation";
    return (
      <StyledFlexContainer column main="center">
        <LabeledSlider
          handleValueChange={handleVelocityChange}
          title="Average Wealth (a.k.a. Average Speed)"
          value={velocityMultiplier}
          min={0.1}
          max={2}
          step={0.1}
          color={COLORS.MAROON}
          tickCount={2}
          minIcon="step-forward"
          maxIcon="fast-forward"
          fadeIcons={false}
        />
        <StyledFlexContainer>
          <StyledButton onClick={handlePause} color={COLORS.ORANGE}>
            Pause
          </StyledButton>
          <StyledButton onClick={handleShowingSimulation} color={COLORS.BLUE}>
            {btnText}
          </StyledButton>
          <StyledButton onClick={handleStop} color={COLORS.RED}>
            Reset
          </StyledButton>
        </StyledFlexContainer>
      </StyledFlexContainer>
    );
  }
}

SimulationStop.propTypes = {
  handleStop: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  handleVelocityChange: PropTypes.func.isRequired,
  velocityMultiplier: PropTypes.number.isRequired
};

export default SimulationStop;
