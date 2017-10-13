import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import { line, curveMonotoneX, curveNatural } from "d3-shape";
import { generateData } from "../utils/mathHelpers";
import PropTypes from "prop-types";
import Axis from "./Axis";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.transformData = this.transformData.bind(this);
    this.getYDomain = this.getYDomain.bind(this);
    this.truncateMonotoneData = this.truncateMonotoneData.bind(this);
  }

  transformData(data) {
    const { min, max, step } = this.props;
    const orderedIds = ["a", "b", "graph1_init", "graph2_init"];
    const orderedParams = orderedIds.map(
      id => this.props.data.find(d => d.id === id).value
    );
    return generateData(...orderedParams, min, max, step);
  }

  getYDomain(graph1, graph2) {
    const { largestY, smallestY } = this.props;
    let yMax = max(graph1.concat(graph2), d => Math.abs(d.y));
    yMax = Math.min(Math.max(Math.ceil(yMax), smallestY), largestY);
    return [-yMax, yMax];
  }

  truncateMonotoneData(graphData, scale) {
    let newData = graphData.filter(
      d => d.y >= scale.domain()[0] && d.y <= scale.domain()[1]
    );
    if (newData.length < graphData.length) {
      newData.push(graphData[newData.length]);
    }
    return newData;
  }

  render() {
    const { data, width, height, padding } = this.props;

    let { graph1, graph2 } = this.transformData(data);

    const xScale = scaleLinear()
      .domain(extent(graph1, d => d.x))
      .range([padding, width - padding]);

    const yScale = scaleLinear()
      .domain(this.getYDomain(graph1, graph2))
      .range([height - padding, padding]);

    const linePath = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(curveNatural);

    return (
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          ref={svg => {
            this.svg = svg;
          }}
        >
          <defs>
            <clipPath id="clip-path">
              <rect
                x={padding}
                y={padding}
                height={height - padding}
                width={width - padding}
              />
            </clipPath>
          </defs>
          <g clipPath="url(#clip-path)">
            <Axis
              direction="y"
              scale={yScale}
              xShift={padding}
              tickSize={-width + 2 * padding}
            />
            <Axis
              direction="x"
              scale={xScale}
              yShift={height / 2}
              tickSize={-height + 2 * padding}
              tickShift={height / 2 - padding}
            />
            <path
              d={linePath(this.truncateMonotoneData(graph1, yScale))}
              strokeWidth="5"
              stroke={data.find(d => d.id === "graph1_init").color}
              fill="none"
            />
            <path
              d={linePath(this.truncateMonotoneData(graph2, yScale))}
              strokeWidth="5"
              stroke={data.find(d => d.id === "graph2_init").color}
              fill="none"
            />
          </g>
        </svg>
      </div>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired
    })
  ),
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  smallestY: PropTypes.number.isRequired,
  largestY: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
};

Graph.defaultProps = {
  min: 0,
  max: 10,
  step: 0.1,
  padding: 20
};

export default Graph;
