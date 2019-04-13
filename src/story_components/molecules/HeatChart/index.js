import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG } from "story_components";
import { TooltipProvider } from "containers";
import COLORS from "utils/styles";

class HeatChart extends Component {
  getDimensions = () => {
    const { data } = this.props;
    const width = data.length * 50;
    const height = data[0].length * 50;
    return {
      width,
      height,
      paddingX: width * 0.075,
      paddingY: height * 0.075
    };
  };

  getScales = () => {
    const { data } = this.props;
    const { width, height, paddingX, paddingY } = this.getDimensions();
    return {
      xScale: scaleLinear()
        .domain([0, data.length])
        .range([paddingX, width - paddingX]),
      yScale: scaleLinear()
        .domain([0, Array.isArray(data[0]) ? data[0].length : 0])
        .range([height - paddingY, paddingY])
    };
  };

  renderAxes = () => {
    const { width, height, paddingX, paddingY } = this.getDimensions();
    const { xScale, yScale } = this.getScales();
    return (
      <g>
        <Axis
          direction="x"
          labelPosition={{ y: "9", dy: "0.71em" }}
          scale={xScale}
          tickFormat={","}
          tickColor={COLORS.BLACK}
          yShift={height - paddingY}
        />
        <Axis
          direction="y"
          labelPosition={{ x: "-9", dy: "0.32em" }}
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
    );
  };

  renderRectangles = (tooltipShow, tooltipHide) => rects => {
    const { height, paddingX, paddingY } = this.getDimensions();
    const { xScale, yScale } = this.getScales();
    return (
      <g>
        {rects.map(({ key, data, state }) => {
          const { fill } = state;
          const { getTooltipBody, getTooltipTitle } = this.props;
          const title = getTooltipTitle(data);
          const body = getTooltipBody(data);
          return (
            <rect
              key={key}
              x={data.x}
              y={data.y}
              width={xScale(1) - 2 - paddingX}
              height={height - yScale(1) - 2 - paddingY}
              fill={fill}
              onMouseMove={tooltipShow && tooltipShow(title, body)}
              onMouseLeave={tooltipHide}
              onTouchMove={tooltipShow && tooltipShow(title, body)}
              onTouchEnd={tooltipHide}
            />
          );
        })}
      </g>
    );
  };

  renderSVG = (tooltipShow = null, tooltipHide = null) => {
    const { colorDomain, colorRange, data, children, axes, accessor } = this.props;
    const { width, height, paddingX, paddingY } = this.getDimensions();
    const { xScale, yScale } = this.getScales();
    const colorScale = scaleLinear()
      .domain(colorDomain)
      .range(colorRange);
    const rectData = data.reduce(
      (rectArr, row, x) =>
        rectArr.concat(
          row.map((d, y) => ({
            ...d,
            x: xScale(x) + 1,
            y: yScale(y + 1) + 1,
            fill: colorScale(accessor(d))
          }))
        ),
      []
    );
    return (
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
          {this.renderRectangles(tooltipShow, tooltipHide)}
        </NodeGroup>
        {children &&
          React.cloneElement(children, { width, height, paddingX, paddingY })}
        {axes && this.renderAxes()}
      </ClippedSVG>
    );
  };

  render() {
    const { tooltip } = this.props;
    return (
      <div>
        {tooltip ? (
          <TooltipProvider
            render={(tooltipShow, tooltipHide) =>
              this.renderSVG(tooltipShow, tooltipHide)
            }
          />
        ) : (
          this.renderSVG()
        )}
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
  getTooltipBody: PropTypes.func.isRequired,
  getTooltipTitle: PropTypes.func.isRequired
};

HeatChart.defaultProps = {
  data: [[[]]],
  accessor: d => d,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  axes: true,
  tooltip: true,
  getTooltipBody: d => JSON.stringify(d, null, 4),
  getTooltipTitle: d => ""
};

export default HeatChart;
