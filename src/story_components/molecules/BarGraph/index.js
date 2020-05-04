import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { NodeGroup } from "react-move";
import { scaleBand, scaleLinear } from "d3-scale";
import { Axis, CenteredSVGText, ClippedSVG } from "story_components";
import COLORS, { paddingObj } from "utils/styles";
import { paddingType } from "utils/types";

const defaultBarData = [
  {
    key: 0,
    height: 0,
    color: COLORS.MAROON
  }
];
const defaultTimingObj = { duration: 100 };

function BarGraph({
  barData = defaultBarData,
  barLabel = null,
  color = COLORS.MAROON,
  height = 600,
  histogram = false,
  labelFontSize = null,
  padding = 0,
  thresholds = null,
  tickFormat = null,
  yTickLabelPosition = "bottom",
  yTickFormat = null,
  tickStep = null,
  timing = defaultTimingObj,
  svgId = "BarGraph",
  width = 600,
  yScale = () => {
    console.warn("BarGraph requires a yScale function");
  }
}) {
  // normalize padding to always be an object
  padding = paddingObj(padding);

  const xScale = histogram
    ? scaleLinear()
        .domain([thresholds[0], thresholds[thresholds.length - 1]])
        .rangeRound([padding.left, width - padding.right])
    : scaleBand()
        .domain(barData.map((_, i) => i))
        .rangeRound([padding.left, width - padding.right])
        .padding(0.1);
  let fontSize = labelFontSize;
  if (!fontSize)
    fontSize = barData.length < 11 ? "100%" : `${110 - 1 * barData.length}%`;

  const handleStart = useCallback(
    (d, i) => ({
      x: histogram ? xScale(d.x0) + 1 : xScale(i),
      fill: d.color || color,
      width: histogram ? xScale(d.x1) - xScale(d.x0) - 2 : xScale.bandwidth(),
      barHeight: yScale(d.height)
    }),
    [xScale, histogram, color, yScale]
  );

  const handleEnterAndUpdate = useCallback(
    (d, i) => ({
      x: [histogram ? xScale(d.x0) + 1 : xScale(i)],
      width: [histogram ? xScale(d.x1) - xScale(d.x0) - 2 : xScale.bandwidth()],
      barHeight: [yScale(d.height)],
      fill: d.color || color,
      timing: {
        duration: timing.duration,
        delay: timing.delay * i || 0
      }
    }),
    [xScale, histogram, timing, color, yScale]
  );

  return (
    <ClippedSVG id={svgId} width={width} height={height}>
      <NodeGroup
        data={barData}
        keyAccessor={d => d.key}
        start={handleStart}
        enter={handleEnterAndUpdate}
        update={handleEnterAndUpdate}
      >
        {bars => (
          <g>
            {bars.map(bar => {
              const { x, fill, width, barHeight } = bar.state;
              const text = barLabel && (
                <CenteredSVGText
                  x={x}
                  dx={width / 2}
                  y={barHeight}
                  dy={-12}
                  fontSize={fontSize}
                >
                  {barLabel(bar.data)}
                </CenteredSVGText>
              );
              return (
                <g key={bar.key}>
                  <rect
                    x={x}
                    width={width}
                    y={barHeight}
                    height={height - barHeight - padding.bottom}
                    fill={fill}
                  />
                  {text}
                </g>
              );
            })}
            <Axis
              direction="y"
              fontSize="0.6rem"
              labelPosition={
                yTickLabelPosition === "bottom"
                  ? { x: "4", dy: "12" }
                  : { x: "-5" }
              }
              scale={yScale}
              xShift={padding.left}
              yShift={0}
              textAnchor={yTickLabelPosition === "bottom" ? "start" : "end"}
              tickFormat={yTickFormat}
              tickSize={-width + padding.left + padding.right}
              tickStep={tickStep}
            />
            {histogram && (
              <Axis
                direction="x"
                rotateLabels
                scale={xScale}
                tickStep={thresholds[1] - thresholds[0]}
                tickFormat={tickFormat}
                labelPosition={{ y: "0.35em", x: "9", dy: "0" }}
                textAnchor="start"
                yShift={height - padding.bottom}
              />
            )}
          </g>
        )}
      </NodeGroup>
    </ClippedSVG>
  );
}

BarGraph.propTypes = {
  barData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes,
      height: PropTypes.number,
      color: PropTypes.string, // used to vary color by bar
      x0: PropTypes.number, // required for a histogram
      x1: PropTypes.number // required for a histogram
    })
  ),
  barLabel: PropTypes.func,
  color: PropTypes.string, // can use one color here if all bars should be the same
  height: PropTypes.number,
  histogram: PropTypes.bool,
  labelFontSize: PropTypes.string,
  padding: paddingType,
  thresholds: PropTypes.arrayOf(PropTypes.number),
  tickFormat: PropTypes.string,
  yTickLabelPosition: PropTypes.oneOf(["bottom", "left"]),
  yTickFormat: PropTypes.string,
  tickStep: PropTypes.number,
  timing: PropTypes.object,
  svgId: PropTypes.string,
  width: PropTypes.number,
  yScale: PropTypes.func
};

export default React.memo(BarGraph);
