import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleBand } from "d3-scale";
import ClippedSVG from "../atoms/ClippedSVG";
import CenteredSVGText from "../atoms/CenteredSVGText";
import COLORS from "../../utils/styles";

class BarGraph extends Component {
  handleStart = (scale, d, i) => ({
    x: scale(i),
    fill: COLORS.MAROON,
    width: scale.bandwidth(),
    barHeight: this.props.yScale(d.height)
  });

  handleEnterAndUpdate = (scale, d, i) => ({
    x: [scale(i)],
    width: [scale.bandwidth()],
    barHeight: [this.props.yScale(d.height)],
    timing: { duration: 100 }
  });

  render() {
    const { svgId, width, height, padding, barData } = this.props;
    const xScale = scaleBand()
      .domain(barData.map((d, i) => i))
      .rangeRound([padding, width - padding])
      .padding(0.1);

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
              {bars.map(bar => {
                const { x, fill, width, barHeight } = bar.state;
                const fontSize =
                  bars.length < 11 ? "100%" : `${110 - 1 * bars.length}%`;
                return (
                  <g key={bar.key}>
                    <rect
                      x={x}
                      width={width}
                      y={barHeight}
                      height={height - barHeight}
                      fill={fill}
                    />
                    <CenteredSVGText
                      x={x}
                      dx={width / 2}
                      y={barHeight}
                      dy={-10}
                      fontSize={fontSize}
                    >
                      {bar.key + 1}
                    </CenteredSVGText>
                  </g>
                );
              })}
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
  ).isRequired
};

export default BarGraph;
