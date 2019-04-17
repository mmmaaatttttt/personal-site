import React, { Component } from "react";
import PropTypes from "prop-types";
import { extent, max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { flatten } from "lodash";
import { withCaption, SliderProvider } from "providers";
import { generateData } from "utils/mathHelpers";
import visualizationData from "data/warming-dots.js";
import { FlexContainer, Graph, LinePlot } from "story_components";

class WarmingDots extends Component {
  getYDomain = graphData => {
    const { largestY, smallestY } = this.props.visData;
    let yMax = max([].concat(...graphData), d => Math.abs(d.y));
    yMax = Math.min(Math.max(Math.ceil(yMax), smallestY), largestY);
    return [0, yMax];
  };

  renderLinePlotsAndScales = values => {
    const { graphPadding, visData } = this.props;
    const { initialData, diffEqs, colors, width, height } = visData;
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
    return { xScale, yScale, linePlots };
  };

  tickStep = scale => {
    const [tickMin, tickMax] = scale.domain();
    const step = tickMax > 500 ? (tickMax - tickMin) / 1e3 : 1;
    return step;
  };

  transformData = (data, diffEq) => {
    const { min, max, step, visData } = this.props;
    const { colors, integrationConstants } = visData;
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
    const { svgPadding, graphPadding, visData } = this.props;
    const {
      initialData,
      width,
      height,
      svgIds,
      xLabel,
      yLabel,
      colors
    } = visData;
    const sliderData = flatten(
      colors.map(color => initialData.filter(d => d.color === color))
    );
    return (
      <SliderProvider
        initialData={sliderData}
        render={sliderVals => {
          const { xScale, yScale, linePlots } = this.renderLinePlotsAndScales(
            sliderVals
          );
          return (
            <FlexContainer cross="center" key="graph">
              <Graph
                width={width}
                height={height}
                svgPadding={svgPadding}
                graphPadding={graphPadding}
                svgId={svgIds[0]}
                xLabel={xLabel}
                xLabelPosition={"bottom-center"}
                yLabel={yLabel}
                xScale={xScale}
                yScale={yScale}
                tickStep={this.tickStep}
                key="Graph"
              >
                {linePlots}
              </Graph>
            </FlexContainer>
          );
        }}
      />
    );
  }
}

WarmingDots.propTypes = {
  graphPadding: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  svgPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired,
  visData: PropTypes.shape({
    initialData: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    smallestY: PropTypes.number.isRequired,
    largestY: PropTypes.number.isRequired,
    diffEqs: PropTypes.arrayOf(PropTypes.func).isRequired,
    svgIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    xLabel: PropTypes.string.isRequired,
    yLabel: PropTypes.string.isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    integrationConstants: PropTypes.arrayOf(PropTypes.number).isRequired
  })
};

WarmingDots.defaultProps = {
  graphPadding: 30,
  max: 10,
  min: 0,
  step: 0.005,
  svgPadding: {
    top: 30,
    left: 0,
    bottom: 0,
    right: 30
  },
  visData: visualizationData[0]
};

export default withCaption(WarmingDots);

export { WarmingDots };
