import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Button, FlexContainer, Icon } from "story_components";
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

  render() {
    const { labels, handleSelectConfirm, buttonText } = this.props;
    const { selectedIndex } = this.state;
    const options = labels.map((obj, i) => (
      <FlexContainer key={obj.text}>
        <input
          name="group"
          type="radio"
          id={i}
          value={i}
          checked={selectedIndex === i}
          onChange={this.handleRadioChange}
          hidden
        />
        <label htmlFor={i}>
          <StyledIconWrapper color={obj.color}>
            {selectedIndex === i ? <Icon name="check" /> : null}
          </StyledIconWrapper>
        </label>
        <p>{obj.text}</p>
      </FlexContainer>
    ));
    let footer = <em>Please make a selection.</em>;
    if (selectedIndex !== null) {
      let color = labels[selectedIndex].color;
      footer = (
        <Button
          onClick={() => handleSelectConfirm(selectedIndex)}
          color={color}
        >
          {buttonText}
        </Button>
      );
    }
    return (
      <div>
        {options}
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
