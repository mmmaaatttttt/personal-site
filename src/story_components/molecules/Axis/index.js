import React, { Component } from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft } from "d3-axis";
import { select, selectAll } from "d3-selection";
import { range } from "d3-array";
import { format } from "d3-format";
import styled, { css } from "styled-components";

const StyledAxis = styled.g`
  .tick text {
    font-size: 16px;
  }

  & .tick line {
    stroke: #ccc;
    stroke-dasharray: 10, 5;
  }
`;

class Axis extends Component {
  constructor(props) {
    super(props);
    this.drawAxis = this.drawAxis.bind(this);
  }

  componentDidMount() {
    this.drawAxis();
  }

  componentDidUpdate() {
    this.drawAxis();
  }

  drawAxis() {
    const {
      direction,
      scale,
      xShift,
      yShift,
      tickSize,
      tickShift,
      tickStep,
      tickFormat
    } = this.props;
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
    if (tickStep)
      axis.tickValues(
        range(scale.domain()[0], scale.domain()[1] + tickStep, tickStep)
      );
    select(this.axis)
      .attr("transform", `translate(${xShift},${yShift})`)
      .call(axis)
      .selectAll(".tick line")
      .attr("transform", `translate(0,${tickShift})`);

    if (tickFormat) {
      const labels = select(this.axis).selectAll(".tick text");
      if (direction === "x")
        labels
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start")
          .attr("x", "9")
          .attr("y", 0)
          .attr("dx", 0)
          .attr("dy", "0.35em");
      else labels.style("text-anchor", "end");
    }
  }

  render() {
    const { direction, tickFormat } = this.props;
    return (
      <StyledAxis
        innerRef={axis => (this.axis = axis)}
        direction={direction}
        tickFormat={tickFormat}
      />
    );
  }
}

Axis.propTypes = {
  direction: PropTypes.string.isRequired,
  scale: PropTypes.func.isRequired,
  yShift: PropTypes.number.isRequired,
  xShift: PropTypes.number.isRequired,
  tickSize: PropTypes.number,
  tickShift: PropTypes.number.isRequired,
  tickStep: PropTypes.number,
  tickFormat: PropTypes.string.isRequired
};

Axis.defaultProps = {
  xShift: 0,
  yShift: 0,
  tickShift: 0,
  tickFormat: ""
};

export default Axis;
