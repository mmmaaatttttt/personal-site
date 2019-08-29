import React from "react";
import PropTypes from "prop-types";
import { zip } from "lodash";
import { min, max } from "d3-array";
import { stack } from "d3";
import { scaleBand, scaleLinear } from "d3-scale";
import { NodeGroup } from "react-move";
import {
  Axis,
  AxisLabel,
  ClippedSVG,
  Legend,
  NarrowContainer,
  TranslucentRect
} from "story_components";
import { paddingType } from "utils/types";
import { paddingObj } from "utils/styles";
import { TooltipProvider } from "providers";

function MultiBarGraph({
  colors,
  containerWidth,
  data,
  height,
  id,
  legendTitle,
  padding,
  getTooltipData,
  width,
  yAxisLabel,
  yMax
}) {
  padding = paddingObj(padding);
  const labels = Object.keys(data[0].counts);
  const stackData = stack().keys(labels)(data.map(d => d.counts));
  const barData = zip(...stackData);
  const tooltipData = data.map(getTooltipData);
  const yMin = min(stackData[0], d => d[0]);
  yMax = yMax || max(stackData[stackData.length - 1], d => d[d.length - 1]);
  const xScale = scaleBand()
    .domain(stackData[0].map((_, i) => i))
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
        <NarrowContainer width={containerWidth} fullWidthAt="small">
          <Legend
            title={legendTitle}
            labels={labels.map((label, i) => ({
              text: label,
              color: colors[i]
            }))}
          />
          <ClippedSVG id={id} width={width} height={height}>
            <NodeGroup
              data={barData}
              keyAccessor={(_, i) => i}
              start={extents => ({ extents })}
              enter={extents => ({ extents: [extents] })}
              update={extents => ({ extents: [extents] })}
            >
              {bars => (
                <React.Fragment>
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
                  <Axis
                    direction="x"
                    scale={xScale}
                    yShift={height - padding.bottom}
                  />
                  {bars.map((bar, i) => {
                    const { extents } = bar.state;
                    return (
                      <TranslucentRect as="g" key={`${extents}-${i}`}>
                        {extents.map(([minVal, maxVal], barIdx) => {
                          const { title, body } = tooltipData[i];
                          return (
                            <rect
                              key={`${minVal}-${maxVal}-${i}`}
                              fill={colors[barIdx]}
                              x={xScale(i)}
                              y={yScale(maxVal)}
                              height={yScale(minVal) - yScale(maxVal)}
                              width={xScale.step() - 5}
                              onMouseMove={
                                tooltipShow && tooltipShow(title, body)
                              }
                              onMouseLeave={tooltipHide}
                              onTouchMove={
                                tooltipShow && tooltipShow(title, body)
                              }
                              onTouchEnd={tooltipHide}
                            />
                          );
                        })}
                      </TranslucentRect>
                    );
                  })}
                </React.Fragment>
              )}
            </NodeGroup>
            <AxisLabel
              x={labelX}
              y={labelY}
              transform={`rotate(-90 ${labelX} ${labelY})`}
            >
              {yAxisLabel}
            </AxisLabel>
          </ClippedSVG>
        </NarrowContainer>
      )}
    />
  );
}

MultiBarGraph.propTypes = {
  containerWidth: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      meta: PropTypes.object.isRequired,
      counts: PropTypes.object.isRequired
    })
  ),
  colors: PropTypes.arrayOf(PropTypes.string.isRequired),
  height: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  legendTitle: PropTypes.string.isRequired,
  padding: paddingType,
  getTooltipData: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  yAxisLabel: PropTypes.string.isRequired,
  yMax: PropTypes.number
};

MultiBarGraph.defaultProps = {
  colors: ["red", "blue"],
  containerWidth: "60%",
  data: [
    {
      meta: {
        id: 1,
        title: "Episode",
        date: "8/10/2019"
      },
      counts: {
        Chris: 0,
        Caller: 0
      }
    }
  ],
  getTooltipData: () => ({ title: "Title", body: "body" }),
  height: 400,
  id: "multi-bar-graph",
  legendTitle: "Legend",
  padding: 0,
  width: 600,
  yAxisLabel: "Y Axis Label"
};

export default MultiBarGraph;
