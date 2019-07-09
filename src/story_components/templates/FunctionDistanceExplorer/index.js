import React, { useState } from "react";
import PropTypes from "prop-types";
import { scaleLinear } from "d3-scale";
import {
  DraggableCircle,
  Graph,
  NarrowContainer,
  Polygon,
  ToggleSwitch
} from "story_components";
import { withCaption } from "providers";
import { useDragState } from "hooks";
import { clamped, lInfNormEndpoints, l1Norm } from "./helpers";
import { svgProps, svgDefaultProps } from "utils/types";
import COLORS from "utils/styles";

function FunctionDistanceExplorer({
  width,
  height,
  graphPadding,
  xScale,
  yScale
}) {
  const [xMin, xMax] = xScale.domain();
  const xAvg = (xMax - xMin) / 2;
  const [yMin, yMax] = yScale.domain();
  const [points, handleDrag] = useDragState(
    [
      { x: xMin, y: yMax - 1 },
      { x: xAvg, y: yMax - 1 },
      { x: xMax, y: yMax - 1 },
      { x: xMin, y: yMin + 1 },
      { x: xAvg, y: yMin + 1 },
      { x: xMax, y: yMin + 1 }
    ],
    xScale,
    yScale
  );
  const [l1NormActive, handleNormToggle] = useState(false);
  const clamped1Pts = clamped(points.slice(0, 3), xScale, yScale);
  const clamped2Pts = clamped(points.slice(3), xScale, yScale);
  const graph1Pts = clamped1Pts.map(pt => ({
    x: xScale(pt.x),
    y: yScale(pt.y)
  }));
  const graph2Pts = clamped2Pts.map(pt => ({
    x: xScale(pt.x),
    y: yScale(pt.y)
  }));
  const lInfPts = lInfNormEndpoints(graph1Pts, graph2Pts);
  const lInfDistance = Math.abs(
    yScale.invert(lInfPts.y1) - yScale.invert(lInfPts.y2)
  ).toFixed(2);
  const area = l1Norm(clamped1Pts, clamped2Pts).toFixed(2);
  return (
    <NarrowContainer width="50%">
      <ToggleSwitch
        leftText={`Largest Diff: ${lInfDistance}`}
        rightText={`Area: ${area}`}
        leftColor={COLORS.PURPLE}
        rightColor={COLORS.GRAY}
        handleSwitchChange={() => handleNormToggle(!l1NormActive)}
      />
      <Graph
        xScale={xScale}
        yScale={yScale}
        graphPadding={graphPadding}
        width={width}
        height={height}
        tickStep={() => 1}
      >
        {l1NormActive && (
          <Polygon
            points={[...graph1Pts, ...[...graph2Pts].reverse()]}
            open
            fill={COLORS.GRAY}
            stroke="none"
          />
        )}
        {!l1NormActive && (
          <line
            {...lInfPts}
            stroke={COLORS.PURPLE}
            strokeWidth={4}
            strokeDasharray="8 4"
          />
        )}
        <Polygon points={graph1Pts} open fill="none" stroke={COLORS.ORANGE} />
        <Polygon points={graph2Pts} open fill="none" stroke={COLORS.GREEN} />
        {graph1Pts.map((pt, i) => {
          return (
            <DraggableCircle
              axis={i === 1 ? "both" : "y"}
              cx={pt.x}
              cy={pt.y}
              id={i}
              fill={COLORS.ORANGE}
              onDrag={handleDrag}
              stroke={COLORS.ORANGE}
              key={i}
            />
          );
        })}
        {graph2Pts.map((pt, i) => {
          return (
            <DraggableCircle
              axis={i === 1 ? "both" : "y"}
              cx={pt.x}
              cy={pt.y}
              id={i + 3}
              fill={COLORS.GREEN}
              onDrag={handleDrag}
              stroke={COLORS.GREEN}
              key={i}
            />
          );
        })}
      </Graph>
    </NarrowContainer>
  );
}

FunctionDistanceExplorer.propTypes = {
  ...svgProps,
  graphPadding: PropTypes.number.isRequired
};

const padding = 20;

FunctionDistanceExplorer.defaultProps = {
  ...svgDefaultProps,
  graphPadding: padding,
  xScale: scaleLinear()
    .domain([0, 5])
    .range([padding, svgDefaultProps.width - padding]),
  yScale: scaleLinear()
    .domain([0, 5])
    .range([svgDefaultProps.height - padding, padding])
};

export default withCaption(React.memo(FunctionDistanceExplorer));
