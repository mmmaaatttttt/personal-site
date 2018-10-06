import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleBand, scaleLinear } from "d3-scale";
import { Axis, CenteredSVGText, ClippedSVG } from "story_components";
import COLORS from "utils/styles";

class BarGraph extends Component {
  handleStart = (scale, d, i) => {
    const { histogram, color, yScale } = this.props;
    return {
      x: histogram ? scale(d.x0) + 1 : scale(i),
      fill: d.color || color,
      width: histogram ? scale(d.x1) - scale(d.x0) - 2 : scale.bandwidth(),
      barHeight: yScale(d.height)
    };
  };

  handleEnterAndUpdate = (scale, d, i) => {
    const { histogram, yScale, timing, color } = this.props;
    return {
      x: [histogram ? scale(d.x0) + 1 : scale(i)],
      width: [histogram ? scale(d.x1) - scale(d.x0) - 2 : scale.bandwidth()],
      barHeight: [yScale(d.height)],
      fill: d.color || color,
      timing: {
        duration: timing.duration,
        delay: timing.delay * i || 0
      }
    };
  };

  render() {
    const {
      barData,
      barLabel,
      height,
      histogram,
      labelFontSize,
      padding,
      svgId,
      thresholds,
      tickFormat,
      tickStep,
      width,
      yScale
    } = this.props;

    const xScale = histogram
      ? scaleLinear()
          .domain([thresholds[0], thresholds[thresholds.length - 1]])
          .rangeRound([padding, width - padding])
      : scaleBand()
          .domain(barData.map((d, i) => i))
          .rangeRound([padding, width - padding])
          .padding(0.1);
    let paddingBottom = 0;
    if (histogram) {
      paddingBottom = 60;
      const range = yScale.range();
      range[0] -= paddingBottom;
      yScale.range(range);
    }
    let fontSize = labelFontSize;
    if (!fontSize)
      fontSize = barData.length < 11 ? "100%" : `${110 - 1 * barData.length}%`;
    return (
      <ClippedSVG id={svgId} width={width} height={height}>
        <NodeGroup
          data={barData}
          keyAccessor={d => d.key}
          start={this.handleStart.bind(this, xScale)}
          enter={this.handleEnterAndUpdate.bind(this, xScale)}
          update={this.handleEnterAndUpdate.bind(this, xScale)}
        >
          {bars => (
            <g>
              <Axis
                direction="y"
                scale={yScale}
                xShift={padding}
                yShift={padding}
                tickSize={-width + 2 * padding}
                tickStep={tickStep}
              />
              {bars.map(bar => {
                const { x, fill, width, barHeight } = bar.state;
                const text = barLabel ? (
                  <CenteredSVGText
                    x={x}
                    dx={width / 2}
                    y={barHeight}
                    dy={-12}
                    fontSize={fontSize}
                  >
                    {barLabel(bar.data)}
                  </CenteredSVGText>
                ) : null;
                return (
                  <g key={bar.key}>
                    <rect
                      x={x}
                      width={width}
                      y={barHeight}
                      height={height - barHeight - paddingBottom}
                      fill={fill}
                    />
                    {text}
                  </g>
                );
              })}
              {histogram ? (
                <Axis
                  direction="x"
                  scale={xScale}
                  yShift={height - paddingBottom}
                  tickStep={thresholds[1] - thresholds[0]}
                  tickFormat={tickFormat}
                />
              ) : null}
            </g>
          )}
        </NodeGroup>
      </ClippedSVG>
    );
  }
}

BarGraph.propTypes = {
  barData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.isRequired,
      height: PropTypes.number.isRequired
    })
  ).isRequired,
  barLabel: PropTypes.func,
  color: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired,
  histogram: PropTypes.bool,
  labelFontSize: PropTypes.string,
  padding: PropTypes.number.isRequired,
  thresholds: PropTypes.arrayOf(PropTypes.number),
  tickFormat: PropTypes.string,
  tickStep: PropTypes.number.isRequired,
  timing: PropTypes.object.isRequired,
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired
};

BarGraph.defaultProps = {
  color: COLORS.MAROON,
  timing: { duration: 100 }
};

export default BarGraph;
