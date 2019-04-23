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
    let {
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
      yScale,
      yTickFormat,
      yTickLabelPosition
    } = this.props;

    // normalize padding to always be an object
    if (typeof padding === "number") {
      padding = {
        top: padding,
        left: padding,
        right: padding,
        bottom: padding
      };
    }
    const xScale = histogram
      ? scaleLinear()
          .domain([thresholds[0], thresholds[thresholds.length - 1]])
          .rangeRound([padding.left, width - padding.right])
      : scaleBand()
          .domain(barData.map((d, i) => i))
          .rangeRound([padding.left, width - padding.right])
          .padding(0.1);
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
                      height={height - barHeight - padding.bottom}
                      fill={fill}
                    />
                    {text}
                  </g>
                );
              })}
              <Axis
                direction="y"
                fontSize="0.6rem"
                labelPosition={
                  yTickLabelPosition === "bottom"
                    ? { x: "4", dy: "12" }
                    : { x: "-5" }
                }
                scale={yScale}
                xShift={padding.left}
                yShift={0}
                textAnchor={yTickLabelPosition === "bottom" ? "start" : "end"}
                tickFormat={yTickFormat}
                tickSize={-width + padding.left + padding.right}
                tickStep={tickStep}
              />
              {histogram ? (
                <Axis
                  direction="x"
                  rotateLabels
                  scale={xScale}
                  tickStep={thresholds[1] - thresholds[0]}
                  tickFormat={tickFormat}
                  labelPosition={{ y: "0.35em", x: "9", dy: "0" }}
                  textAnchor="start"
                  yShift={height - padding.bottom}
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
      height: PropTypes.number.isRequired,
      color: PropTypes.string, // used to vary color by bar
      x0: PropTypes.number, // required for a histogram
      x1: PropTypes.number // required for a histogram
    })
  ).isRequired,
  barLabel: PropTypes.func,
  color: PropTypes.string.isRequired, // can use one color here if all bars should be the same
  height: PropTypes.number.isRequired,
  histogram: PropTypes.bool,
  labelFontSize: PropTypes.string,
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })
  ]).isRequired,
  thresholds: PropTypes.arrayOf(PropTypes.number),
  tickFormat: PropTypes.string,
  yTickLabelPosition: PropTypes.oneOf(["bottom", "left"]),
  yTickFormat: PropTypes.string,
  tickStep: PropTypes.number.isRequired,
  timing: PropTypes.object.isRequired,
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired
};

BarGraph.defaultProps = {
  color: COLORS.MAROON,
  timing: { duration: 100 },
  yTickLabelPosition: "bottom"
};

export default BarGraph;
