"use client";

import { scaleLinear } from "d3-scale";
import Axis from "@/components/story/shared/Axis";
import AxisLabel from "@/components/story/shared/AxisLabel";
import Caption from "@/components/story/shared/Caption";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import Graph from "@/components/story/shared/Graph";
import LinePlot from "@/components/story/shared/LinePlot";
import Tooltip, { useTooltip } from "@/components/story/shared/Tooltip";
import COLORS from "@/utils/styles";
import VerticalMarker from "../VerticalMarker";
import { formatDate, parsed, useMarketScrubber } from "./useMarketScrubber";

const WIDTH = 700;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 32, bottom: 50, left: 70, right: 95 };
const AXIS_FONT = "11px";
const DOT_RADIUS = 5;
const SCRUBBER_RADIUS = 8;

const xScale = scaleLinear()
  .domain([2001, 2026.25])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const sp500Scale = scaleLinear()
  .domain([300, 7500])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const jobScale = scaleLinear()
  .domain([2000, 16000])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const sp500Data = parsed.map((d) => ({ x: d.x, y: d.sp500 }));
const jobData = parsed.map((d) => ({ x: d.x, y: d.jobOpenings }));

const EVENTS: { x: number; label: string; labelYOffset?: number }[] = [
  { x: 2001 + 8 / 12, label: "9/11" },
  { x: 2008 + 8 / 12, label: "2008 crisis" },
  { x: 2020 + 2 / 12, label: "COVID-19" },
  { x: 2022 + 10 / 12, label: "ChatGPT", labelYOffset: 14 },
];

const JOB_TICK_VALUES = [2000, 4000, 6000, 8000, 10000, 12000];

const X_MIN = GRAPH_PADDING.left;
const X_MAX = WIDTH - GRAPH_PADDING.right;

const MarketDataExplorer = () => {
  const { current, handleDrag } = useMarketScrubber(xScale, X_MIN, X_MAX);
  const { tooltip, showTooltip, showTooltipAt, hideTooltip } = useTooltip();

  const scrubberX = xScale(current.x);
  const sp500Y = sp500Scale(current.sp500);
  const jobY = jobScale(current.jobOpenings);
  const dateLabel = formatDate(current);

  return (
    <>
      <Caption
        caption={
          "Figure 1: S&P 500 and US job openings per month over time. Note the divergence around the time when ChatGPT launched."
        }
      >
        <Graph
          axes={false}
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          width={WIDTH}
          svgId="market-data-explorer"
          xScale={xScale}
          yScale={sp500Scale}
          gridlinesHorizontal
          gridlinesVertical={false}
        >
          <Axis
            key="y-axis"
            direction="y"
            scale={sp500Scale}
            tickFormat=","
            tickColor={COLORS.GRAY}
            color={COLORS.BLUE}
            fontSize={AXIS_FONT}
          />
          <Axis
            key="x-axis"
            direction="x"
            scale={xScale}
            tickFormat=".0f"
            rotateLabels={false}
            textAnchor="middle"
            labelPosition={{ dy: "0.71em" }}
            tickColor={COLORS.GRAY}
            fontSize={AXIS_FONT}
          />
          <Axis
            key="y-right-axis"
            direction="y"
            xShift={WIDTH - GRAPH_PADDING.right}
            scale={jobScale}
            tickFormat=","
            tickValues={JOB_TICK_VALUES}
            tickSize={5}
            textAnchor="start"
            labelPosition={{ x: "8" }}
            tickColor={COLORS.RED}
            color={COLORS.RED}
            fontSize={AXIS_FONT}
          />
          <AxisLabel
            x={10}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(-90 10,${HEIGHT / 2})`}
            style={{ color: COLORS.BLUE }}
          >
            S&amp;P 500
          </AxisLabel>
          <AxisLabel
            x={WIDTH - 22}
            y={HEIGHT / 2}
            dy={10}
            transform={`rotate(90 ${WIDTH - 22},${HEIGHT / 2})`}
            style={{ color: COLORS.RED }}
          >
            Job Openings (thousands)
          </AxisLabel>
          <LinePlot
            graphData={jobData}
            stroke={COLORS.RED}
            strokeWidth={2}
            yScale={jobScale}
            curve="curveLinear"
          />
          <LinePlot
            graphData={sp500Data}
            stroke={COLORS.BLUE}
            strokeWidth={2}
            curve="curveLinear"
          />
          {EVENTS.map((e) => (
            <VerticalMarker
              key={e.label}
              x={e.x}
              color={COLORS.DARK_GRAY}
              label={e.label}
              labelYOffset={e.labelYOffset}
            />
          ))}
          <VerticalMarker x={current.x} color={COLORS.DARK_GRAY} />
          {/* biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button> */}
          <circle
            cx={scrubberX}
            cy={sp500Y}
            r={DOT_RADIUS}
            fill={COLORS.BLUE}
            className="cursor-default"
            role="button"
            tabIndex={0}
            aria-label={`S&P 500 at ${dateLabel}: ${Math.round(current.sp500).toLocaleString()}`}
            onMouseEnter={showTooltip(
              dateLabel,
              `S&P 500: ${Math.round(current.sp500).toLocaleString()}`,
            )}
            onMouseLeave={hideTooltip}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltipAt(
                dateLabel,
                `S&P 500: ${Math.round(current.sp500).toLocaleString()}`,
                rect.left + rect.width / 2,
                rect.top,
              );
            }}
            onBlur={hideTooltip}
          />
          {/* biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button> */}
          <circle
            cx={scrubberX}
            cy={jobY}
            r={DOT_RADIUS}
            fill={COLORS.RED}
            className="cursor-default"
            role="button"
            tabIndex={0}
            aria-label={`Job openings at ${dateLabel}: ${current.jobOpenings.toLocaleString()}k`}
            onMouseEnter={showTooltip(
              dateLabel,
              `Job openings: ${current.jobOpenings.toLocaleString()}k`,
            )}
            onMouseLeave={hideTooltip}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltipAt(
                dateLabel,
                `Job openings: ${current.jobOpenings.toLocaleString()}k`,
                rect.left + rect.width / 2,
                rect.top,
              );
            }}
            onBlur={hideTooltip}
          />
          <DraggableCircle
            id={0}
            cx={scrubberX}
            cy={HEIGHT - GRAPH_PADDING.bottom}
            r={SCRUBBER_RADIUS}
            fill={COLORS.DARK_GRAY}
            stroke="white"
            strokeWidth={2}
            onDrag={(id, coords) => {
              hideTooltip();
              handleDrag(id, coords);
            }}
          />
        </Graph>
      </Caption>
      <Tooltip info={tooltip} />
    </>
  );
};

export default MarketDataExplorer;
