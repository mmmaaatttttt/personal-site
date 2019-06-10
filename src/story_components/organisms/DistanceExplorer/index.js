import React, { useState, useCallback } from "react";
import { extent } from "d3-array";
import {
  CenteredSVGText,
  DraggableCircle,
  Graph,
  NarrowContainer
} from "story_components";
import { svgProps, svgDefaultProps } from "utils/types";
import COLORS from "utils/styles";
import { euclideanDistance, average } from "utils/mathHelpers";
import { withCaption } from "providers";

function DistanceExplorer({ width, height, xScale, yScale }) {
  const [points, setPoints] = useState([{ x: -2, y: -2 }, { x: 2, y: 2 }]);
  const handleDrag = useCallback(
    (idx, { x, y }) => {
      const pointsCopy = [...points];
      pointsCopy[idx] = { x: xScale.invert(x), y: yScale.invert(y) };
      setPoints(pointsCopy);
    },
    [points, setPoints, xScale, yScale]
  );
  const scaledPoints = points.map(({ x, y }) => ({
    x: xScale(x),
    y: yScale(y)
  }));
  const theta = Math.atan((points[1].y - points[0].y) / (points[1].x - points[0].x));
  const [minX, maxX] = extent(scaledPoints, d => d.x);
  const [minY, maxY] = extent(scaledPoints, d => d.y);
  const textX = average(scaledPoints, p => p.x);
  const textY = average(scaledPoints, p => p.y);
  return (
    <NarrowContainer>
      <Graph
        xAxisPosition="center"
        yAxisPosition="center"
        width={width}
        height={height}
        xScale={xScale}
        yScale={yScale}
        tickStep={() => 1}
      >
        {/* Only show two lines, but which two depends on 
            the orientation of the points. */}
        <g stroke="black" strokeWidth="3" strokeDasharray="3">
          {scaledPoints[0].x === minX && (
            <line x1={maxX} x2={maxX} y1={minY} y2={maxY} />
          )}
          {scaledPoints[0].x === maxX && (
            <line x1={minX} x2={minX} y1={minY} y2={maxY} />
          )}
          {scaledPoints[0].y === minY && (
            <line x1={minX} x2={maxX} y1={minY} y2={minY} />
          )}
          {scaledPoints[0].y === maxY && (
            <line x1={minX} x2={maxX} y1={maxY} y2={maxY} />
          )}
        </g>
        <line
          x1={scaledPoints[0].x}
          x2={scaledPoints[1].x}
          y1={scaledPoints[0].y}
          y2={scaledPoints[1].y}
          stroke={COLORS.ORANGE}
          strokeWidth="3"
        />
        <CenteredSVGText
          x={textX}
          y={textY}
          fill={COLORS.ORANGE}
          transform={`rotate(${-180 / Math.PI * theta}, ${textX}, ${textY})`}
          dy={- Math.sign(theta) * 20}
          fontWeight="bold"
        >
          {euclideanDistance(
            points[1].x - points[0].x,
            points[1].y - points[0].y
          ).toFixed(2)}
        </CenteredSVGText>
        {scaledPoints.map((point, idx) => (
          <DraggableCircle
            key={idx}
            id={idx}
            cx={point.x}
            cy={point.y}
            onDrag={handleDrag}
          />
        ))}
      </Graph>
    </NarrowContainer>
  );
}

DistanceExplorer.propTypes = {
  ...svgProps
};

DistanceExplorer.defaultProps = {
  ...svgDefaultProps
};

export default withCaption(React.memo(DistanceExplorer));
