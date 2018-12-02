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
      data,
      children,
      colorDomain,
      colorRange,
      accessor,
      axes,
      tooltip
    } = this.props;
    const width = data.length * 50;
    const height = data[0].length * 50;
    const paddingX = width * 0.075;
    const paddingY = height * 0.075;
    const xScale = scaleLinear()
      .domain([0, data.length])
      .range([paddingX, width - paddingX]);
    const yScale = scaleLinear()
      .domain([0, Array.isArray(data[0]) ? data[0].length : 0])
      .range([height - paddingY, paddingY]);
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
                      width={xScale(1) - 2 - paddingX}
                      height={height - yScale(1) - 2 - paddingY}
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
          {children &&
            React.cloneElement(children, { width, height, paddingX, paddingY })}
          {axes ? (
            <g>
              <Axis
                direction="x"
                labelPosition={{y: "9", dy: "0.71em"}}
                scale={xScale}
                tickFormat={","}
                tickColor={COLORS.BLACK}
                yShift={height - paddingY}
              />
              <Axis
                direction="y"
                labelPosition={{x: "-9", dy: "0.32em"}}
                scale={yScale}
                textAnchor="end"
                tickFormat={","}
                tickColor={COLORS.BLACK}
                xShift={paddingX}
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
            </g>
          ) : null}
        </ClippedSVG>
        {tooltip ? (
          <Tooltip
            body={data.map(d => d.tooltipText)}
            visible={tooltipVisible}
            x={tooltipX}
            y={tooltipY}
            body={tooltipBody}
          />
        ) : null}
      </div>
    );
  }
}

HeatChart.propTypes = {
  data: PropTypes.array.isRequired,
  accessor: PropTypes.func.isRequired,
  colorDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  colorRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  axes: PropTypes.bool.isRequired,
  tooltip: PropTypes.bool.isRequired,
  getTooltipBody: PropTypes.func.isRequired
};

HeatChart.defaultProps = {
  data: [[[]]],
  accessor: d => d,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  axes: true,
  tooltip: true,
  getTooltipBody: d => JSON.stringify(d, null, 4)
};

export default HeatChart;
