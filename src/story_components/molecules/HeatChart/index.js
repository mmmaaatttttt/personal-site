import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG, Tooltip } from "story_components";
import COLORS from "utils/styles";

class HeatChart extends Component {
  state = {
    tooltipVisible: false,
    tooltipX: 0,
    tooltipY: 0,
    tooltipBody: ""
  };

  handleTooltipShow = (datum, e) => {
    const { getTooltipBody } = this.props;
    this.setState({
      tooltipVisible: true,
      tooltipX: e.pageX,
      tooltipY: e.pageY,
      tooltipBody: getTooltipBody(datum)
    });
  };

  handleTooltipHide = e => {
    this.setState({
      tooltipVisible: false
    });
  };

  render() {
    const { tooltipVisible, tooltipX, tooltipY, tooltipBody } = this.state;
    const {
      width,
      height,
      padding,
      data,
      colorDomain,
      colorRange,
      accessor
    } = this.props;
    const xScale = scaleLinear()
      .domain([0, data.length])
      .range([padding, width - padding]);
    const yScale = scaleLinear()
      .domain([0, Array.isArray(data[0]) ? data[0].length : 0])
      .range([height - padding, padding]);
    const colorScale = scaleLinear()
      .domain(colorDomain)
      .range(colorRange);
    // do node group stuffs here
    const rectData = data.reduce(
      (rectArr, row, x) =>
        rectArr.concat(
          row.map((d, y) => ({
            x: xScale(x) + 1,
            y: yScale(y + 1) + 1,
            fill: colorScale(accessor(d)),
            showFn: this.handleTooltipShow.bind(this, d)
          }))
        ),
      []
    );
    return (
      <div>
        <ClippedSVG width={width} height={height}>
          <NodeGroup
            data={rectData}
            keyAccessor={d => `${d.x}:${d.y}`}
            start={d => d}
            update={({ fill }, i) => {
              return {
                fill: [fill],
                timing: { duration: 500, delay: i * 10 }
              };
            }}
          >
            {rects => (
              <g>
                {rects.map(({ key, data, state }) => {
                  const { fill } = state;
                  return (
                    <rect
                      key={key}
                      x={data.x}
                      y={data.y}
                      width={xScale(1) - 2 - padding}
                      height={height - yScale(1) - 2 - padding}
                      fill={fill}
                      onMouseMove={data.showFn}
                      onMouseLeave={this.handleTooltipHide}
                      onTouchMove={data.showFn}
                      onTouchEnd={this.handleTooltipHide}
                    />
                  );
                })}
              </g>
            )}
          </NodeGroup>
          <Axis
            direction="x"
            scale={xScale}
            yShift={height - padding}
            tickFormat={","}
            tickColor={COLORS.BLACK}
            rotateLabels={false}
          />
          <Axis
            direction="y"
            scale={yScale}
            xShift={padding}
            tickFormat={","}
            tickColor={COLORS.BLACK}
          />
          <AxisLabel x={width / 2} y={height}>
            Raven Count
          </AxisLabel>
          <AxisLabel
            x={10}
            y={height / 2}
            transform={`rotate(-90 10,${height / 2})`}
            dy={10}
          >
            Fruits per Color
          </AxisLabel>
        </ClippedSVG>
        <Tooltip
          body={data.map(d => d.tooltipText)}
          visible={tooltipVisible}
          x={tooltipX}
          y={tooltipY}
          body={tooltipBody}
        />
      </div>
    );
  }
}

HeatChart.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  accessor: PropTypes.func.isRequired,
  colorDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  colorRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  getTooltipBody: PropTypes.func.isRequired
};

HeatChart.defaultProps = {
  width: 600,
  height: 600,
  padding: 45,
  data: [],
  accessor: d => d,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  getTooltipBody: d => JSON.stringify(d, null, 4)
};

export default HeatChart;
