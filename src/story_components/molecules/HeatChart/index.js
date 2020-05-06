import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { NodeGroup } from "react-move";
import { scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG } from "story_components";
import { useTooltip } from "hooks";
import COLORS from "utils/styles";

const defaults = {
  accessor: d => d,
  colorDomain: [0, 1],
  colorRange: [COLORS.RED, COLORS.GREEN],
  data: [[[]]],
  getTooltipBody: d => JSON.stringify(d, null, 4),
  getTooltipTitle: () => ""
};

const xLabelPos = { y: "9", dy: "0.71em" };
const yLabelPos = { y: "-9", dy: "0.32em" };

function HeatChart({
  accessor = defaults.accessor,
  axes = true,
  children,
  colorDomain = defaults.colorDomain,
  colorRange = defaults.colorRange,
  data = defaults.data,
  delayMultiplier = 10,
  getTooltipBody = defaults.getTooltipBody,
  getTooltipTitle = defaults.getTooltipTitle,
  id = "svg",
  paddingScale = 0.075,
  tooltip = true,
  width = 600,
  xAxisLabel = "X Axis",
  yAxisLabel = "Y Axis"
}) {
  const { height, paddingX, paddingY } = useMemo(() => {
    const squareWidth = width / data.length;
    const height = data[0].length * squareWidth;
    return {
      height,
      paddingX: width * paddingScale,
      paddingY: height * paddingScale
    };
  }, [width, data, paddingScale]);
  const xScale = useCallback(
    scaleLinear()
      .domain([0, data.length])
      .range([paddingX, width - paddingX]),
    [data, paddingX, width]
  );
  const yScale = useCallback(
    scaleLinear()
      .domain([0, Array.isArray(data[0]) ? data[0].length : 0])
      .range([height - paddingY, paddingY]),
    [data, height, paddingY]
  );
  const colorScale = useCallback(
    scaleLinear().domain(colorDomain).range(colorRange),
    [colorDomain, colorRange]
  );

  const [renderTooltip, showTooltip, handleHide] = useTooltip();

  let handleShow = useCallback(
    d => {
      const title = getTooltipTitle(d);
      const body = getTooltipBody(d);
      return e => showTooltip(title, body, e.pageX, e.pageY);
    },
    [getTooltipTitle, getTooltipBody, showTooltip]
  );

  let axesJSX = null;
  if (axes) {
    axesJSX = (
      <g>
        <Axis
          direction="x"
          labelPosition={xLabelPos}
          scale={xScale}
          tickFormat=","
          tickColor={COLORS.BLACK}
          yShift={height - paddingY}
        />
        <Axis
          direction="y"
          labelPosition={yLabelPos}
          scale={yScale}
          textAnchor="end"
          tickFormat=","
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
  }

  const rectData = useMemo(
    () =>
      data.reduce(
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
      ),
    [xScale, yScale, colorScale, accessor, data]
  );

  return (
    <div>
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
          {rects => (
            <g>
              {rects.map(({ key, data, state: { fill } }) => (
                <rect
                  key={key}
                  x={data.x}
                  y={data.y}
                  width={xScale(1) - 2 - paddingX}
                  height={height - yScale(1) - 2 - paddingY}
                  fill={fill}
                  onMouseMove={tooltip ? handleShow(data) : undefined}
                  onTouchMove={tooltip ? handleShow(data) : undefined}
                  onMouseLeave={tooltip ? handleHide : undefined}
                  onTouchEnd={tooltip ? handleHide : undefined}
                />
              ))}
            </g>
          )}
        </NodeGroup>
        {children &&
          React.cloneElement(children, { paddingX, paddingY })}
        {axesJSX}
      </ClippedSVG>
      {tooltip && renderTooltip()}
    </div>
  );
}

HeatChart.propTypes = {
  accessor: PropTypes.func,
  axes: PropTypes.bool,
  colorDomain: PropTypes.arrayOf(PropTypes.number),
  colorRange: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.array,
  delayMultiplier: PropTypes.number,
  getTooltipBody: PropTypes.func,
  getTooltipTitle: PropTypes.func,
  id: PropTypes.string,
  paddingScale: PropTypes.number,
  tooltip: PropTypes.bool,
  width: PropTypes.number,
  xAxisLabel: PropTypes.string,
  yAxisLabel: PropTypes.string
};

export default React.memo(HeatChart);
