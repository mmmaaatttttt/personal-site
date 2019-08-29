import React from "react";
import PropTypes from "prop-types";
import { scaleLinear, scaleBand } from "d3-scale";
import { max } from "d3-array";
import { NarrowContainer, ClippedSVG, TranslucentRect } from "story_components";
import COLORS, { paddingObj } from "utils/styles";
import { paddingType } from "utils/types";

function HorizontalBarGraph({
  containerWidth,
  data,
  height,
  id,
  padding,
  width
}) {
  padding = paddingObj(padding);
  const absXMax = max(data, d => Math.abs(d.width));
  const xScale = scaleLinear()
    .domain([0, absXMax])
    .range([(width - padding.left - padding.right) / 2, width - padding.right]);
  const yScale = scaleBand()
    .domain(data.map((_, i) => i))
    .rangeRound([padding.top, height - padding.bottom]);

  return (
    <NarrowContainer width={containerWidth}>
      <ClippedSVG id={id} width={width} height={height}>
        {data.map((d, i) => (
          <g key={d.caption}>
            <TranslucentRect
              x={xScale(Math.min(d.width, 0))}
              width={xScale(Math.abs(d.width)) - xScale(0)}
              height={yScale.step() * 0.9}
              y={yScale(i) + yScale.step() * 0.1}
              fill={d.fill}
            />
            <text
              x={xScale(0)}
              y={yScale(i)}
              fill={d.fill}
              dominantBaseline="middle"
              dy={yScale.step() * 0.53}
              dx={-1 * Math.sign(d.width) * 5}
              textAnchor={d.width < 0 ? "start" : "end"}
            >
              {d.caption}
            </text>
            <text
              x={xScale(d.width)}
              y={yScale(i) + yScale.step() * 0.1}
              fill={COLORS.WHITE}
              dominantBaseline="middle"
              dy={yScale.step() * 0.55}
              dx={-1 * Math.sign(d.width) * 5}
              textAnchor={d.width < 0 ? "start" : "end"}
            >
              {Math.abs(d.width).toFixed(1)}
            </text>
          </g>
        ))}
        <line
          x1={xScale(0)}
          x2={xScale(0)}
          y1={0}
          y2={height}
          stroke={COLORS.BLACK}
          strokeWidth={3}
        />
      </ClippedSVG>
    </NarrowContainer>
  );
}

HorizontalBarGraph.propTypes = {
  containerWidth: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      caption: PropTypes.string.isRequired,
      fill: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired
    })
  ).isRequired,
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  padding: paddingType,
  width: PropTypes.number.isRequired
};

HorizontalBarGraph.defaultProps = {
  containerWidth: "60%",
  data: [],
  height: 600,
  id: "horizontal-bar-graph",
  padding: 0,
  width: 600
};

export default HorizontalBarGraph;
