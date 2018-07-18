import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import visualizationData from "data/warming-dots.js";
import withCaption from "hocs/withCaption";
import { generateData } from "utils/mathHelpers";
import {
  FlexContainer,
  Graph,
  LinePlot,
  NarrowContainer,
  SliderGroup
} from "story_components";

class ClimatesChange extends Component {
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
    return [0, yMax];
  };

  tickStep = scale => {
    const [tickMin, tickMax] = scale.domain();
    const step = tickMax > 500 ? (tickMax - tickMin) / 1e3 : 1;
    return step;
  };

  transformData = (data, diffEq) => {
    const { min, max, step, idx } = this.props;
    const { colors, integrationConstants } = visualizationData[idx];
    const diffEqValues = data
      .filter(d => d.equationParameter)
      .map(d => d.value);
    const graphCount = colors.length;
    return generateData(
      graphCount,
      min,
      max,
      step,
      integrationConstants,
      diffEqValues,
      diffEq
    );
  };

  render() {
    const { min, max, step, svgPadding, graphPadding, idx } = this.props;
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
      const newObj = { ...d, value: values[i], key: i };
      delete newObj.initialValue;
      return newObj;
    });
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
      const sliderData = data.filter(d => d.color === color).map((d, i) => ({
        ...d,
        tickCount: 2,
        fadeIcons: false,
        handleValueChange: val => this.handleValueChange(d.key, val)
      }));
      return <SliderGroup key={color} data={sliderData} />;
    });

    return (
      <NarrowContainer width="70%" fullWidthAt="small">
        <FlexContainer column>{sliderGroups}</FlexContainer>
        <Graph
          width={width}
          height={height}
          min={min}
          max={max}
          step={step}
          svgPadding={svgPadding}
          graphPadding={graphPadding}
          svgId={svgIds[0]}
          xLabel={xLabel}
          xLabelPosition={"bottom-center"}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
          tickStep={this.tickStep}
        >
          {linePlots}
        </Graph>
      </NarrowContainer>
    );
  }
}

ClimatesChange.propTypes = {
  idx: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  graphPadding: PropTypes.number.isRequired,
  svgPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired
};

ClimatesChange.defaultProps = {
  min: 0,
  max: 5,
  step: 0.01,
  graphPadding: 30,
  svgPadding: {
    top: 30,
    left: 0,
    bottom: 0,
    right: 30
  }
};

export default withCaption(ClimatesChange);
