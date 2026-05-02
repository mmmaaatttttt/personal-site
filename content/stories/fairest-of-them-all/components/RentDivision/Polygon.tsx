import type { FC } from "react";

interface Point {
  x: number;
  y: number;
}

interface PolygonProps {
  fill?: string;
  open?: boolean;
  points: Point[];
  stroke?: string;
  strokeWidth?: number;
}

const Polygon: FC<PolygonProps> = ({
  fill = "#000000",
  open = false,
  points,
  stroke = "#000000",
  strokeWidth = 3,
}) => {
  const pointsStr = points.map((p) => `${p.x},${p.y}`).join(" ");
  return open ? (
    <polyline
      points={pointsStr}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  ) : (
    <polygon
      points={pointsStr}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};

export default Polygon;
