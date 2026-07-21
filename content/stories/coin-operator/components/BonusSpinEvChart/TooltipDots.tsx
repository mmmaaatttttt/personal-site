"use client";

import type { ScaleLinear } from "d3-scale";
import type { FC } from "react";
import type { useTooltip } from "@/components/story/shared/Tooltip";

type TooltipHandlers = Pick<
  ReturnType<typeof useTooltip>,
  "showTooltip" | "showTooltipAt" | "hideTooltip"
>;

export interface TooltipEntry {
  title: string;
  body: string[];
}

interface TooltipDotsProps extends TooltipHandlers {
  curve: number[];
  color: string;
  dotRadius: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  /** Precomputed pixel-Y per point, overriding `yScale(value)` — lets dots
   *  track an in-flight framer-motion animation on the paired line instead
   *  of snapping straight to the new value. */
  animatedCy?: number[];
  /** One tooltip entry per spin count, shared by both series so hovering
   *  either curve's dot at a given n shows both curves' values at that n —
   *  at high temperature the two dots can sit close together, so this
   *  removes the need to land on the exact right one. */
  tooltipData: TooltipEntry[];
}

const TooltipDots: FC<TooltipDotsProps> = ({
  curve,
  color,
  dotRadius,
  xScale,
  yScale,
  animatedCy,
  tooltipData,
  showTooltip,
  showTooltipAt,
  hideTooltip,
}) => (
  <>
    {curve.map((value, n) => {
      const { title, body } = tooltipData[n];
      const cy = animatedCy ? animatedCy[n] : yScale(value);
      return (
        // biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button>
        <circle
          // biome-ignore lint/suspicious/noArrayIndexKey: curve is a fixed-length array indexed by spin count
          key={n}
          cx={xScale(n)}
          cy={cy}
          r={dotRadius}
          fill={color}
          role="button"
          tabIndex={0}
          aria-label={`${title}: ${body.join("; ")}`}
          onMouseEnter={showTooltip(title, body)}
          onMouseLeave={hideTooltip}
          onFocus={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            showTooltipAt(title, body, rect.left + rect.width / 2, rect.top);
          }}
          onBlur={hideTooltip}
        />
      );
    })}
  </>
);

export default TooltipDots;
