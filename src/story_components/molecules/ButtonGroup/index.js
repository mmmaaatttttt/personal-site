import React from "react";
import PropTypes from "prop-types";
import { FlexContainer, Button } from "story_components";

const ButtonGroup = ({ data }) => {
  const buttons = data.map((d, i) => (
    <Button
      key={d.hasOwnProperty("key") ? d.key : i}
      color={d.color}
      onClick={d.handleClick}
    >
      {d.buttonText}
    </Button>
  ));
  return <FlexContainer main="center">{buttons}</FlexContainer>;
};

ButtonGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.any,
      color: PropTypes.string,
      buttonText: PropTypes.string.isRequired,
      handleClick: PropTypes.func.isRequired
    })
  )
};

export default ButtonGroup;
