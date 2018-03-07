import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import visualizationData from "../../data/gaming-nonlinear-relationships.js";
import withCaption from "../../hocs/withCaption";
import { generateData } from "../../utils/mathHelpers";
import Graph from "../organisms/Graph";
import SliderGroup from "../organisms/SliderGroup";
import LinePlot from "../atoms/LinePlot";
import StyledColumnLayout from "../atoms/StyledColumnLayout";
import StyledFlexContainer from "../atoms/StyledFlexContainer";

class GamingNonlinearRelationships extends Component {
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
    let yMax = max([].concat(...graphData), d => Math.abs(d.y));
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
    const { min, max, step, padding, idx } = this.props;
    const {
      initialData,
      width,
      height,
      diffEqs,
      svgIds,
      xLabel,
      yLabel,
      colors
    } = visualizationData[idx];
    const { values } = this.state;

    // data is all data from original source file
    // plus most recent values from inside of state
    const data = initialData.map((d, i) => {
      const newObj = { ...d, value: values[i], originalIdx: i };
      delete newObj.initialValue;
      return newObj;
    });

    const uniqueColors = colors.filter((c, i) => colors.indexOf(c) === i);

    const graphs = Array.from({ length: 2 }, (_, i) => {
      // need to slice for the last set of visualizations, unfortunately
      // for most visualizations, this has no effect
      const sliceIdx = i === 1 && colors.length === 4 ? 2 : 0;
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
          tickStep={this.tickStep}
        >
          {linePlots}
        </Graph>
      );
    });

    const sliderGroups = uniqueColors.map(color => (
      <SliderGroup
        key={color}
        data={data.filter(d => d.color === color)}
        handleValueChange={this.handleValueChange}
      />
    ));

    return (
      <StyledFlexContainer column>
        <StyledColumnLayout break="small">{sliderGroups}</StyledColumnLayout>
        <StyledColumnLayout>{graphs}</StyledColumnLayout>
      </StyledFlexContainer>
    );
  }
}

GamingNonlinearRelationships.propTypes = {
  idx: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

GamingNonlinearRelationships.defaultProps = {
  min: 0,
  max: 20,
  step: 0.02,
  padding: 30
};

export default withCaption(GamingNonlinearRelationships);
