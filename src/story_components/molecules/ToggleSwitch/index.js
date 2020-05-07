import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import COLORS from "utils/styles";

// styling from here:
// https://speckyboy.com/css-toggle-switches/
const StyledToggleSwitchLabel = styled.label`
  display: inline-block;
  position: relative;
  cursor: pointer;
  outline: none;
  user-select: none;
  padding: 0.125rem;
  margin: 0 0.5rem;
  width: 4rem;
  height: 2rem;
  background-color: ${props =>
    props.checked ? props.rightColor : props.leftColor};
  border-radius: 2rem;
  transition: background 0.4s;

  &:before,
  &:after {
    display: block;
    position: absolute;
    content: "";
  }

  &:before {
    top: 0.15rem;
    left: 0.15rem;
    bottom: 0.15rem;
    right: 0.15rem;
    background-color: white;
    border-radius: 2rem;
    transition: background 0.4s;
  }

  &:after {
    top: 0.25rem;
    left: 0.25rem;
    bottom: 0.25rem;
    width: 1.5rem;
    background-color: ${props =>
      props.checked ? props.rightColor : props.leftColor};
    border-radius: 1.5rem;
    transition: background 0.4s, margin 0.4s;
    ${props =>
      props.checked &&
      css`
        margin-left: 2rem;
      `}
  }
`;

const StyledToggleSwitchInput = styled.input`
  position: absolute;
  margin-left: -1000rem;
  visibility: hidden;
`;

const StyledToggleSwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledSpan = styled.span`
  flex: 1;
  text-align: ${props => props.direction};
`;

function ToggleSwitch({
  checked = false,
  leftText = "Left",
  rightText = "Right",
  leftColor = COLORS.DARK_GRAY,
  rightColor = COLORS.DARK_GRAY,
  handleSwitchChange = console.log
}) {
  return (
    <StyledToggleSwitchWrapper>
      <StyledSpan direction="right">{leftText}</StyledSpan>
      <StyledToggleSwitchInput />
      <StyledToggleSwitchLabel
        checked={checked}
        onClick={handleSwitchChange}
        leftColor={leftColor}
        rightColor={rightColor}
      />
      <StyledSpan direction="left">{rightText}</StyledSpan>
    </StyledToggleSwitchWrapper>
  );
}

ToggleSwitch.propTypes = {
  checked: PropTypes.bool,
  leftText: PropTypes.string,
  rightText: PropTypes.string,
  leftColor: PropTypes.string,
  rightColor: PropTypes.string,
  handleSwitchChange: PropTypes.func
};

export default React.memo(ToggleSwitch);
