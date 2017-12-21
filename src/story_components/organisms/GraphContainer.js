import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { extent, max } from "d3-array";
import LinePlot from "../atoms/LinePlot";
import StyledGraphContainer from "../atoms/StyledGraphContainer";
import Graph from "./Graph";
import SliderContainer from "./SliderContainer";
import withCaption from "../../hocs/withCaption";
import { generateData } from "../../utils/mathHelpers";

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

  transformData(data, diffEq) {
    const { min, max, step, colors } = this.props;
    const diffEqValues = data
      .filter(d => d.equationParameter)
      .map(d => d.value);
    const graphCount = colors.length;
    let initialValues = data
      .filter(d => !d.equationParameter)
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
      diffEqs,
      min,
      max,
      step,
      padding,
      svgIds,
      xLabel,
      yLabel,
      colors,
      double
    } = this.props;

    const { values } = this.state;

    // data is all data from original source file
    // plus most recent values from inside of state
    const data = initialData.map((d, i) => {
      const newObj = { ...d, value: values[i] };
      delete newObj.initialValue;
      return newObj;
    });

    const uniqueColors = colors.filter((c, i) => colors.indexOf(c) === i);

    const graphs = Array.from({ length: +double + 1 }, (_, i) => {
      // need to slice for the last set of visualizations, unfortunately
      // for most visualizations, this has no effect
      const sliceIdx = double && i === 1 && colors.length === 4 ? 2 : 0;
      const allGraphData = this.transformData(data, diffEqs[i]).slice(
        sliceIdx,
        sliceIdx + 2
      );
      const xScale = scaleLinear()
        .domain(extent(allGraphData[0], d => d.x))
        .range([padding, width - padding]);

      const yScale = scaleLinear()
        .domain(this.getYDomain(allGraphData))
        .range([height - padding, padding]);

      const linePlots = allGraphData.map((graphData, j) => {
        const colorIdx = (2 * i + j) % colors.length;
        return (
          <LinePlot
            key={j}
            stroke={colors[colorIdx]}
            graphData={graphData}
            xScale={xScale}
            yScale={yScale}
          />
        );
      });

      return (
        <Graph
          key={i}
          width={width}
          height={height}
          min={min}
          max={max}
          step={step}
          padding={padding}
          svgId={svgIds[i]}
          xLabel={xLabel}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
          double={double}
        >
          {linePlots}
        </Graph>
      );
    });

    return (
      <StyledGraphContainer double={double}>
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
          double={double}
          colors={uniqueColors}
        />
        {graphs}
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
  diffEqs: PropTypes.arrayOf(PropTypes.func).isRequired,
  padding: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  double: PropTypes.bool.isRequired
};

GraphContainer.defaultProps = {
  min: 0,
  max: 20,
  step: 0.1,
  padding: 30,
  double: false
};

export default withCaption(GraphContainer);
