import React, { useState, useCallback } from "react";
import { DraggableCircle, Graph, NarrowContainer } from "story_components";
import { svgProps, svgDefaultProps } from "utils/types";

function DistanceExplorer({ width, height, xScale, yScale }) {
  const [points, setPoints] = useState([{x: 2, y: 2}, {x: -2, y: -2}])
  const handleDrag = useCallback((idx, {x, y}) => {
    const pointsCopy = [...points];
    pointsCopy[idx] = { x: xScale.invert(x), y: yScale.invert(y) };
    setPoints(pointsCopy);
  }, [points, setPoints, xScale, yScale])
  return (
    <NarrowContainer>
      <Graph
        xAxisPosition="center"
        yAxisPosition="center"
        width={width}
        height={height}
        xScale={xScale}
        yScale={yScale}
      >
        {points.map((point, idx) => (
          <DraggableCircle
            key={idx}
            id={idx}
            cx={xScale(point.x)}
            cy={yScale(point.y)}
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

export default React.memo(DistanceExplorer);
