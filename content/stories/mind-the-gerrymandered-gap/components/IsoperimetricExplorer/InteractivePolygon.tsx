import type { FC } from "react";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import type { Point } from "@/types/geometry";

interface InteractivePolygonProps {
  points: Point[];
  fill: string;
  stroke: string;
  strokeWidth: number;
  circleRadius: number;
  onDrag: (id: number, coords: { x: number; y: number }) => void;
}

const InteractivePolygon: FC<InteractivePolygonProps> = ({
  points,
  fill,
  stroke,
  strokeWidth,
  circleRadius,
  onDrag,
}) => {
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <g>
      <polygon points={polygonPoints} fill={fill} stroke="none" />
      {points
        .map((pt, i) => ({
          pt,
          next: points[(i + 1) % points.length],
          edgeId: i,
        }))
        .map(({ pt, next, edgeId }) => (
          <line
            key={edgeId}
            x1={pt.x}
            y1={pt.y}
            x2={next.x}
            y2={next.y}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        ))}
      {points
        .map((pt, i) => ({ pt, vertexId: i }))
        .map(({ pt, vertexId }) => (
          <DraggableCircle
            key={vertexId}
            id={vertexId}
            cx={pt.x}
            cy={pt.y}
            r={circleRadius}
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            onDrag={onDrag}
          />
        ))}
    </g>
  );
};

export default InteractivePolygon;
