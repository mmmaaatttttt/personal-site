import React from "react";
import PropTypes from "prop-types";
import LabeledSlider from "../organisms/LabeledSlider";
import StyledButton from "../atoms/StyledButton";
import StyledFlexContainer from "../atoms/StyledFlexContainer";
import COLORS from "../../utils/styles";

const SimulationStart = ({
  handleStart,
  handleSpeedCount,
  nodeCount,
  editSavings,
  handleSavingsChange,
  savingsRate
}) => (
  <StyledFlexContainer column main="center">
    <LabeledSlider
      handleValueChange={handleSpeedCount}
      title="Population Size"
      value={nodeCount}
      min={2}
      max={30}
      step={1}
      color={COLORS.MAROON}
      tickCount={2}
      minIcon="user"
      maxIcon="users"
      fadeIcons={false}
    />
    {editSavings ? (
      <LabeledSlider
        handleValueChange={handleSavingsChange}
        title="Savings Rate"
        value={savingsRate}
        min={0}
        max={1}
        step={0.01}
        color={COLORS.MAROON}
        tickCount={2}
        minIcon="thermometer-empty"
        maxIcon="thermometer-full"
        fadeIcons={false}
      />
    ) : null}
    <StyledButton onClick={handleStart} color={COLORS.MAROON}>
      Start
    </StyledButton>
  </StyledFlexContainer>
);

SimulationStart.propTypes = {
  handleStart: PropTypes.func.isRequired,
  handleSpeedCount: PropTypes.func.isRequired,
  nodeCount: PropTypes.number.isRequired,
  editSavings: PropTypes.bool.isRequired,
  handleSavingsChange: PropTypes.func.isRequired,
  savingsRate: PropTypes.number.isRequired
};

SimulationStart.defaultProps = {
  editSavings: false,
  savingsRate: 0
};

export default SimulationStart;
