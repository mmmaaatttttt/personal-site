import React from "react";
import PropTypes from "prop-types";

const LinePlot = props => (
  <path
    d={props.d}
    strokeWidth={props.strokeWidth}
    stroke={props.stroke}
    fill="none"
  />
);

LinePlot.propTypes = {
  d: PropTypes.string.isRequired,
  strokeWidth: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired
};

LinePlot.defaultProps = {
  strokeWidth: "5"
};

export default LinePlot;
