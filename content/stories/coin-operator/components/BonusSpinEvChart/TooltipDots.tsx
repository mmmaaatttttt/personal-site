"use client";

import type { ScaleLinear } from "d3-scale";
import type { FC } from "react";
import type { useTooltip } from "@/components/story/shared/Tooltip";
import TooltipMarker from "@/components/story/shared/TooltipMarker";

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
    {curve.map((value, n) => (
      <TooltipMarker
        // biome-ignore lint/suspicious/noArrayIndexKey: curve is a fixed-length array indexed by spin count
        key={n}
        cx={xScale(n)}
        cy={animatedCy ? animatedCy[n] : yScale(value)}
        r={dotRadius}
        fill={color}
        title={tooltipData[n].title}
        body={tooltipData[n].body}
        showTooltip={showTooltip}
        showTooltipAt={showTooltipAt}
        hideTooltip={hideTooltip}
      />
    ))}
  </>
);

export default TooltipDots;
