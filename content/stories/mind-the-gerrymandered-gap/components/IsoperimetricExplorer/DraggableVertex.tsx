"use client";

import { FC, useState } from "react";

interface DraggableVertexProps {
  id: number;
  cx: number;
  cy: number;
  r: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  onDrag: (id: number, coords: { x: number; y: number }) => void;
}

const DraggableVertex: FC<DraggableVertexProps> = ({
  id,
  cx,
  cy,
  r,
  fill,
  stroke,
  strokeWidth,
  onDrag,
}) => {
  const [dragging, setDragging] = useState(false);

  const toSVGCoords = (e: React.PointerEvent<SVGCircleElement>) => {
    const svg = e.currentTarget.ownerSVGElement;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return {
      x: (e.clientX - ctm.e) / ctm.a,
      y: (e.clientY - ctm.f) / ctm.d,
    };
  };

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        const coords = toSVGCoords(e);
        if (!coords) return;
        onDrag(id, coords);
      }}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    />
  );
};

export default DraggableVertex;
