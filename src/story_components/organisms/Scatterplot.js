import React, { Component } from "react";
import PropTypes from "prop-types";
// import { arc, pie } from "d3-shape";
// import { format } from "d3-format";
import NodeGroup from "react-move/NodeGroup";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
// import COLORS from "../../utils/styles";
import Graph from "./Graph";

class Scatterplot extends Component {
  render() {
    const { data, width, height, padding, svgId } = this.props;
    const xLabel = "x axis";
    const yLabel = "y axis";
    const xScale = scaleLinear()
      .domain(extent(data, d => d.cx))
      .range([padding, width - padding]);
    const yScale = scaleLinear()
      .domain(extent(data, d => d.cy))
      .range([height - padding, padding]);
    const areaScale = scaleLinear()
      .domain(extent(data, d => d.area))
      .range([25, 2500]);
    const circles = (
      <NodeGroup
        data={data}
        keyAccessor={d => d.key}
        start={({ cx, cy, fill }) => ({
          cx: xScale(cx),
          cy: yScale(cy),
          fill,
          r: 0
        })}
        enter={({ area }) => {
          debugger;
          return {
            r: [areaScale(area) ** (1 / 2)],
            timing: { duration: 500 }
          };
        }}
        update={({ cx, cy, area, fill }) => ({
          cx: [xScale(cx)],
          cy: [yScale(cy)],
          r: [areaScale(area) ** (1 / 2)],
          fill: [fill],
          timing: { duration: 500 }
        })}
      >
        {nodes => (
          <g>
            {nodes.map(({ key, data, state }) => {
              const { cx, cy, r, fill } = state;
              return <circle cx={cx} cy={cy} r={r} fill={fill} key={key} />;
            })}
          </g>
        )}
      </NodeGroup>
    );
    return (
      <div>
        <Graph
          svgId={svgId}
          width={width}
          height={height}
          padding={padding}
          xLabel={xLabel}
          yLabel={yLabel}
          xScale={xScale}
          yScale={yScale}
        >
          {circles}
        </Graph>
      </div>
    );
  }
}

Scatterplot.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      cx: PropTypes.number.isRequired,
      cy: PropTypes.number.isRequired,
      area: PropTypes.number.isRequired,
      fill: PropTypes.string.isRequired
    })
  ).isRequired,
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  padding: PropTypes.number.isRequired
};

Scatterplot.defaultProps = {
  width: 600,
  height: 600,
  svgId: "scatterplot",
  padding: 0
};

export default Scatterplot;
