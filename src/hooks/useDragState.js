import { useState, useCallback } from "react";

function useDragState(initialState, xScale, yScale) {
  const [points, setPoints] = useState(initialState);
  const handleDrag = useCallback(
    (idx, { x, y }) => {
      const pointsCopy = [...points];
      pointsCopy[idx] = { x: xScale.invert(x), y: yScale.invert(y) };
      setPoints(pointsCopy);
    },
    [points, setPoints, xScale, yScale]
  );
  return [points, handleDrag];
}

export default useDragState;