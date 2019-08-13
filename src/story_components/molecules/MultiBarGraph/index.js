import React from "react";
import PropTypes from "prop-types";
import { min, max } from "d3-array";
import { scaleBand, scaleLinear } from "d3-scale";
import { Axis, AxisLabel, ClippedSVG } from "story_components";
import { paddingType } from "utils/types";
import { paddingObj } from "utils/styles";
import { TooltipProvider } from "providers";

function MultiBarGraph({
  barData,
  colors,
  height,
  id,
  padding,
  tooltipData,
  width
}) {
  padding = paddingObj(padding);
  const yMin = min(barData[0], d => d[0]);
  const yMax = max(barData[barData.length - 1], d => d[d.length - 1]);
  const xScale = scaleBand()
    .domain(barData[0].map((_, i) => i))
    .rangeRound([padding.left, width - padding.right])
    .padding(0.1);
  const yScale = scaleLinear()
    .domain([yMin, yMax])
    .range([height - padding.bottom, padding.top]);
  const labelX = padding.left / 4;
  const labelY = (height - padding.top - padding.bottom) / 2;
  return (
    <TooltipProvider
      render={(tooltipShow, tooltipHide) => (
        <ClippedSVG id={id} width={width} height={height}>
          {barData.map((extents, i) => (
            <g key={`${extents}-${i}`}>
              {extents.map(([minVal, maxVal], barIdx) => {
                const { title, body } = tooltipData[barIdx];
                return (
                  <rect
                    key={`${minVal}-${maxVal}-${barIdx}`}
                    fill={colors[i]}
                    x={xScale(barIdx)}
                    y={yScale(maxVal)}
                    height={yScale(minVal) - yScale(maxVal)}
                    width={xScale.step() - 5}
                    onMouseMove={tooltipShow && tooltipShow(title, body)}
                    onMouseLeave={tooltipHide}
                    onTouchMove={tooltipShow && tooltipShow(title, body)}
                    onTouchEnd={tooltipHide}
                  />
                );
              })}
            </g>
          ))}
          <Axis
            direction="y"
            fontSize="0.6rem"
            labelPosition={{ x: "-5" }}
            scale={yScale}
            xShift={padding.left}
            yShift={0}
            textAnchor={"end"}
            tickFormat={",.0f"}
            tickSize={-width + padding.left + padding.right}
          />
          <Axis direction="x" scale={xScale} yShift={height - padding.bottom} />
          <AxisLabel
            x={labelX}
            y={labelY}
            transform={`rotate(-90 ${labelX} ${labelY})`}
          >
            Words Spoken
          </AxisLabel>
        </ClippedSVG>
      )}
    />
  );
}

MultiBarGraph.propTypes = {
  barData: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  ).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string.isRequired),
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  padding: paddingType,
  tooltipData: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
      body: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
      ]).isRequired
    })
  ).isRequired,
  width: PropTypes.number.isRequired
};

MultiBarGraph.defaultProps = {
  barData: [[1, 2], [3, 4]],
  colors: ["red", "blue"],
  height: 400,
  id: "multi-bar-graph",
  padding: 0,
  tooltipData: [{ body: "", title: "" }],
  width: 600
};

export default MultiBarGraph;
