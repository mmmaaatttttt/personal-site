"use client";

import { scaleLinear } from "d3-scale";
import { type FC, useCallback, useEffect, useRef, useState } from "react";
import COLORS, { hexToRgba } from "@/utils/styles";

interface SegmentDatum {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  isOn: boolean;
  rowIdx: number;
  colIdx: number;
}

interface InteractiveGridProps {
  width: number;
  height: number;
  paddingX: number;
  paddingY: number;
  strokeWidth: number;
  rowCount: number;
  colCount: number;
  segments: boolean[][];
  onSegmentUpdate: (row: number, col: number, status: boolean | null) => void;
}

const InteractiveGrid: FC<InteractiveGridProps> = ({
  width,
  height,
  paddingX,
  paddingY,
  strokeWidth,
  rowCount,
  colCount,
  segments,
  onSegmentUpdate,
}) => {
  const [activeStatus, setActiveStatus] = useState<boolean | null>(null);
  const [hovered, setHovered] = useState<[number, number] | null>(null);
  const containerRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = containerRef.current?.ownerSVGElement;
    if (!svg) return;
    const prev = svg.style.touchAction;
    svg.style.touchAction = "none";
    return () => {
      svg.style.touchAction = prev;
    };
  }, []);

  const endDrag = useCallback(() => {
    setActiveStatus(null);
    setHovered(null);
  }, []);

  const handleContainerPointerMove = useCallback(
    (e: React.PointerEvent<SVGGElement>) => {
      if (activeStatus === null) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!(el instanceof SVGLineElement)) return;
      const row = el.getAttribute("data-row");
      const col = el.getAttribute("data-col");
      if (row !== null && col !== null) {
        onSegmentUpdate(Number(row), Number(col), activeStatus);
      }
    },
    [activeStatus, onSegmentUpdate],
  );

  const xScale = scaleLinear()
    .domain([0, colCount])
    .range([paddingX, width - paddingX]);
  const yScale = scaleLinear()
    .domain([0, rowCount])
    .range([height - paddingY, paddingY]);

  const segmentData: SegmentDatum[] = segments
    .flatMap((row, rowIdx) =>
      row.map((isOn, colIdx) => {
        const parity = rowIdx % 2;
        const xOffset = (strokeWidth / 2) * parity;
        const yOffset = (strokeWidth / 2) * (1 - parity);
        return {
          x1: xScale(colIdx + 1 - parity) - xOffset,
          x2: xScale(colIdx + 1) + xOffset,
          y1: yScale((rowIdx + parity) / 2) + yOffset,
          y2: yScale((rowIdx + parity) / 2 + (1 - parity)) - yOffset,
          isOn,
          rowIdx,
          colIdx,
        };
      }),
    )
    .sort((a, b) => {
      if (hovered) {
        if (a.rowIdx === hovered[0] && a.colIdx === hovered[1]) return 1;
        if (b.rowIdx === hovered[0] && b.colIdx === hovered[1]) return -1;
      }
      return Number(a.isOn) - Number(b.isOn);
    });

  function getStroke(d: SegmentDatum): string {
    const isThisHovered =
      activeStatus === null &&
      hovered !== null &&
      hovered[0] === d.rowIdx &&
      hovered[1] === d.colIdx;
    if (isThisHovered) {
      return d.isOn
        ? hexToRgba(COLORS.RED, 0.9)
        : hexToRgba(COLORS.DARK_GRAY, 0.6);
    }
    return d.isOn ? COLORS.DARK_GRAY : COLORS.WHITE;
  }

  return (
    <g
      ref={containerRef}
      strokeWidth={strokeWidth}
      onPointerMove={handleContainerPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {segmentData.map((d) => (
        <line
          key={`${d.rowIdx}:${d.colIdx}`}
          data-row={d.rowIdx}
          data-col={d.colIdx}
          role="menuitem"
          tabIndex={0}
          x1={d.x1}
          x2={d.x2}
          y1={d.y1}
          y2={d.y2}
          stroke={getStroke(d)}
          className="cursor-pointer focus:outline-none"
          onPointerDown={(e) => {
            e.preventDefault();
            const next = !d.isOn;
            setActiveStatus(next);
            onSegmentUpdate(d.rowIdx, d.colIdx, next);
            containerRef.current?.setPointerCapture(e.pointerId);
          }}
          onPointerMove={() => {
            if (
              activeStatus === null &&
              (hovered === null ||
                hovered[0] !== d.rowIdx ||
                hovered[1] !== d.colIdx)
            ) {
              setHovered([d.rowIdx, d.colIdx]);
            }
          }}
          onPointerLeave={() => setHovered(null)}
          onFocus={() => setHovered([d.rowIdx, d.colIdx])}
          onBlur={() => setHovered(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              const next = !d.isOn;
              setActiveStatus(next);
              onSegmentUpdate(d.rowIdx, d.colIdx, next);
            }
          }}
        />
      ))}
      <rect
        x={paddingX}
        y={paddingY}
        width={width - 2 * paddingX}
        height={height - 2 * paddingY}
        fill="none"
        stroke={COLORS.DARK_GRAY}
        rx={10}
        ry={10}
      />
    </g>
  );
};

export default InteractiveGrid;
