import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { Button, FlexContainer, Icon, Strikethrough } from "story_components";
import COLORS from "utils/styles";
import { noop } from "utils/fnHelpers";

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

const defaultConfirm = idx => console.log(idx);
const defaultLabels = [
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
];

function RadioButtonGroup({
  buttonText = "Default button text",
  handleSelectConfirm = defaultConfirm,
  handleRadioChange = noop,
  labels = defaultLabels
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  /** Maintain current radio selection in React state */
  const radioChange = useCallback(
    e => {
      const idx = +e.target.value;
      setSelectedIndex(idx);
      handleRadioChange(idx);
    },
    [handleRadioChange]
  );

  /** Reset the selectedIndex state, call handleSelectConfirm from props  */
  const handleConfirm = useCallback(() => {
    handleSelectConfirm(selectedIndex);
    setSelectedIndex(null);
  }, [selectedIndex, handleSelectConfirm]);

  const options = labels.map(({ text, color, disabled }, i) => {
    let textContainer = <span>{text}</span>;
    let icon = (
      <StyledIconWrapper color={color}>
        {selectedIndex === i && <Icon name="check" />}
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
      <FlexContainer
        key={text}
        width="90%"
        margin="-2% 1% 0 1%"
        main="center"
        cross="center"
      >
        <input
          name="group"
          type="radio"
          id={i}
          value={i}
          checked={selectedIndex === i}
          onChange={radioChange}
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
      <Button onClick={handleConfirm} color={color}>
        {buttonText}
      </Button>
    );
  }
  return (
    <div>
      <FlexContainer main="space-around" cross="center" width="100%" shouldWrap>
        {options}
      </FlexContainer>
      {footer}
    </div>
  );
}

RadioButtonGroup.propTypes = {
  buttonText: PropTypes.string,
  handleSelectConfirm: PropTypes.func,
  labels: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      color: PropTypes.string,
      disabled: PropTypes.bool
    })
  )
};

export default React.memo(RadioButtonGroup);
