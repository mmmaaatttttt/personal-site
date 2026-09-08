"use client";

import type { FC } from "react";
import type { useTooltip } from "@/components/story/shared/Tooltip";
import { formatAriaLabel } from "./utils";

type TooltipHandlers = Pick<
  ReturnType<typeof useTooltip>,
  "showTooltip" | "showTooltipAt" | "hideTooltip"
>;

interface TooltipMarkerProps extends TooltipHandlers {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  title?: string;
  body: string | string[];
}

const TooltipMarker: FC<TooltipMarkerProps> = ({
  cx,
  cy,
  r,
  fill,
  title = "",
  body,
  showTooltip,
  showTooltipAt,
  hideTooltip,
}) => (
  // biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button>
  <circle
    cx={cx}
    cy={cy}
    r={r}
    fill={fill}
    role="button"
    tabIndex={0}
    aria-label={formatAriaLabel(title, body)}
    onMouseEnter={showTooltip(title, body)}
    onMouseLeave={hideTooltip}
    onFocus={(e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      showTooltipAt(title, body, rect.left + rect.width / 2, rect.top);
    }}
    onBlur={hideTooltip}
  />
);

export default TooltipMarker;
