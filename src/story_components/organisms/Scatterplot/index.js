import React from "react";
import PropTypes from "prop-types";
import NodeGroup from "react-move/NodeGroup";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { darken } from "polished";
import { Graph } from "story_components";

const Scatterplot = ({
  data,
  width,
  height,
  graphPadding,
  svgId,
  xLabel,
  yLabel,
  tickFormatX,
  tickFormatY
}) => {
  const xScale = scaleLinear()
    .domain(extent(data, d => d.cx))
    .range([graphPadding, width - graphPadding]);
  const yScale = scaleLinear()
    .domain(extent(data, d => d.cy))
    .range([height - graphPadding, graphPadding]);
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
      enter={({ area }, i) => {
        return {
          r: [area ** (1 / 2)],
          timing: { duration: 500, delay: i * 2 }
        };
      }}
      update={({ cx, cy, area, fill }, i) => ({
        cx: [xScale(cx)],
        cy: [yScale(cy)],
        r: [area ** (1 / 2)],
        fill: [fill],
        timing: { duration: 500, delay: i * 2 }
      })}
    >
      {nodes => (
        <g>
          {nodes.map(({ key, data, state }) => {
            const { cx, cy, r, fill } = state;
            return (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={fill}
                stroke={darken(0.3, fill)}
                strokeWidth={2}
                key={key}
              />
            );
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
        graphPadding={graphPadding}
        xLabel={xLabel}
        yLabel={yLabel}
        xScale={xScale}
        yScale={yScale}
        tickFormatX={tickFormatX}
        tickFormatY={tickFormatY}
      >
        {circles}
      </Graph>
    </div>
  );
};

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
  graphPadding: PropTypes.number.isRequired,
  xLabel: PropTypes.string.isRequired,
  yLabel: PropTypes.string.isRequired,
  tickFormatX: PropTypes.string.isRequired,
  tickFormatY: PropTypes.string.isRequired
};

Scatterplot.defaultProps = {
  width: 600,
  height: 600,
  svgId: "scatterplot",
  graphPadding: 0,
  xLabel: "",
  yLabel: "",
  tickFormatX: "",
  tickFormatY: ""
};

export default Scatterplot;
