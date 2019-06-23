import React, { Component } from "react";
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
`

class ToggleSwitch extends Component {
  state = {
    checked: false
  };

  handleClick = () => {
    this.setState(
      prevState => ({ checked: !prevState.checked }),
      () => this.props.handleSwitchChange(this.state.checked)
    );
  };

  render() {
    const { checked } = this.state;
    const { leftText, rightText, leftColor, rightColor } = this.props;
    return (
      <StyledToggleSwitchWrapper>
        <StyledSpan direction="right">{leftText}</StyledSpan>
        <StyledToggleSwitchInput />
        <StyledToggleSwitchLabel
          checked={checked}
          onClick={this.handleClick}
          leftColor={leftColor}
          rightColor={rightColor}
        />
        <StyledSpan direction="left">{rightText}</StyledSpan>
      </StyledToggleSwitchWrapper>
    );
  }
}

ToggleSwitch.propTypes = {
  leftText: PropTypes.string.isRequired,
  rightText: PropTypes.string.isRequired,
  leftColor: PropTypes.string.isRequired,
  rightColor: PropTypes.string.isRequired,
  handleSwitchChange: PropTypes.func.isRequired
};

ToggleSwitch.defaultProps = {
  leftText: "Left",
  rightText: "Right",
  leftColor: COLORS.DARK_GRAY,
  rightColor: COLORS.DARK_GRAY,
  handleSwitchChange: checked => console.log(checked)
};

export default ToggleSwitch;
