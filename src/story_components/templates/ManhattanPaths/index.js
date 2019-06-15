import React, { useState } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import {
  Graph,
  LabeledSlider,
  NarrowContainer,
  NoScrollCircle,
  Polygon
} from "story_components";
import { withCaption } from "providers";
import {
  generatePathOptions,
  generatePathPoints,
  generateGridPoints
} from "./helpers";
import { svgProps, svgDefaultProps } from "utils/types";
import COLORS from "utils/styles";

function ManhattanPaths({
  width,
  height,
  graphPadding,
  pointRadius,
  xScale,
  yScale
}) {
  const [activePoint, setActivePoint] = useState({ x: 2, y: 2 });
  const [sliderVal, setSliderVal] = useState(1);
  const handleClick = e => {
    setActivePoint({
      x: xScale.invert(e.target.cx.baseVal.value),
      y: yScale.invert(e.target.cy.baseVal.value)
    });
    setSliderVal(1);
  };
  const paths = generatePathOptions(activePoint.y, activePoint.x);
  const points = generatePathPoints(paths[sliderVal - 1]).map(pt => ({
    x: xScale(pt.x),
    y: yScale(pt.y)
  }));
  const gridPoints = generateGridPoints(xScale, yScale);
  return (
    <NarrowContainer width="50%">
      <LabeledSlider 
        handleValueChange={setSliderVal}
        max={paths.length}
        min={1}
        step={1}
        title={`Path ${sliderVal} of ${paths.length}`}
        value={sliderVal}
      />
      <Graph
        width={width}
        height={height}
        xScale={xScale}
        yScale={yScale}
        graphPadding={graphPadding}
        tickStep={() => 1}
      >
        {gridPoints.map(pt => {
          const isActive = pt.x === activePoint.x && pt.y === activePoint.y;
          const color = isActive ? COLORS.BLACK : COLORS.LIGHT_GRAY;
          return (
            <NoScrollCircle
              cx={xScale(pt.x)}
              cy={yScale(pt.y)}
              r={pointRadius}
              fill={color}
              stroke={color}
              onClick={isActive ? null : handleClick}
              key={`${pt.x}|${pt.y}`}
            />
          );
        })}
        <Polygon
          points={points}
          open
          fill="none"
          strokeWidth={pointRadius / 2}
        />
      </Graph>
    </NarrowContainer>
  );
}

const GRAPH_PADDING = 20;

ManhattanPaths.propTypes = {
  ...svgProps,
  graphPadding: PropTypes.number.isRequired,
  pointRadius: PropTypes.number.isRequired
};

ManhattanPaths.defaultProps = {
  ...svgDefaultProps,
  graphPadding: GRAPH_PADDING,
  pointRadius: 8,
  xScale: scaleLinear()
    .domain([0, 5])
    .range([GRAPH_PADDING, svgDefaultProps.width - GRAPH_PADDING]),
  yScale: scaleLinear()
    .domain([0, 5])
    .range([svgDefaultProps.height - GRAPH_PADDING, GRAPH_PADDING])
};

export default withCaption(React.memo(ManhattanPaths));
