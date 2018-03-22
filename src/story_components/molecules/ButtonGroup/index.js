import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Button } from "story_components";

const ButtonGroup = ({ data }) => {
  const buttons = data.map(d => (
    <Button key={d.key} color={d.color} onClick={d.handleClick} />
  ));
  return <FlexContainer>{buttons}</FlexContainer>;
};

ButtonGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any.isRequired,
      color: PropTypes.string.isRequired,
      handleValueChange: PropTypes.func.isRequired
    })
  )
};

export default ButtonGroup;
