import React, { Component } from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG } from "story_components";
import { TooltipProvider } from "providers";
import COLORS from "utils/styles";

class HeatChart extends Component {
  getDimensions = () => {
    const { data, width, paddingScale } = this.props;
    const squareWidth = width / data.length;
    const height = data[0].length * squareWidth;
    return {
      width,
      height,
      paddingX: width * paddingScale,
      paddingY: height * paddingScale
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
    const { xAxisLabel, yAxisLabel } = this.props;
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
          {xAxisLabel}
        </AxisLabel>
        <AxisLabel
          x={0}
          y={height / 2}
          transform={`rotate(-90 10,${height / 2})`}
          dy={10}
        >
          {yAxisLabel}
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
    const {
      accessor,
      axes,
      children,
      colorDomain,
      colorRange,
      data,
      delayMultiplier,
      id
    } = this.props;
    const { width, height, paddingX, paddingY } = this.getDimensions();
    const { xScale, yScale } = this.getScales();
    const colorScale = scaleLinear()
      .domain(colorDomain)
      .range(colorRange);
    const rectData = data.reduce(
      (rectArr, row, x) =>
        rectArr.concat(
          row
            .map((d, y) => {
              if (d === null) return null;
              const rectObj = {
                x: xScale(x) + 1,
                y: yScale(y + 1) + 1,
                original: {
                  x,
                  y,
                  data: d
                }
              };
              rectObj.fill = colorScale(accessor(rectObj.original.data));
              return rectObj;
            })
            .filter(d => d !== null)
        ),
      []
    );
    return (
      <ClippedSVG width={width} height={height} id={id}>
        <NodeGroup
          data={rectData}
          keyAccessor={d => `${d.x}:${d.y}`}
          start={d => d}
          update={({ fill }, i) => {
            return {
              fill: [fill],
              timing: { duration: 500, delay: i * delayMultiplier }
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
  accessor: PropTypes.func.isRequired,
  axes: PropTypes.bool.isRequired,
  colorDomain: PropTypes.arrayOf(PropTypes.number).isRequired,
  colorRange: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.array.isRequired,
  delayMultiplier: PropTypes.number.isRequired,
  getTooltipBody: PropTypes.func.isRequired,
  getTooltipTitle: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  paddingScale: PropTypes.number.isRequired,
  tooltip: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired,
  xAxisLabel: PropTypes.string.isRequired,
  yAxisLabel: PropTypes.string.isRequired
};

HeatChart.defaultProps = {
  accessor: d => d,
  axes: true,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  data: [[[]]],
  delayMultiplier: 10,
  getTooltipBody: d => JSON.stringify(d, null, 4),
  getTooltipTitle: () => "",
  id: "svg",
  paddingScale: 0.075,
  tooltip: true,
  width: 600,
  xAxisLabel: "X Axis",
  yAxisLabel: "Y Axis"
};

export default HeatChart;
