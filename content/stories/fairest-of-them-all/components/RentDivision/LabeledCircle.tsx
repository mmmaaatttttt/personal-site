import type { FC, MouseEvent, TouchEvent } from "react";

interface LabeledCircleProps {
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
  isActive?: boolean;
  handleLeave?: (_e: MouseEvent | TouchEvent) => void;
  handleUpdate?: (_e: MouseEvent | TouchEvent) => void;
}

const LabeledCircle: FC<LabeledCircleProps> = ({
  x,
  y,
  r,
  color,
  label,
  isActive = false,
  handleLeave,
  handleUpdate,
}) => {
  return (
    <>
      {isActive && (
        <style>{`
          @keyframes rent-circle-pulse {
            from { stroke-width: 0; stroke-opacity: 1; }
            to { stroke-width: ${3 * r}px; stroke-opacity: 0; }
          }
          .rent-circle-active {
            animation: rent-circle-pulse 2s infinite;
          }
        `}</style>
      )}
      <g
        role="menuitem"
        tabIndex={0}
        onMouseMove={handleUpdate}
        onTouchMove={handleUpdate}
        onMouseLeave={handleLeave}
        onTouchEnd={handleLeave}
      >
        <circle
          className={isActive ? "rent-circle-active" : undefined}
          cx={x}
          cy={y}
          fill={color}
          r={r}
          stroke={color}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={`${1.5 * r}px`}
          style={{ userSelect: "none" }}
        >
          {label}
        </text>
      </g>
    </>
  );
};

export default LabeledCircle;
