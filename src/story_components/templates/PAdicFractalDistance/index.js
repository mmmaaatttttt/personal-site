import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { SelectProvider, withCaption } from "providers";
import { CenteredSVGText, ClippedSVG } from "story_components";
import { generatePAdicPoints } from "./helpers";
import COLORS from "utils/styles";

//TODO
//2. Slider to update the number of fractal iterations.

function PAdicFractalDistance({ primes, xScale, yScale }) {
  return (
    <SelectProvider
      options={[primes.map(p => ({ value: p, label: `Selected prime: ${p}` }))]}
      render={([{ value: prime }]) => {
        const points = generatePAdicPoints(prime, 1);
        return (
          <ClippedSVG id="p-adic-distances">
            {points.map(pt => {
              const x = xScale(pt.cx);
              const y = yScale(pt.cy);
              return (
              <React.Fragment key={`${x}|${y}`}>
                <circle cx={x} cy={y} r={5} />
                <CenteredSVGText x={x} y={y} dy={-15}>{pt.label}</CenteredSVGText>
              </React.Fragment>
            )})}
          </ClippedSVG>
        );
      }}
    />
  );
}

PAdicFractalDistance.propTypes = {
  primes: PropTypes.arrayOf(PropTypes.number).isRequired,
  xScale: PropTypes.func.isRequired,
  yScale: PropTypes.func.isRequired
};

const width = 600;
const height = 600;
const padding = 30;

PAdicFractalDistance.defaultProps = {
  primes: [3, 5, 7, 11],
  xScale: scaleLinear().domain([-1, 1]).range([padding, width - padding]),
  yScale: scaleLinear().domain([-1, 1]).range([height - padding, padding])
};

export default withCaption(React.memo(PAdicFractalDistance));
