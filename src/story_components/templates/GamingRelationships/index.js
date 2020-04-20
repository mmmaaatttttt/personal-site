import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { generateData } from "utils/mathHelpers";
import {
  ColumnLayout,
  FlexContainer,
  Graph,
  LinePlot,
  SliderGroup
} from "story_components";
import { withCaption } from "providers";

class GamingRelationships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: this.props.visData.initialData.map(d => d.initialValue)
    };
  }

  handleValueChange = (idx, newVal) => {
    const newValues = [...this.state.values];
    newValues[idx] = newVal;
    this.setState({ values: newValues });
  };

  getYDomain = graphData => {
    const { largestY, smallestY } = this.props.visData;
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
    const { min, max, step, visData } = this.props;
    const { colors } = visData;
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
    const { initialData } = this.props.visData;
    const { values } = this.state;
    return initialData.map((d, i) => {
      const newObj = { ...d, value: values[i], key: i };
      delete newObj.initialValue;
      return newObj;
    });
  };

  render() {
    const { svgPadding, graphPadding, visData } = this.props;
    const { width, height, diffEqs, svgIds, xLabel, yLabel, colors } = visData;

    // data is all data from original source file
    // plus most recent values from inside of state
    const data = this.updateData();
    const uniqueColors = Array.from(new Set(colors));
    const graphs = Array.from({ length: diffEqs.length }, (_, i) => {
      // need to slice for the last set of visualizations, unfortunately
      // for most visualizations, this has no effect
      const sliceIdx = i === 1 && colors.length === 4 ? 2 : 0;
      const allGraphData = this.transformData(data, diffEqs[i]).slice(
        sliceIdx,
        sliceIdx + 2
      );
      const xScale = scaleLinear()
        .domain(extent(allGraphData[0], d => d.x))
        .range([graphPadding, width - graphPadding]);
      const yScale = scaleLinear()
        .domain(this.getYDomain(allGraphData))
        .range([height - graphPadding, graphPadding]);
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
          graphPadding={graphPadding}
          gridlinesVertical={false}
          height={height}
          svgId={svgIds[i]}
          svgPadding={svgPadding}
          tickStep={this.tickStep}
          width={width}
          xAxisPosition="center"
          xLabel={xLabel}
          xScale={xScale}
          yLabel={yLabel}
          yScale={yScale}
        >
          {linePlots}
        </Graph>
      );
    });

    const sliderGroups = uniqueColors.map(color => {
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

    return graphs.length === 1 ? (
      <ColumnLayout break="small">
        <FlexContainer column>{sliderGroups}</FlexContainer>
        {graphs}
      </ColumnLayout>
    ) : (
      <FlexContainer column>
        <ColumnLayout break="small">{sliderGroups}</ColumnLayout>
        <ColumnLayout>{graphs}</ColumnLayout>
      </FlexContainer>
    );
  }
}

GamingRelationships.propTypes = {
  visData: PropTypes.object.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgPadding: PropTypes.number.isRequired,
  graphPadding: PropTypes.number.isRequired
};

GamingRelationships.defaultProps = {
  visData: {},
  min: 0,
  max: 20,
  step: 0.1,
  svgPadding: 30,
  graphPadding: 30
};

export default withCaption(GamingRelationships);

export { GamingRelationships };
