import React, { Component } from "react";
import PropTypes from "prop-types";
import COLORS from "utils/styles";

class SVGBorder extends Component {
  render() {
    const { width, height, borderStroke, borderWidth } = this.props;
    return (
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke={borderStroke}
        strokeWidth={borderWidth}
        fill="none"
      />
    );
  }
}

SVGBorder.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  borderStroke: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
};

SVGBorder.defaultProps = {
  width: 600,
  height: 600,
  borderStroke: COLORS.GRAY,
  borderWidth: 3
};

export default SVGBorder;
