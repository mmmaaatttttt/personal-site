"use client";

import { FC, useState } from "react";
import COLORS from "@/utils/styles";

interface DraggableCircleProps {
  id: number;
  cx: number;
  cy: number;
  r?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onDrag: (id: number, coords: { x: number; y: number }) => void;
}

const DraggableCircle: FC<DraggableCircleProps> = ({
  id,
  cx,
  cy,
  r = 8,
  fill = COLORS.BLACK,
  stroke,
  strokeWidth,
  onDrag,
}) => {
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const currentR = hovered || dragging ? r + 4 : r;

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
      r={currentR}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none", transition: "r 0.15s ease" }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
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
      onPointerCancel={() => { setDragging(false); setHovered(false); }}
    />
  );
};

export default DraggableCircle;
