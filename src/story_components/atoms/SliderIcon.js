import React from "react";
import PropTypes from "prop-types";
import StyledDisabledIcon from "./StyledDisabledIcon";

const SliderIcon = ({ name, color, opacity }) => (
  <StyledDisabledIcon className={`fa fa-${name}`} style={{ color, opacity }} />
);

SliderIcon.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  opacity: PropTypes.number.isRequired
};

SliderIcon.defaultProps = {
  color: "#000",
  opacity: 1
};

export default SliderIcon;
