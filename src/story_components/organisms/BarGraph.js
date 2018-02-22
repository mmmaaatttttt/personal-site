import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleBand, scaleLinear } from "d3-scale";
import Axis from "../molecules/Axis";
import ClippedSVG from "../atoms/ClippedSVG";
import CenteredSVGText from "../atoms/CenteredSVGText";
import COLORS from "../../utils/styles";

class BarGraph extends Component {
  handleStart = (scale, d, i) => ({
    x: this.props.histogram ? scale(d.x0) + 1 : scale(i),
    fill: COLORS.MAROON,
    width: this.props.histogram
      ? scale(d.x1) - scale(d.x0) - 2
      : scale.bandwidth(),
    barHeight: this.props.yScale(d.height)
  });

  handleEnterAndUpdate = (scale, d, i) => ({
    x: [this.props.histogram ? scale(d.x0) + 1 : scale(i)],
    width: [
      this.props.histogram ? scale(d.x1) - scale(d.x0) - 2 : scale.bandwidth()
    ],
    barHeight: [this.props.yScale(d.height)],
    timing: { duration: 100 }
  });

  render() {
    const {
      svgId,
      width,
      height,
      padding,
      barData,
      yScale,
      tickStep,
      barLabel,
      histogram,
      thresholds,
      tickFormat
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
    return (
      <ClippedSVG id={svgId} width={width} height={height} padding={padding}>
        <NodeGroup
          data={barData}
          keyAccessor={d => d.key}
          start={this.handleStart.bind(this, xScale)}
          enter={this.handleEnterAndUpdate.bind(this, xScale)}
          update={this.handleEnterAndUpdate.bind(this, xScale)}
          leave={() => {}}
        >
          {bars => (
            <g>
              <Axis
                direction="y"
                scale={yScale}
                xShift={padding}
                tickSize={-width + 2 * padding}
                tickStep={tickStep}
              />
              {bars.map(bar => {
                const { x, fill, width, barHeight } = bar.state;
                const fontSize =
                  bars.length < 11 ? "100%" : `${110 - 1 * bars.length}%`;
                const text = barLabel ? (
                  <CenteredSVGText
                    x={x}
                    dx={width / 2}
                    y={barHeight}
                    dy={-10}
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
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired,
  yScale: PropTypes.func.isRequired,
  barData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.isRequired,
      height: PropTypes.number.isRequired
    })
  ).isRequired,
  tickStep: PropTypes.number.isRequired,
  barLabel: PropTypes.func,
  histogram: PropTypes.bool,
  thresholds: PropTypes.arrayOf(PropTypes.number),
  tickFormat: PropTypes.string
};

export default BarGraph;
