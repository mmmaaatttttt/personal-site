"use client";

import { scaleLinear } from "d3-scale";
import { useMemo } from "react";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import type { WithSocialShortfallByCountry } from "../../data/csvData";
import { REGION_LEGEND } from "../../data/data";
import { deriveScatterData } from "./utils";

const WIDTH = 700;
const HEIGHT = 600;
const GRAPH_PADDING = { top: 35, bottom: 60, left: 70, right: 70 };
const AXIS_FONT = "11px";
const X_DOMAIN: [number, number] = [0, 6];
const Y_DOMAIN: [number, number] = [0, 11];

export default function SocialEcologicalScatter({
  socialShortfallByCountry,
}: WithSocialShortfallByCountry) {
  const data = deriveScatterData(socialShortfallByCountry);
  const { tooltip, showTooltip, showTooltipAt, hideTooltip } = useTooltip();

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain(X_DOMAIN)
        .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]),
    [],
  );
  const yScale = useMemo(
    () =>
      scaleLinear()
        .domain(Y_DOMAIN)
        .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]),
    [],
  );

  return (
    <NarrowContainer width="75%" fullWidthAt="lg">
      <div className="flex flex-col items-center gap-4">
        <Legend labels={REGION_LEGEND} />
        <Graph
          axes={false}
          graphPadding={GRAPH_PADDING}
          width={WIDTH}
          height={HEIGHT}
          xScale={xScale}
          yScale={yScale}
          gridlinesHorizontal
          gridlinesVertical
        >
          <Axis
            key="y-axis"
            direction="y"
            scale={yScale}
            tickFormat="d"
            fontSize={AXIS_FONT}
          />
          <Axis
            key="x-axis"
            direction="x"
            scale={xScale}
            tickFormat="d"
            rotateLabels={false}
            textAnchor="middle"
            labelPosition={{ dy: "0.71em" }}
            fontSize={AXIS_FONT}
          />
          <AxisLabel
            x={10}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(-90 10,${HEIGHT / 2})`}
          >
            TBD
          </AxisLabel>
          <AxisLabel x={WIDTH / 2} y={HEIGHT - 8} anchor="middle">
            TBD
          </AxisLabel>
          {data.map((point) => (
            // biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button>
            <circle
              key={point.key}
              cx={xScale(point.cx)}
              cy={yScale(point.cy)}
              r={point.radius}
              fill={point.fill}
              stroke={point.stroke}
              fillOpacity={0.75}
              className="cursor-default"
              role="button"
              tabIndex={0}
              aria-label={point.ariaLabel}
              onMouseEnter={showTooltip(point.label, point.tooltipBody)}
              onMouseLeave={hideTooltip}
              onFocus={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                showTooltipAt(
                  point.label,
                  point.tooltipBody,
                  rect.left + rect.width / 2,
                  rect.top,
                );
              }}
              onBlur={hideTooltip}
            />
          ))}
        </Graph>
      </div>
      <Tooltip info={tooltip} />
    </NarrowContainer>
  );
}
