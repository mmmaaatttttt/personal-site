import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleBand } from "d3-scale";
import Axis from "../molecules/Axis";
import ClippedSVG from "../atoms/ClippedSVG";
import COLORS from "../../utils/styles";

class BarGraph extends Component {
  render() {
    const { svgId, width, height, padding, yScale, barData } = this.props;
    const xScale = scaleBand()
      .domain(barData.map((d, i) => i))
      .rangeRound([padding, width - padding])
      .padding(0.1);

    return (
      <ClippedSVG id={svgId} width={width} height={height} padding={padding}>
        <Axis direction="y" scale={yScale} xShift={padding} tickSize={5} />
        <NodeGroup
          data={barData}
          keyAccessor={d => d.key}
          start={() => ({
            x: 0,
            fill: COLORS.MAROON,
            width: xScale.bandwidth(),
            barHeight: 0
          })}
          enter={(d, i) => ({
            width: [xScale.bandwidth()],
            barHeight: [yScale(d.height)],
            x: [xScale(i)],
            timing: { duration: 0 }
          })}
          update={(d, i) => ({
            width: [xScale.bandwidth()],
            barHeight: [yScale(d.height)],
            x: [xScale(i)],
            timing: { duration: 0 }
          })}
          leave={() => {}}
        >
          {bars => (
            <g>
              {bars.map(bar => {
                const { x, fill, width, barHeight } = bar.state;
                return (
                  <rect
                    x={x}
                    width={width}
                    y={barHeight}
                    height={height - barHeight}
                    fill={fill}
                    key={bar.key}
                  />
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
