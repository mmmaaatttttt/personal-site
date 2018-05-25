import React, { Component } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { ClippedSVG, Tooltip } from "story_components";
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
      data,
      colorDomain,
      colorRange,
      accessor
    } = this.props;
    const xScale = scaleLinear()
      .domain([0, data.length])
      .range([0, width]);
    const yScale = scaleLinear()
      .domain([-1, Array.isArray(data[0]) ? data[0].length - 1 : 0])
      .range([height, 0]);
    const colorScale = scaleLinear()
      .domain(colorDomain)
      .range(colorRange);
    const rects = data.reduce(
      (rectArr, row, x) =>
        rectArr.concat(
          row.map((d, y) => (
            <rect
              key={`${x}:${y}`}
              x={xScale(x) + 1}
              y={yScale(y) + 1}
              width={xScale(1) - 2}
              height={height - yScale(0) - 2}
              fill={colorScale(accessor(d))}
              onMouseMove={this.handleTooltipShow.bind(this, d)}
              onMouseLeave={this.handleTooltipHide}
              onTouchMove={this.handleTooltipShow.bind(this, d)}
              onTouchEnd={this.handleTooltipHide}
            />
          ))
        ),
      []
    );
    return (
      <div>
        <ClippedSVG width={width} height={height}>
          {rects}
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
  data: [],
  accessor: d => d,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  getTooltipBody: d => JSON.stringify(d, null, 4)
};

export default HeatChart;
