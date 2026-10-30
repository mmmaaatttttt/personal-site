"use client";

import { type FC, type PointerEvent, useEffect, useRef, useState } from "react";
import COLORS from "@/utils/styles";
import { clientToSvgPoint } from "@/utils/svgHelpers";

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
  const currentR = hovered || dragging ? r * 1.5 : r;
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const svg = circleRef.current?.ownerSVGElement;
    if (!svg) return;
    const prev = svg.style.touchAction;
    svg.style.touchAction = "none";
    return () => {
      svg.style.touchAction = prev;
    };
  }, []);

  const toSVGCoords = (e: PointerEvent<SVGCircleElement>) =>
    clientToSvgPoint(e.currentTarget.ownerSVGElement, e.clientX, e.clientY);

  return (
    <circle
      ref={circleRef}
      cx={cx}
      cy={cy}
      r={currentR}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      style={{
        cursor: dragging ? "grabbing" : "grab",
        transition: "r 0.15s ease",
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onPointerDown={(e) => {
        e.preventDefault();
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
      onPointerCancel={() => {
        setDragging(false);
        setHovered(false);
      }}
    />
  );
};

export default DraggableCircle;
