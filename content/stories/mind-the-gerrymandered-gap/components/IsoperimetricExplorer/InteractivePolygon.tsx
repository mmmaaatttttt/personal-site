import { FC } from "react";
import DraggableCircle from "@/components/story/shared/DraggableCircle";

interface Point {
  x: number;
  y: number;
}

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
      {points.map((pt, i) => {
        const next = points[(i + 1) % points.length];
        return (
          <line
            key={`edge-${i}`}
            x1={pt.x}
            y1={pt.y}
            x2={next.x}
            y2={next.y}
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        );
      })}
      {points.map((pt, i) => (
        <DraggableCircle
          key={`vertex-${i}`}
          id={i}
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
