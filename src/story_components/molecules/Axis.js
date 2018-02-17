import React, { Component } from "react";
import PropTypes from "prop-types";
import { axisBottom, axisLeft } from "d3-axis";
import { select } from "d3-selection";
import { range } from "d3-array";
import styled, { css } from "styled-components";

const StyledAxis = styled.g`
  & .tick line {
    stroke: #ccc;
    stroke-dasharray: 10, 5;
  }
  ${props =>
    props.direction === "x" &&
    css`
      & .tick:nth-child(2) {
        display: none;
      }
    `};
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
      tickStep
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
      .tickFormat("")
      .tickSize(tickSize)
      .tickSizeOuter(0);
    if (tickStep)
      axis.tickValues(
        range(scale.domain()[0], scale.domain()[1] + tickStep, tickStep)
      );
    select(this.axis)
      .attr("transform", `translate(${xShift},${yShift})`)
      .call(axis)
      .selectAll(".tick line")
      .attr("transform", `translate(0,${tickShift})`);
  }

  render() {
    return (
      <StyledAxis
        innerRef={axis => (this.axis = axis)}
        direction={this.props.direction}
      />
    );
  }
}

Axis.propTypes = {
  direction: PropTypes.string.isRequired,
  scale: PropTypes.func.isRequired,
  yShift: PropTypes.number.isRequired,
  xShift: PropTypes.number.isRequired,
  tickSize: PropTypes.number.isRequired,
  tickShift: PropTypes.number.isRequired,
  tickStep: PropTypes.number
};

Axis.defaultProps = {
  xShift: 0,
  yShift: 0,
  tickShift: 0
};

export default Axis;
