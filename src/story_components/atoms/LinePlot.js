import React from "react";
import PropTypes from "prop-types";
import { line, curveNatural } from "d3-shape";

const LinePlot = ({ graphData, xScale, yScale, stroke, strokeWidth }) => {

  const linePath = line()
    .x(d => xScale(d.x))
    .y(d => yScale(d.y))
    .curve(curveNatural);

  const truncateData = () => graphData.map(d => {
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
    />
  )
};

LinePlot.propTypes = {
  graphData: PropTypes.arrayOf(
    PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    })
  ).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired,
  strokeWidth: PropTypes.string.isRequired,
  stroke: PropTypes.string.isRequired
};

LinePlot.defaultProps = {
  strokeWidth: "5"
};

export default LinePlot;
