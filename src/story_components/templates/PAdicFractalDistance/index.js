import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import NodeGroup from "react-move/NodeGroup";
import { SelectProvider, SliderProvider, withCaption } from "providers";
import { CenteredSVGText, ClippedSVG } from "story_components";
import {
  generatePAdicPoints,
  animationStart,
  animationUpdate,
  animationLeave
} from "./helpers";
import COLORS from "utils/styles";

function fontSize(prime, level) {
  if (level === 3 && prime > 3) return "0%";
  return "100%";
}

function showText(prime, level, num) {
  return (prime === 3 || level < 3) && num < prime ** level;
}

function PAdicFractalDistance({ levelColors, primes, xScale, yScale }) {
  return (
    <SliderProvider
      initialData={[
        {
          color: COLORS.BLACK,
          min: 1,
          max: 3,
          step: 1,
          initialValue: 1,
          minIcon: "compress-arrows-alt",
          maxIcon: "expand-arrows-alt",
          title: val => `Number of generations: ${val}`,
          tickCount: 3
        }
      ]}
      width="50%"
      render={([level]) => {
        return (
          <SelectProvider
            options={[
              primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))
            ]}
            width="100%"
            render={([{ value: prime }]) => {
              const points = generatePAdicPoints(prime, level);
              return (
                <ClippedSVG id="p-adic-distances">
                  <NodeGroup
                    data={points}
                    keyAccessor={(_, i) => i}
                    start={(_, num) =>
                      animationStart(num, prime, points, levelColors)
                    }
                    enter={(d, i) => animationUpdate(d, i, levelColors)}
                    update={(d, i) => animationUpdate(d, i, levelColors)}
                    leave={animationLeave}
                  >
                    {nodePts => (
                      <React.Fragment>
                        {nodePts.map(
                          ({
                            key,
                            data: { num },
                            state: { cx, cy, fill, opacity }
                          }) => {
                            const x = xScale(cx);
                            const y = yScale(cy);
                            return (
                              <g key={key} fill={fill} style={{ opacity }}>
                                <circle cx={x} cy={y} r={3} />
                                {showText(prime, level, num) && (
                                  <CenteredSVGText
                                    x={x}
                                    y={y}
                                    dy={-15}
                                    fontSize={fontSize(prime, level)}
                                  >
                                    {num}
                                  </CenteredSVGText>
                                )}
                              </g>
                            );
                          }
                        )}
                      </React.Fragment>
                    )}
                  </NodeGroup>
                </ClippedSVG>
              );
            }}
          />
        );
      }}
    />
  );
}

PAdicFractalDistance.propTypes = {
  levelColors: PropTypes.arrayOf(PropTypes.string).isRequired,
  primes: PropTypes.arrayOf(PropTypes.number).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
};

const width = 600;
const height = 600;
const padding = 30;

PAdicFractalDistance.defaultProps = {
  levelColors: [COLORS.BLACK, COLORS.BLUE, COLORS.ORANGE],
  primes: [3, 5, 7],
  xScale: scaleLinear()
    .domain([-1, 1])
    .range([padding, width - padding]),
  yScale: scaleLinear()
    .domain([-1, 1])
    .range([height - padding, padding])
};

export default withCaption(React.memo(PAdicFractalDistance));
