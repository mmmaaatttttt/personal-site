import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleBand, scaleLinear } from "d3-scale";
import { Axis, CenteredSVGText, ClippedSVG } from "story_components";
import COLORS from "utils/styles";

class StackedBarGraph extends Component {
  handleStart = (scale, d, i) => {
    const { histogram, colors, yScale } = this.props;
    let total = 0;
    const cumulativeHeights = d.heights.map(bHeight => {
      total += bHeight;
      return total;
    });
    return {
      x: histogram ? scale(d.x0) + 1 : scale(i),
      fills: d.colors || colors,
      width: histogram ? scale(d.x1) - scale(d.x0) - 2 : scale.bandwidth(),
      barHeights: cumulativeHeights.map(yScale)
    };
  };

  handleEnterAndUpdate = (scale, d, i) => {
    const { histogram, yScale, timing, colors } = this.props;
    let total = 0;
    const cumulativeHeights = d.heights.map(bHeight => {
      total += bHeight;
      return total;
    });
    return {
      x: [histogram ? scale(d.x0) + 1 : scale(i)],
      width: [histogram ? scale(d.x1) - scale(d.x0) - 2 : scale.bandwidth()],
      barHeights: [cumulativeHeights.map(yScale)],
      fills: d.colors ? [d.colors] : [colors],
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
      yTickFormat
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
              <Axis
                direction="y"
                fontSize="0.6rem"
                labelPosition={{ x: "4", dy: "12" }}
                scale={yScale}
                xShift={padding.left}
                yShift={0}
                textAnchor="start"
                tickFormat={yTickFormat}
                tickSize={-width + padding.left + padding.right}
                tickStep={tickStep}
              />
              {bars.map(bar => {
                const { x, fills, width, barHeights } = bar.state;
                
                const text = barLabel ? (
                  <CenteredSVGText
                    x={x}
                    dx={width / 2}
                    y={barHeights[barHeights.length - 1]}
                    dy={-12}
                    fontSize={fontSize}
                  >
                    {barLabel(bar.data)}
                  </CenteredSVGText>
                ) : null;
                console.log("BAR", bar);
                return (
                  <g key={bar.key}>
                    {barHeights.map((bHeight, i) => (
                      <rect
                        x={x}
                        width={width}
                        y={bHeight}
                        height={barHeights[i - 1] ? barHeights[i - 1] - bHeight : height - bHeight - padding.bottom}
                        fill={fills[i]}
                        key={`${bar.key}-${i}`}
                      />
                    ))}
                    {text}
                  </g>
                );
              })}
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

StackedBarGraph.propTypes = {
  barData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.isRequired,
      heights: PropTypes.arrayOf(PropTypes.number).isRequired,
      x0: PropTypes.number, // required for a histogram
      x1: PropTypes.number // required for a histogram
    })
  ).isRequired,
  barLabel: PropTypes.func,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  yTickFormat: PropTypes.string,
  tickStep: PropTypes.number.isRequired,
  timing: PropTypes.object.isRequired,
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired
};

StackedBarGraph.defaultProps = {
  colors: [COLORS.MAROON],
  timing: { duration: 100 }
};

export default StackedBarGraph;
