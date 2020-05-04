import React, { useContext } from "react";
import PropTypes from "prop-types";
import COLORS from "utils/styles";
import { SVGContext } from "contexts";

function SVGBorder({
  borderStroke = COLORS.GRAY,
  borderWidth = 3
}) {
  const { width, height } = useContext(SVGContext);
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

SVGBorder.propTypes = {
  borderStroke: PropTypes.string,
  borderWidth: PropTypes.number
};

export default SVGBorder;
