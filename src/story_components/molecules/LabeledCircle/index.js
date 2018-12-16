import React, { Component } from "react";
import PropTypes from "prop-types";
import { CenteredSVGText } from "story_components";
import COLORS from "utils/styles";

class LabeledCircle extends Component {
  render() {
    const { x, y, color, label, r } = this.props;
    return (
      <g>
        <circle cx={x} cy={y} fill={color} r={r} />
        <CenteredSVGText x={x} y={y}>{label}</CenteredSVGText>
      </g>
    );
  }
}

LabeledCircle.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  r: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

LabeledCircle.defaultProps = {
  color: COLORS.DARK_GRAY,
  label: "",
  x: 0,
  y: 0,
  r: 15
};

export default LabeledCircle;
