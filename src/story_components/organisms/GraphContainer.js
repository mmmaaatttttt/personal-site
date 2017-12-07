import React, { Component } from "react";
import Graph from "./Graph";
import LinePlot from "../atoms/LinePlot";
import SliderContainer from "../molecules/SliderContainer";
import PropTypes from "prop-types";
import styled from "styled-components";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import media from "../../utils/media";
import { rhythm } from "../../utils/typography";
import { generateData } from "../../utils/mathHelpers";
import withCaption from "../../hocs/withCaption";

const StyledGraphContainer = styled.div`
  display: flex;

  ${media.small`
    flex-direction: column;
  `};
`;

class GraphContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.initialData.map(d => d.initialValue)
    };
    this.handleValueChange = this.handleValueChange.bind(this);
    this.transformData = this.transformData.bind(this);
    this.getYDomain = this.getYDomain.bind(this);
  }

  handleValueChange(idx, newVal) {
    const newValues = [...this.state.values];
    newValues[idx] = newVal;
    this.setState({ values: newValues });
  }

  getYDomain(graphs) {
    const { largestY, smallestY } = this.props;
    let yMax = max([].concat(...graphs), d => Math.abs(d.y));
    yMax = Math.min(Math.max(Math.ceil(yMax), smallestY), largestY);
    return [-yMax, yMax];
  }

  transformData(data) {
    const { min, max, step, diffEq, colors } = this.props;
    const diffEqValues = data.filter(d => d.equationParameter)
                             .map(d => d.value);
    const graphCount = colors.length;
    let initialValues = data.filter(d => !d.equationParameter)
                            .map(d => d.value);
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

  render() {
    const {
      initialData,
      width,
      height,
      smallestY,
      largestY,
      diffEq,
      min,
      max,
      step,
      padding,
      svgId,
      xLabel,
      yLabel,
      colors
    } = this.props;
    const { values } = this.state;
    // data is all data from original source file
    // plus most recent values from inside of state
    const data = initialData.map((d, i) => {
      const newObj = { ...d, value: values[i] };
      delete newObj.initialValue;
      return newObj;
    });
    const graphs = this.transformData(data);
    const xScale = scaleLinear()
      .domain(extent(graphs[0], d => d.x))
      .range([padding, width - padding]);

    const yScale = scaleLinear()
      .domain(this.getYDomain(graphs))
      .range([height - padding, padding]);

    const linePlots = graphs
      // .slice(...sliceIdxs)
      .map((graphData, i) => (
        <LinePlot
          key={i}
          stroke={colors[i]}
          graphData={graphData}
          xScale={xScale}
          yScale={yScale}
        />
      ));

    return (
      <StyledGraphContainer>
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
        />
        <Graph
          width={width}
          height={height}
          min={min}
          max={max}
          step={step}
          padding={padding}
          svgId={svgId}
          xLabel={xLabel}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
        >
          {linePlots}
        </Graph>
      </StyledGraphContainer>
    );
  }
}

GraphContainer.propTypes = {
  initialData: PropTypes.arrayOf(
    PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      initialValue: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      equationParameter: PropTypes.bool.isRequired
    })
  ).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  smallestY: PropTypes.number.isRequired,
  largestY: PropTypes.number.isRequired,
  diffEq: PropTypes.func.isRequired,
  padding: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgId: PropTypes.string.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired
};

GraphContainer.defaultProps = {
  min: 0,
  max: 20,
  step: 0.1,
  padding: 30
};

export default withCaption(GraphContainer);
