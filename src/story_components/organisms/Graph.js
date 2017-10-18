import React, { Component } from "react";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import { line, curveMonotoneX, curveNatural } from "d3-shape";
import { generateData } from "../../utils/mathHelpers";
import PropTypes from "prop-types";
import Axis from "../molecules/Axis";
import LinePlot from "../atoms/LinePlot";
import styled from "styled-components";
import media from "../../utils/media";

const StyledGraph = styled.div`
  width: 50%;
  ${media.small`
    width: 100%;
  `};
`;

class Graph extends Component {
  constructor(props) {
    super(props);
    this.transformData = this.transformData.bind(this);
    this.truncateData = this.truncateData.bind(this);
    this.getYDomain = this.getYDomain.bind(this);
    this.getInitialValues = this.getInitialValues.bind(this);
    this.getColors = this.getColors.bind(this);
  }

  getInitialValues(initial = true) {
    // initial values for diffEq come from ids of the form "x|0"
    const { data } = this.props;
    return initial
      ? data.filter(d => d.id.split("|")[1] === "0")
      : data.filter(d => d.id.split("|")[1] !== "0");
  }

  getColors() {
    const { data } = this.props;
    return data.reduce((colorArr, d) => {
      const idx = +d.id.split("|")[0];
      if (!colorArr[idx]) colorArr.push(d.color);
      return colorArr;
    }, []);
  }

  transformData() {
    const { min, max, step, diffEq } = this.props;
    const diffEqValues = this.getInitialValues(false).map(d => d.value);
    const graphCount = this.getColors().length;
    let initialValues = this.getInitialValues().map(d => d.value);
    if (initialValues.length === 0) initialValues = [0, 0];
    return generateData(
      graphCount,
      min,
      max,
      step,
      initialValues,
      diffEqValues,
      diffEq
    );
  }

  getYDomain(graphs) {
    const { largestY, smallestY } = this.props;
    let yMax = max([].concat(...graphs), d => Math.abs(d.y));
    yMax = Math.min(Math.max(Math.ceil(yMax), smallestY), largestY);
    return [-yMax, yMax];
  }

  truncateData(graphData, scale) {
    return graphData.map(d => {
      let newY = d.y;
      const domain = scale.domain();
      if (newY > domain[1]) newY = domain[1] * 1.1;
      if (newY < domain[0]) newY = domain[0] * 1.1;
      return { ...d, y: newY };
    });
  }

  render() {
    const { data, width, height, padding, id } = this.props;
    const graphs = this.transformData();
    const colors = this.getColors();

    const xScale = scaleLinear()
      .domain(extent(graphs[0], d => d.x))
      .range([padding, width - padding]);

    const yScale = scaleLinear()
      .domain(this.getYDomain(graphs))
      .range([height - padding, padding]);

    const linePath = line()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(curveNatural);

    const linePlots = graphs.map((graph, i) => (
      <LinePlot
        key={i}
        d={linePath(this.truncateData(graph, yScale))}
        stroke={colors[i]}
      />
    ));

    return (
      <StyledGraph>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${width} ${height}`}
          ref={svg => {
            this.svg = svg;
          }}
        >
          <defs>
            <clipPath id={`clip-path-${id}`}>
              <rect
                x={padding}
                y={padding}
                height={height - 2 * padding}
                width={width - 2 * padding}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#clip-path-${id})`}>
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
            {linePlots}
          </g>
        </svg>
      </StyledGraph>
    );
  }
}

Graph.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
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
  max: 20,
  step: 0.1,
  padding: 20
};

export default Graph;
