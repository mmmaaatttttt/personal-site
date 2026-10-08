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
import type { WithGdpHappinessByCountryYear } from "../../csvData";
import ChartFrame from "../ChartFrame";
import useUtilityCurve from "./useUtilityCurve";
import { regressionEquationLatex } from "./utils";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 20, bottom: 50, left: 70, right: 20 };
const MARKER_RADIUS = 5;
const SCRUBBER_RADIUS = 8;
const SCATTER_RADIUS = 8;
const SCATTER_STROKE_DARKEN_AMOUNT = 0.3;
const SCATTER_STROKE = darkenHex(COLORS.GRAY, SCATTER_STROKE_DARKEN_AMOUNT);
const SCATTER_OPACITY = 0.4;
const TRANSITION_DURATION = 0.4;
const X_MIN = GRAPH_PADDING.left;
const X_MAX = WIDTH - GRAPH_PADDING.right;

const xScale = scaleLinear().domain([0, 150000]).range([X_MIN, X_MAX]);
const yScale = scaleLinear()
  .domain([2, 8])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

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
      containerWidth="75%"
      width={WIDTH}
      height={HEIGHT}
      graphPadding={GRAPH_PADDING}
      xScale={xScale}
      yScale={yScale}
      xTickFormat="$,"
      yTickFormat=".1f"
      xAxisLabel="GDP per capita"
      yAxisLabel="Life Ladder Score"
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
              `${currentWellbeing.toFixed(2)}`,
            )}
            onMouseLeave={hideTooltip}
            onFocus={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              showTooltipAt(
                formatCurrency(income),
                `${currentWellbeing.toFixed(2)}`,
                rect.left + rect.width / 2,
                rect.top,
              );
            }}
            onBlur={hideTooltip}
          />
          <DraggableCircle
            id={0}
            cx={markerX}
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
        </>
      )}
    </ChartFrame>
  );
}
