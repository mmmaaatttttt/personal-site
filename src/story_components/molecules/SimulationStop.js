import React from "react";
import PropTypes from "prop-types";
import Button from "../atoms/Button";
import FlexContainer from "../atoms/FlexContainer";
import LabeledSlider from "../organisms/LabeledSlider";
import COLORS from "../../utils/styles";

const SimulationStop = ({
  handlePause,
  handleStop,
  handleVelocityChange,
  handleShowingSimulation,
  velocityMultiplier,
  showingSimulation
}) => {
  const btnText = showingSimulation ? "Show Bar Chart" : "Show Simulation";
  return (
    <FlexContainer column main="center">
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
      <FlexContainer>
        <Button onClick={handlePause} color={COLORS.ORANGE}>
          Pause
        </Button>
        <Button onClick={handleShowingSimulation} color={COLORS.BLUE}>
          {btnText}
        </Button>
        <Button onClick={handleStop} color={COLORS.RED}>
          Reset
        </Button>
      </FlexContainer>
    </FlexContainer>
  );
};

SimulationStop.propTypes = {
  handleStop: PropTypes.func.isRequired,
  handlePause: PropTypes.func.isRequired,
  handleVelocityChange: PropTypes.func.isRequired,
  handleShowingSimulation: PropTypes.func.isRequired,
  velocityMultiplier: PropTypes.number.isRequired,
  showingSimulation: PropTypes.bool.isRequired
};

export default SimulationStop;
