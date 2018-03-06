import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import visualizationData from "../../data/gaming-linear-relationships.js";
import withCaption from "../../hocs/withCaption";
import { generateData } from "../../utils/mathHelpers";
import GraphContainer from "../organisms/GraphContainer";
import Graph from "../organisms/Graph";
import SliderContainer from "../organisms/SliderContainer";
import LinePlot from "../atoms/LinePlot";
import StyledColumnLayout from "../atoms/StyledColumnLayout";

class GamingLinearRelationships extends Component {
  state = {
    values: visualizationData[this.props.idx].initialData.map(
      d => d.initialValue
    )
  };

  handleValueChange = (idx, newVal) => {
    const newValues = [...this.state.values];
    newValues[idx] = newVal;
    this.setState({ values: newValues });
  };

  getYDomain = graphData => {
    // this method is broken - FIX IT!
    const { largestY, smallestY } = visualizationData[this.props.idx];
    let yMax = max([...graphData[0], ...graphData[1]], d => Math.abs(d.y));
    yMax = Math.min(Math.max(Math.ceil(yMax), smallestY), largestY);
    return [-yMax, yMax];
  };

  tickStep = scale => {
    const [tickMin, tickMax] = scale.domain();
    const step = tickMax > 500 ? (tickMax - tickMin) / 1e3 : 1;
    return step;
  };

  transformData = (data, diffEq) => {
    const { min, max, step, idx } = this.props;
    const { colors } = visualizationData[idx];
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
  };

  render() {
    const {
      initialData,
      width,
      height,
      diffEqs,
      svgIds,
      xLabel,
      yLabel,
      colors
    } = visualizationData[this.props.idx];
    const { min, max, step, padding } = this.props;
    const { values } = this.state;

    // data is all data from original source file
    // plus most recent values from inside of state
    const data = initialData.map((d, i) => {
      const newObj = { ...d, value: values[i] };
      delete newObj.initialValue;
      return newObj;
    });
    const graphData = this.transformData(data, diffEqs[0]);
    const xScale = scaleLinear()
      .domain(extent(graphData[0], d => d.x))
      .range([padding, width - padding]);
    const yScale = scaleLinear()
      .domain(this.getYDomain(graphData))
      .range([height - padding, padding]);

    const linePlots = graphData.map((plot, i) => (
      <LinePlot
        key={i}
        graphData={plot}
        stroke={colors[i]}
        xScale={xScale}
        yScale={yScale}
      />
    ));

    return (
      <StyledColumnLayout break="small">
        <SliderContainer
          handleValueChange={this.handleValueChange}
          data={data}
          colors={colors}
        />
        <Graph
          width={width}
          height={height}
          min={min}
          max={max}
          step={step}
          padding={padding}
          svgId={svgIds[0]}
          xLabel={xLabel}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
          tickStep={this.tickStep}
        >
          {linePlots}
        </Graph>
      </StyledColumnLayout>
    );
  }
}

GamingLinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

GamingLinearRelationships.defaultProps = {
  min: 0,
  max: 20,
  step: 0.1,
  padding: 30
};

export default withCaption(GamingLinearRelationships);
