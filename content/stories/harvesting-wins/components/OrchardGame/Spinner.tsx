"use client";

import { FC, useRef, useState, useCallback } from "react";
import { animate } from "framer-motion";
import { pie, arc } from "d3-shape";
import ClippedSVG from "@/components/story/shared/ClippedSVG";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";
import { SPINNER_COLORS } from "./constants";

const WIDTH = 300;
const HEIGHT = 300;
const PADDING = 10;

const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const RADIUS = CX - PADDING;
const NEEDLE_TIP = CY - RADIUS + PADDING;
const ARROW_HALF = HEIGHT * 0.02;

const pieGen = pie<string>().sort(null);
const arcGen = arc<{ startAngle: number; endAngle: number }>()
  .innerRadius(0)
  .outerRadius(RADIUS);
const ARCS = pieGen(SPINNER_COLORS.map(() => "1"));

export interface SpinnerProps {
  /** idx 0–4 → counts[idx]; idx 5 → basket wildcard */
  onSpinEnd: (idx: number) => void;
  /** When non-empty, replaces the Spin button with a message */
  message: string;
}

const Spinner: FC<SpinnerProps> = ({ onSpinEnd, message }) => {
  const [rotation, setRotation] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const rotationRef = useRef(0);

  const spin = useCallback(() => {
    if (disabled) return;
    setDisabled(true);

    const direction = Math.random() < 0.5 ? -1 : 1;
    const delta = direction * (1 + Math.random() * 4) * 360;
    const target = rotationRef.current + delta;
    const duration = 1 + 2 * Math.random();

    animate(rotationRef.current, target, {
      duration,
      ease: [0, 0.55, 0.45, 1],
      onUpdate: (v) => setRotation(v),
      onComplete: () => {
        rotationRef.current = target;
        const trueMod = (((target / 360) % 1) + 1) % 1;
        const idx = Math.floor(trueMod * SPINNER_COLORS.length);
        onSpinEnd(idx);
        setDisabled(false);
      },
    });
  }, [disabled, onSpinEnd]);

  return (
    <div>
      <ClippedSVG id="spinner" width={WIDTH} height={HEIGHT} clipChildren={false}>
        <g transform={`translate(${CX}, ${CY})`}>
          {ARCS.map((d, i) => (
            <path
              key={i}
              d={arcGen(d) ?? ""}
              fill={SPINNER_COLORS[i]}
              stroke={COLORS.BLACK}
              strokeWidth={1}
            />
          ))}
        </g>
        <g
          stroke={COLORS.DARK_GRAY}
          strokeWidth="6"
          fill={COLORS.DARK_GRAY}
          transform={`rotate(${rotation} ${CX} ${CY})`}
        >
          <circle cx={CX} cy={CY} r={5} />
          <line x1={CX} x2={CX} y1={CY} y2={NEEDLE_TIP} />
          <polygon
            points={`${CX},${NEEDLE_TIP - 15} ${CX + ARROW_HALF},${NEEDLE_TIP} ${CX - ARROW_HALF},${NEEDLE_TIP}`}
          />
        </g>
      </ClippedSVG>
      {message ? (
        <p className="text-center italic my-4">{message}</p>
      ) : (
        <div className="flex justify-center mt-2">
          <Button onClick={spin} disabled={disabled}>
            Spin!
          </Button>
        </div>
      )}
    </div>
  );
};

export default Spinner;
