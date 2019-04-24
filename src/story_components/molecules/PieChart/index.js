import React from "react";
import PropTypes from "prop-types";
import { arc, pie } from "d3-shape";
import { format } from "d3-format";
import NodeGroup from "react-move/NodeGroup";
import { ClippedSVG } from "story_components";

const PieChart = ({
  children,
  colorScale,
  height,
  padding,
  showLabels,
  stroke,
  textFill,
  values,
  width
}) => {
  const radius = width / 2 - padding;
  const arcs = pie().sortValues(
    (a, b) => values.indexOf(a) - values.indexOf(b)
  )(values);
  const pathArc = arc()
    .innerRadius(0)
    .outerRadius(radius);
  const paths = (
    <NodeGroup
      data={arcs}
      keyAccessor={(_, i) => i}
      start={({ startAngle }) => ({ startAngle, endAngle: startAngle })}
      enter={({ endAngle }) => ({
        endAngle: [endAngle],
        timing: { duration: 500 }
      })}
      update={({ startAngle, endAngle }) => ({
        startAngle: [startAngle],
        endAngle: [endAngle],
        timing: { duration: 500 }
      })}
    >
      {arcNodes => (
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcNodes.map(({ key, _, state }) => (
            <path
              d={pathArc(state)}
              fill={colorScale(key)}
              stroke={stroke}
              strokeWidth="3px"
              key={key}
            />
          ))}
          {showLabels &&
            arcNodes.map(({ key, _, state }) => {
              const { startAngle, endAngle } = state;
              const textCenter = pathArc.centroid(state);
              const angleDiff = endAngle - startAngle;
              const percentage = angleDiff / (2 * Math.PI);
              return (
                percentage > 0.05 && (
                  <text
                    transform={`translate(${textCenter.toString()})`}
                    textAnchor="middle"
                    fontSize="24"
                    fill={textFill}
                    key={key}
                  >
                    {format(".1%")(percentage)}
                  </text>
                )
              );
            })}
        </g>
      )}
    </NodeGroup>
  );
  return (
    <div>
      <ClippedSVG id="pie" width={width} height={height}>
        {paths}
        {children}
      </ClippedSVG>
    </div>
  );
};

PieChart.propTypes = {
  colorScale: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  showLabels: PropTypes.bool.isRequired,
  stroke: PropTypes.string.isRequired,
  textFill: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired
};

PieChart.defaultProps = {
  height: 600,
  padding: 0,
  showLabels: true,
  stroke: "white",
  textFill: "white",
  width: 600
};

export default PieChart;
