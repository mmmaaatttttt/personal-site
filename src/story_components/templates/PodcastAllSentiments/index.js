import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { NodeGroup } from "react-move";
import { Graph, Legend, NarrowContainer } from "story_components";
import { SelectProvider, withCaption } from "providers";
import { paddingType } from "utils/types";
import COLORS from "utils/styles";
import { colorMap } from "data/beautiful-analysis";

function PodcastAllSentiments({ data, height, padding, width, svgId }) {
  const yScale = scaleLinear()
    .domain([-1, 1])
    .range([height - padding.bottom, padding.top]);
  const xScale = scaleLinear().range([padding.left, width - padding.right]);
  return (
    <SelectProvider
      options={[
        data.map((ep, i) => ({
          value: i,
          label: `Episode ${ep.id}: ${ep.title}`
        }))
      ]}
      margin="0.5rem 0"
      render={([{ value }]) => {
        const circData = data[value].sentiment_counts
          .filter(d => d[0] in colorMap) // remove lines from third parties
          .map(([speaker, sentiment, wc], i) => ({
            x: i,
            y: sentiment,
            r: wc ** (1 / 2),
            fill: colorMap[speaker]
          }));
        xScale.domain([0, circData.length]);
        return (
          <NarrowContainer
            width="125%"
            margin="0 0 0 -12.5%"
            fullWidthAt="small"
          >
            <Legend
              title="Sentiment Changes During Episode"
              labels={Object.keys(colorMap).map(text => ({
                text,
                color: colorMap[text]
              }))}
            />
            <Graph
              graphPadding={padding}
              height={height}
              svgId={svgId}
              svgPadding={0}
              tickFormatY=".1f"
              width={width}
              xScale={xScale}
              xAxisPosition="center"
              yLabel="Sentiment"
              yScale={yScale}
            >
              <NodeGroup
                data={circData}
                keyAccessor={(_, i) => i}
                start={({ x, y }, i) => ({ x, y, r: 0 })}
                enter={({ x, y, r }, i) => ({
                  x: [x],
                  y: [y],
                  r: [r],
                  timing: { duration: 500, delay: 10 * i }
                })}
                update={({ x, y, r }, i) => ({
                  x: [x],
                  y: [y],
                  r: [r],
                  timing: { duration: 500, delay: 10 * i }
                })}
                exit={() => ({ r: [0] })}
              >
                {circles => (
                  <g>
                    {circles.map(d => {
                      const {
                        key,
                        state: { x, y, r }
                      } = d;
                      return (
                        <circle
                          key={key}
                          cx={xScale(x)}
                          cy={yScale(y)}
                          fill={d.data.fill}
                          r={r}
                          opacity="0.7"
                        />
                      );
                    })}
                  </g>
                )}
              </NodeGroup>
              <line
                x1={xScale(0)}
                x2={xScale(circData.length)}
                y1={yScale(0)}
                y2={yScale(0)}
                strokeWidth={2}
                stroke={COLORS.BLACK}
              />
            </Graph>
          </NarrowContainer>
        );
      }}
    />
  );
}

PodcastAllSentiments.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      sentiment_counts: PropTypes.array.isRequired
    })
  ).isRequired,
  height: PropTypes.number.isRequired,
  padding: paddingType,
  svgId: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired
};

PodcastAllSentiments.defaultProps = {
  data: [],
  height: 400,
  padding: { top: 10, left: 50, right: 20, bottom: 10 },
  svgId: "all-sentiments",
  width: 800
};

export default withCaption(PodcastAllSentiments);
