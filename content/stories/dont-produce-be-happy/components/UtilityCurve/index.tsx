"use client";

import { scaleLinear } from "d3-scale";
import { motion } from "framer-motion";
import DraggableCircle from "@/components/story/shared/DraggableCircle";
import Latex from "@/components/story/shared/Latex";
import LinePlot from "@/components/story/shared/LinePlot";
import { Button } from "@/components/ui/Button";
import { darkenHex } from "@/utils/colorHelpers";
import { formatCurrency } from "@/utils/formatHelpers";
import COLORS from "@/utils/styles";
import {
  CHART_CONTAINER_WIDTH,
  CHART_HEIGHT,
  CHART_PADDING,
  CHART_WIDTH,
  GDP_PER_CAPITA_DOMAIN,
  LIFE_LADDER_DOMAIN,
  LIFE_LADDER_LABEL,
} from "../../constants";
import type { WithGdpHappinessByCountryYear } from "../../data/csvData";
import ChartFrame from "../ChartFrame";
import useUtilityCurve from "./useUtilityCurve";
import { regressionEquationLatex } from "./utils";

const MARKER_RADIUS = 5;
const SCRUBBER_RADIUS = 8;
const SCATTER_RADIUS = 8;
const SCATTER_STROKE_DARKEN_AMOUNT = 0.3;
const SCATTER_STROKE = darkenHex(COLORS.GRAY, SCATTER_STROKE_DARKEN_AMOUNT);
const SCATTER_OPACITY = 0.4;
const TRANSITION_DURATION = 0.4;
const X_MIN = CHART_PADDING.left;
const X_MAX = CHART_WIDTH - CHART_PADDING.right;

const xScale = scaleLinear()
  .domain(GDP_PER_CAPITA_DOMAIN)
  .range([X_MIN, X_MAX]);
const yScale = scaleLinear()
  .domain(LIFE_LADDER_DOMAIN)
  .range([CHART_HEIGHT - CHART_PADDING.bottom, CHART_PADDING.top]);

export default function UtilityCurve({
  gdpHappinessByCountryYear,
}: WithGdpHappinessByCountryYear) {
  const {
    income,
    handleDrag,
    curveData,
    scatterPoints,
    currentWellbeing,
    showTangent,
    setShowTangent,
    showEquation,
    setShowEquation,
    tangentLine,
    sliderData,
    slope,
    intercept,
    rSquared,
  } = useUtilityCurve(gdpHappinessByCountryYear, xScale, X_MIN, X_MAX);

  const markerX = xScale(income);
  const markerY = yScale(currentWellbeing);

  return (
    <ChartFrame
      containerWidth={CHART_CONTAINER_WIDTH}
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      graphPadding={CHART_PADDING}
      xScale={xScale}
      yScale={yScale}
      xTickFormat="$,"
      yTickFormat=".1f"
      xAxisLabel="GDP per capita"
      yAxisLabel={LIFE_LADDER_LABEL}
      sliderData={sliderData}
      toolbar={
        <>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTangent((prev) => !prev)}
            >
              {showTangent ? "Hide Tangent" : "Show Tangent"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEquation((prev) => !prev)}
            >
              {showEquation ? "Hide Equation" : "Show Equation"}
            </Button>
          </div>
          <div className="flex h-10 w-full items-center justify-center text-gray-600">
            {showEquation && (
              <Latex
                str={regressionEquationLatex(intercept, slope, rSquared)}
                displayMode
              />
            )}
          </div>
        </>
      }
    >
      {({ showTooltip, showTooltipAt, hideTooltip }) => (
        <>
          {scatterPoints.map((point) => (
            <motion.circle
              key={point.key}
              initial={false}
              animate={{
                cx: xScale(point.x),
                cy: yScale(point.y),
              }}
              transition={{ duration: TRANSITION_DURATION }}
              r={SCATTER_RADIUS}
              fill={COLORS.GRAY}
              stroke={SCATTER_STROKE}
              strokeWidth={1}
              opacity={SCATTER_OPACITY}
            />
          ))}
          <LinePlot graphData={curveData} stroke={COLORS.BLUE} />
          {showTangent && (
            <line
              x1={xScale(tangentLine.x1)}
              y1={yScale(tangentLine.y1)}
              x2={xScale(tangentLine.x2)}
              y2={yScale(tangentLine.y2)}
              stroke={COLORS.RED}
              strokeWidth={3}
            />
          )}
          {/* biome-ignore lint/a11y/useSemanticElements: SVG circle cannot be replaced with <button> */}
          <circle
            cx={markerX}
            cy={markerY}
            r={MARKER_RADIUS}
            fill={COLORS.ORANGE}
            className="cursor-default"
            role="button"
            tabIndex={0}
            aria-label={`Income ${formatCurrency(income)}, Life Ladder ${currentWellbeing.toFixed(2)}`}
            onMouseEnter={showTooltip(
              formatCurrency(income),
              `${LIFE_LADDER_LABEL}: ${currentWellbeing.toFixed(2)}`,
            )}
            onMouseLeave={hideTooltip}
            onFocus={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              showTooltipAt(
                formatCurrency(income),
                `${LIFE_LADDER_LABEL}: ${currentWellbeing.toFixed(2)}`,
                rect.left + rect.width / 2,
                rect.top,
              );
            }}
            onBlur={hideTooltip}
          />
          <DraggableCircle
            id={0}
            cx={markerX}
            cy={CHART_HEIGHT - CHART_PADDING.bottom}
            r={SCRUBBER_RADIUS}
            fill={COLORS.DARK_GRAY}
            stroke="white"
            strokeWidth={2}
            onDrag={(id, coords) => {
              hideTooltip();
              handleDrag(id, coords);
            }}
          />
        </>
      )}
    </ChartFrame>
  );
}
