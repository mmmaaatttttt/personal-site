import React from "react";
import PropTypes from "prop-types";
import { line, curveNatural, curveLinear } from "d3-shape";
import { scaleLinear } from "d3-scale";
import COLORS from "utils/styles";

const curves = { curveNatural, curveLinear };

const LinePlot = ({
  curve,
  graphData,
  opacity,
  stroke,
  strokeWidth,
  xScale,
  yScale,
}) => {
  const linePath = line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(curves[curve]);

  const truncateData = () =>
    graphData.map(d => {
      let newY = d.y;
      const yDomain = yScale.domain();
      if (newY > yDomain[1]) newY = yDomain[1] * 1.1;
      if (newY < yDomain[0]) newY = yDomain[0] * 1.1;
      return { ...d, y: newY };
    });

  return (
    <path
      d={linePath(truncateData())}
      strokeWidth={strokeWidth}
      stroke={stroke}
      fill="none"
      opacity={opacity}
    />
  );
};

LinePlot.propTypes = {
  curve: PropTypes.oneOf(Object.keys(curves)),
  graphData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  opacity: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number.isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
};

LinePlot.defaultProps = {
  curve: "curveNatural",
  graphData: [{ x: 0, y: 0 }, { x: 100, y: 100 }],
  opacity: "1",
  strokeWidth: 5,
  stroke: COLORS.ORANGE,
  xScale: scaleLinear(),
  yScale: scaleLinear()
};

export default LinePlot;
