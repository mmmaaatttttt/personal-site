import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import visualizationData from "data/gaming-linear-relationships.js";
import { withCaption } from "containers";
import { generateData } from "utils/mathHelpers";
import {
  ColumnLayout,
  FlexContainer,
  Graph,
  LinePlot,
  SliderGroup
} from "story_components";

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

  updateData = () => {
    const { idx } = this.props;
    const { initialData } = visualizationData[idx];
    const { values } = this.state;
    return initialData.map((d, i) => {
      const newObj = { ...d, value: values[i], key: i };
      delete newObj.initialValue;
      return newObj;
    });
  };

  render() {
    const { svgPadding, graphPadding, idx } = this.props;
    const {
      width,
      height,
      diffEqs,
      svgIds,
      xLabel,
      yLabel,
      colors
    } = visualizationData[idx];

    // data is all data from original source file
    // plus most recent values from inside of state
    const data = this.updateData();
    const graphData = this.transformData(data, diffEqs[0]);
    const xScale = scaleLinear()
      .domain(extent(graphData[0], d => d.x))
      .range([graphPadding, width - graphPadding]);
    const yScale = scaleLinear()
      .domain(this.getYDomain(graphData))
      .range([height - graphPadding, graphPadding]);

    const linePlots = graphData.map((plot, i) => (
      <LinePlot
        key={i}
        graphData={plot}
        stroke={colors[i]}
        xScale={xScale}
        yScale={yScale}
      />
    ));

    const sliderGroups = colors.map(color => {
      const sliderData = data
        .filter(d => d.color === color)
        .map(d => ({
          ...d,
          tickCount: 3,
          fadeIcons: true,
          handleValueChange: val => this.handleValueChange(d.key, val)
        }));
      return <SliderGroup key={color} data={sliderData} />;
    });

    return (
      <ColumnLayout break="small">
        <FlexContainer column>{sliderGroups}</FlexContainer>
        <Graph
          width={width}
          height={height}
          svgPadding={svgPadding}
          graphPadding={graphPadding}
          svgId={svgIds[0]}
          xLabel={xLabel}
          xLabelPosition={"center-right"}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
          tickStep={this.tickStep}
        >
          {linePlots}
        </Graph>
      </ColumnLayout>
    );
  }
}

GamingLinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgPadding: PropTypes.number.isRequired,
  graphPadding: PropTypes.number.isRequired
};

GamingLinearRelationships.defaultProps = {
  idx: 0,
  min: 0,
  max: 20,
  step: 0.1,
  svgPadding: 30,
  graphPadding: 30
};

export default withCaption(GamingLinearRelationships);

export { GamingLinearRelationships };
