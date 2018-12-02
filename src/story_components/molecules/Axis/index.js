import React, { Component } from "react";
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
      labelPosition,
      scale,
      xShift,
      yShift,
      textAnchor,
      tickSize,
      tickShift,
      tickStep,
      tickFormat,
      rotateLabels
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
    if (tickStep) {
      let domain = scale.domain();
      axis.tickValues(
        range(domain[0], domain[1] + tickStep, tickStep)
      );
    }
    select(this.axis)
      .attr("transform", `translate(${xShift},${yShift})`)
      .call(axis)
      .selectAll(".tick line")
      .attr("transform", `translate(0,${tickShift})`);

    if (tickFormat) {
      const labels = select(this.axis).selectAll(".tick text");
      labels.style("text-anchor", textAnchor);
      if (rotateLabels) {
        labels.attr("transform", "rotate(90)");
      }

      // fine-tune text label position via x, y, dx, dy attrs
      for (let attr in labelPosition) {
        labels.attr(attr, labelPosition[attr]);
      }
    }
  }

  render() {
    const { tickColor, fontSize } = this.props;
    return (
      <StyledAxis
        fontSize={fontSize}
        innerRef={axis => (this.axis = axis)}
        tickColor={tickColor}
      />
    );
  }
}

Axis.propTypes = {
  direction: PropTypes.oneOf(["x", "y"]).isRequired,
  fontSize: PropTypes.string.isRequired,
  labelPosition: PropTypes.shape({
    x: PropTypes.string,
    y: PropTypes.string,
    dx: PropTypes.string,
    dy: PropTypes.string
  }).isRequired,
  scale: PropTypes.func.isRequired,
  textAnchor: PropTypes.oneOf(["start", "middle", "end"]),
  tickColor: PropTypes.string.isRequired,
  tickSize: PropTypes.number,
  tickShift: PropTypes.number.isRequired,
  tickStep: PropTypes.number,
  tickFormat: PropTypes.string.isRequired,
  rotateLabels: PropTypes.bool.isRequired,
  xShift: PropTypes.number.isRequired,
  yShift: PropTypes.number.isRequired
};

Axis.defaultProps = {
  fontSize: "0.8rem",
  labelPosition: {
    x: "0",
    y: "0",
    dx: "0",
    dy: "0"
  },
  textAnchor: "middle",
  tickColor: "#ccc",
  tickShift: 0,
  tickFormat: "",
  rotateLabels: false,
  xShift: 0,
  yShift: 0
};

export default Axis;
