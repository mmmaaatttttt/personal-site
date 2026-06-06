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

const SLIDER_CONFIG = [
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_SAVINGS,
    storageKey: SAVINGS_KEY,
    title: (val: number) =>
      `How much automation saves per task: ${Math.round(val * 100)}%`,
    color: COLORS.ORANGE,
  },
  {
    min: 0,
    max: 1,
    initialValue: DEFAULT_DEMAND_LOSS,
    storageKey: DEMAND_LOSS_KEY,
    title: (val: number) =>
      `Consumer spending lost per job cut: ${Math.round(val * 100)}%`,
    color: COLORS.BLUE,
  },
  {
    min: 0,
    max: 3,
    initialValue: DEFAULT_DIFFICULTY,
    storageKey: DIFFICULTY_KEY,
    title: (val: number) => `How hard it is to automate: ${val.toFixed(1)}`,
    color: COLORS.PURPLE,
  },
];

interface SavingsWedgeProps {
  caption?: string;
}

const SavingsWedge = ({ caption }: SavingsWedgeProps) => {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;

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
                At these settings, neither competing firms nor coordinating
                firms would automate.
              </p>
            )}
            {overPct === null && currentNE >= 0.01 && (
              <p className="text-sm text-gray-600">
                Coordinating firms wouldn't automate here — but 2 competing
                firms drive {Math.round(currentNE * 100)}% automation anyway.
              </p>
            )}
            {overPct === 0 && (
              <p className="text-sm text-gray-600">
                With 2 firms, competition delivers the same outcome as full
                coordination.
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
                  jobs than if firms had coordinated.
                </p>
              </>
            )}
          </div>
        </div>
        <div>
          <Legend
            labels={[
              { text: "Market outcome (2 firms)", color: COLORS.ORANGE },
              { text: "Coordinated outcome", color: COLORS.GREEN },
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
