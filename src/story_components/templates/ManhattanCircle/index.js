import React from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import { Graph, NarrowContainer } from "story_components";
import { SliderProvider, withCaption } from "providers";
import { generateCirclePoints } from "./helpers";
import COLORS from "utils/styles";

function ManhattanCircle({ height, width }) {
  return (
    <NarrowContainer width="50%">
      <SliderProvider
        initialData={[
          {
            min: 1,
            max: 100,
            initialValue: 1,
            step: 1,
            title: r => `Circle radius: ${r}`
          }
        ]}
        render={([r]) => {
          const bound = Math.max(r + 1, 10);
          const xScale = scaleLinear()
            .domain([-bound, bound])
            .range([0, width]);
          const yScale = scaleLinear()
            .domain([-bound, bound])
            .range([height, 0]);
          const points = generateCirclePoints(r);
          return (
            <Graph
              xAxisPosition="center"
              yAxisPosition="center"
              width={width}
              height={height}
              xScale={xScale}
              yScale={yScale}
            >
              <circle cx={xScale(0)} cy={yScale(0)} fill={COLORS.RED} r={8} />
              {points.map(pt => (
                <circle cx={xScale(pt.x)} cy={yScale(pt.y)} r={4} key={`${pt.x}|${pt.y}`} />
              ))}
            </Graph>
          );
        }}
      />
    </NarrowContainer>
  );
}

ManhattanCircle.propTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
};

ManhattanCircle.defaultProps = {
  height: 600,
  width: 600
};

export default withCaption(React.memo(ManhattanCircle));
