"use client";

import { scaleLinear } from "d3-scale";
import Caption from "@/components/story/shared/Caption";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import {
  DEFAULT_DEMAND_LOSS,
  DEFAULT_DIFFICULTY,
  DEFAULT_SAVINGS,
  DEMAND_LOSS_KEY,
  DIFFICULTY_KEY,
  SAVINGS_KEY,
} from "../../sliderStore";
import VerticalMarker from "../VerticalMarker";
import {
  DELTA_MAX,
  DELTA_MIN,
  useSavingsWedgeData,
} from "./useSavingsWedgeData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 50, left: 60, right: 20 };

const xScale = scaleLinear()
  .domain([DELTA_MIN, DELTA_MAX])
  .range([GRAPH_PADDING.left, WIDTH - GRAPH_PADDING.right]);

const yScale = scaleLinear()
  .domain([0, 1])
  .range([HEIGHT - GRAPH_PADDING.bottom, GRAPH_PADDING.top]);

const SAVINGS_SLIDER = {
  min: 0.05,
  max: 0.95,
  initialValue: DEFAULT_SAVINGS,
  storageKey: SAVINGS_KEY,
  title: (val: number) =>
    `How much automation saves per task: ${Math.round(val * 100)}%`,
  color: COLORS.ORANGE,
};

const DEMAND_LOSS_SLIDER = {
  min: 0.05,
  max: 0.9,
  initialValue: DEFAULT_DEMAND_LOSS,
  storageKey: DEMAND_LOSS_KEY,
  title: (val: number) =>
    `Consumer spending lost per job cut: ${Math.round(val * 100)}%`,
  color: COLORS.BLUE,
};

const DIFFICULTY_SLIDER = {
  min: 0.2,
  max: 3,
  initialValue: DEFAULT_DIFFICULTY,
  storageKey: DIFFICULTY_KEY,
  title: (val: number) => `How hard it is to automate: ${val.toFixed(1)}`,
  color: COLORS.PURPLE,
};

interface SavingsWedgeProps {
  caption?: string;
  showDifficulty?: boolean;
}

const SavingsWedge = ({
  caption,
  showDifficulty = true,
}: SavingsWedgeProps) => {
  const sliderConfig = showDifficulty
    ? [SAVINGS_SLIDER, DEMAND_LOSS_SLIDER, DIFFICULTY_SLIDER]
    : [SAVINGS_SLIDER, DEMAND_LOSS_SLIDER];
  const { values, sliderData } = useSliders(sliderConfig);
  const savings = values[0];
  const demandLoss = values[1];
  const difficulty = showDifficulty ? values[2] : DEFAULT_DIFFICULTY;

  const { neData, coData, currentNE, overPct, clampedDelta } =
    useSavingsWedgeData(savings, demandLoss, difficulty);

  const delta = savings - demandLoss;
  const markerLabel = delta >= 0 ? `+${delta.toFixed(2)}` : delta.toFixed(2);

  const polygonPoints = [
    ...neData.map((p) => `${xScale(p.x)},${yScale(p.y)}`),
    ...[...coData].reverse().map((p) => `${xScale(p.x)},${yScale(p.y)}`),
  ].join(" ");

  const zeroX = xScale(0);

  return (
    <Caption caption={caption}>
      <ColumnLayout break="sm">
        <div className="flex flex-col justify-center gap-4 py-4">
          <SliderGroup data={sliderData} />
          <div
            className="rounded-lg p-4 text-center"
            style={{
              backgroundColor: hexToRgba(COLORS.ORANGE, 0.08),
              border: `1px solid ${hexToRgba(COLORS.ORANGE, 0.4)}`,
            }}
          >
            {overPct === null && currentNE < 0.01 && (
              <p className="text-sm text-gray-600">
                At these settings, neither the market nor the social optimum
                calls for any automation.
              </p>
            )}
            {overPct === null && currentNE >= 0.01 && (
              <p className="text-sm text-gray-600">
                No collective gain from automation here — but 2 competing firms
                drive {Math.round(currentNE * 100)}% automation anyway.
              </p>
            )}
            {overPct === 0 && (
              <p className="text-sm text-gray-600">
                With 2 firms, the market delivers exactly the socially optimal
                level of automation.
              </p>
            )}
            {overPct !== null && overPct > 0 && (
              <>
                <div
                  className="text-4xl font-bold"
                  style={{ color: COLORS.ORANGE }}
                >
                  +{overPct}%
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  With 2 competing firms, the industry automates {overPct}% more
                  jobs than is collectively beneficial.
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <Legend
            labels={[
              { text: "Market outcome (2 firms)", color: COLORS.ORANGE },
              { text: "Socially optimal", color: COLORS.GREEN },
            ]}
          />
          <Graph
            graphPadding={GRAPH_PADDING}
            height={HEIGHT}
            width={WIDTH}
            svgId="savings-wedge"
            xScale={xScale}
            yScale={yScale}
            tickFormatX=".1f"
            tickFormatY=".1f"
            xLabel="Collective gain from automation"
            yLabel="Share of jobs automated"
          >
            <line
              x1={zeroX}
              x2={zeroX}
              y1={GRAPH_PADDING.top}
              y2={HEIGHT - GRAPH_PADDING.bottom}
              stroke={COLORS.GRAY}
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <polygon
              points={polygonPoints}
              fill={hexToRgba(COLORS.ORANGE, 0.15)}
              stroke="none"
            />
            <LinePlot
              graphData={neData}
              stroke={COLORS.ORANGE}
              strokeWidth={3}
              curve="curveLinear"
            />
            <LinePlot
              graphData={coData}
              stroke={COLORS.GREEN}
              strokeWidth={3}
              curve="curveLinear"
            />
            <VerticalMarker
              x={clampedDelta}
              color={COLORS.DARK_GRAY}
              label={markerLabel}
            />
          </Graph>
        </div>
      </ColumnLayout>
    </Caption>
  );
};

export default SavingsWedge;
