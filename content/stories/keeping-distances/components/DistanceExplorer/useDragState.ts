import { ScaleLinear } from "d3-scale";
import { useCallback, useState } from "react";

function useDragState(
  initialState: { x: number; y: number }[],
  xScale: ScaleLinear<number, number>,
  yScale: ScaleLinear<number, number>
): [{ x: number; y: number }[], (idx: number, coords: { x: number; y: number }) => void] {
  const [points, setPoints] = useState(initialState);
  const handleDrag = useCallback(
    (idx: number, { x, y }: { x: number; y: number }) => {
      const pointsCopy = [...points];
      pointsCopy[idx] = { x: xScale.invert(x), y: yScale.invert(y) };
      setPoints(pointsCopy);
    },
    [points, xScale, yScale]
  );
  return [points, handleDrag];
}

export default useDragState;
