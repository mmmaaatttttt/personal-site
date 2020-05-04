import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";
import styled from "styled-components";

const StyledAxis = styled.g`
  .tick text {
    font-size: ${props => props.fontSize};
  }

  & .tick line {
    stroke: ${props => props.tickColor};
    stroke-dasharray: 10, 5;
    pointer-events: none;
  }
`;

const initialLabelPosition = {
  x: "0",
  y: "0",
  dx: "0",
  dy: "0"
};

function Axis({
  direction = "x",
  fontSize = "0.8rem",
  labelPosition = initialLabelPosition,
  scale = () => {
    console.warn("Axis needs a scale.");
  },
  textAnchor = "middle",
  tickColor = "#ccc",
  tickShift = 0,
  tickSize = 0,
  tickStep = 0,
  tickFormat = "",
  rotateLabels = false,
  xShift = 0,
  yShift = 0
}) {
  const axisRef = useRef(null);

  useEffect(() => {
    const settings = {
      x: {
        axis: axisBottom
      },
      y: {
        axis: axisLeft
      }
    };

    const axis = settings[direction]
      .axis(scale)
      .tickFormat(tickFormat ? format(tickFormat) : "");
    if (tickSize) {
      axis.tickSize(tickSize).tickSizeOuter(0);
    }
    if (tickStep) {
      let domain = scale.domain();
      axis.tickValues(range(domain[0], domain[1] + tickStep, tickStep));
    }

    let transform = `translate(0,${tickShift})`;
    if (direction === "y") transform = `translate(${tickShift}, 0)`;

    select(axisRef.current)
      .attr("transform", `translate(${xShift - 0.5},${yShift - 0.5})`)
      .call(axis)
      .selectAll(".tick line")
      .attr("transform", transform);

    if (tickFormat) {
      const labels = select(axisRef.current).selectAll(".tick text");
      labels.style("text-anchor", textAnchor);
      if (rotateLabels) {
        labels.attr("transform", "rotate(90)");
      }

      // fine-tune text label position via x, y, dx, dy attrs
      for (let attr in labelPosition) {
        labels.attr(attr, labelPosition[attr]);
      }
    }
  }, [
    direction,
    labelPosition,
    rotateLabels,
    scale,
    textAnchor,
    tickFormat,
    tickShift,
    tickSize,
    tickStep,
    xShift,
    yShift
  ]);

  return <StyledAxis fontSize={fontSize} ref={axisRef} tickColor={tickColor} />;
}

Axis.propTypes = {
  direction: PropTypes.oneOf(["x", "y"]),
  fontSize: PropTypes.string,
  labelPosition: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    dx: PropTypes.string,
    dy: PropTypes.string
  }),
  scale: PropTypes.func,
  textAnchor: PropTypes.oneOf(["start", "middle", "end"]),
  tickColor: PropTypes.string,
  tickSize: PropTypes.number,
  tickShift: PropTypes.number,
  tickStep: PropTypes.number,
  tickFormat: PropTypes.string,
  rotateLabels: PropTypes.bool,
  xShift: PropTypes.number,
  yShift: PropTypes.number
};

export default Axis;
