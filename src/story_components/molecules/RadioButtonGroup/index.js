import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Button, FlexContainer, Icon, Strikethrough } from "story_components";
import COLORS from "../../../utils/styles";

const StyledIconWrapper = styled.span`
  background-color: ${props => props.color};
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  border: 0.1rem solid ${COLORS.BLACK};
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 2px;
  padding-top: 2px;

  &:hover {
    cursor: pointer;
  }

  ${props =>
    props.disabled &&
    css`
      &:hover {
        cursor: not-allowed;
      }
    `}
`;

class RadioButtonGroup extends Component {
  state = {
    selectedIndex: null
  };

  /** Maintain current radio selection in React state */
  handleRadioChange = e => {
    this.setState({ selectedIndex: +e.target.value }, () => {
      this.props.handleRadioChange(this.state.selectedIndex);
    });
  };

  /** Reset the selectedIndex state, call handleSelectConfirm from props  */
  handleConfirm = () => {
    let confirmedIndex = this.state.selectedIndex;
    let { handleSelectConfirm } = this.props;
    this.setState({ selectedIndex: null }, () =>
      handleSelectConfirm(confirmedIndex)
    );
  };

  render() {
    const { labels, handleSelectConfirm, buttonText } = this.props;
    const { selectedIndex } = this.state;
    const options = labels.map((obj, i) => {
      let { text, color, disabled } = obj;
      let textContainer = <span>{text}</span>;
      let icon = (
        <StyledIconWrapper color={color}>
          {selectedIndex === i ? <Icon name="check" /> : null}
        </StyledIconWrapper>
      );
      if (disabled) {
        textContainer = <Strikethrough>{text}</Strikethrough>;
        icon = (
          <StyledIconWrapper color={COLORS.RED} disabled>
            <Icon name="times" />
          </StyledIconWrapper>
        );
      }
      return (
        <FlexContainer key={text} width="90%" margin="0 1% 3% 1%">
          <input
            name="group"
            type="radio"
            id={i}
            value={i}
            checked={selectedIndex === i}
            onChange={this.handleRadioChange}
            hidden
            disabled={disabled}
          />
          <label htmlFor={i}>{icon}</label>
          {textContainer}
        </FlexContainer>
      );
    });
    let footer = <Button disabled>Please make a selection.</Button>;
    if (selectedIndex !== null) {
      let color = labels[selectedIndex].color;
      footer = (
        <Button onClick={this.handleConfirm} color={color}>
          {buttonText}
        </Button>
      );
    }
    return (
      <div>
        <FlexContainer main="center" cross="center" width="100%">
          {options}
        </FlexContainer>
        {footer}
      </div>
    );
  }
}

RadioButtonGroup.propTypes = {
  buttonText: PropTypes.string.isRequired,
  handleSelectConfirm: PropTypes.func.isRequired,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      color: PropTypes.string,
      disabled: PropTypes.bool
    })
  ).isRequired
};

RadioButtonGroup.defaultProps = {
  buttonText: "Default button text",
  handleSelectConfirm: idx => console.log(idx),
  labels: [
    {
      text: "test1",
      color: COLORS.WHITE,
      disabled: false
    },
    {
      text: "test2",
      color: COLORS.WHITE,
      disabled: false
    },
    {
      text: "test3",
      color: COLORS.WHITE,
      disabled: false
    }
  ]
};

export default RadioButtonGroup;
