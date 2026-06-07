"use client";

import { scaleLinear } from "d3-scale";
import ColumnLayout from "@/components/story/shared/ColumnLayout";
import Graph from "@/components/story/shared/Graph";
import Legend from "@/components/story/shared/Legend";
import LinePlot from "@/components/story/shared/LinePlot";
import { SliderGroup } from "@/components/story/shared/Slider";
import VerticalMarker from "@/components/story/shared/VerticalMarker";
import useSliders from "@/hooks/useSliders";
import COLORS, { hexToRgba } from "@/utils/styles";
import {
  DEFAULT_DEMAND_LOSS,
  DEFAULT_DIFFICULTY,
  DEFAULT_NUM_FIRMS,
  DEFAULT_SAVINGS,
  DEMAND_LOSS_KEY,
  DIFFICULTY_KEY,
  NUM_FIRMS_KEY,
  SAVINGS_KEY,
} from "../../sliderStore";
import { useWedgeData } from "./useWedgeData";

const WIDTH = 600;
const HEIGHT = 400;
const GRAPH_PADDING = { top: 24, bottom: 75, left: 60, right: 20 };
const N_MAX = 20;
const NS = Array.from({ length: N_MAX }, (_, i) => i + 1);

const xScale = scaleLinear()
  .domain([1, N_MAX])
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
    min: 0.2,
    max: 3,
    initialValue: DEFAULT_DIFFICULTY,
    storageKey: DIFFICULTY_KEY,
    title: (val: number) => `How hard it is to automate: ${val.toFixed(1)}`,
    color: COLORS.PURPLE,
  },
  {
    min: 1,
    max: N_MAX,
    step: 1,
    initialValue: DEFAULT_NUM_FIRMS,
    storageKey: NUM_FIRMS_KEY,
    title: (val: number) => `Number of competing firms: ${Math.round(val)}`,
    color: COLORS.DARK_GRAY,
  },
];

interface WedgeExplorerProps {
  caption?: string;
}

const WedgeExplorer = ({ caption }: WedgeExplorerProps) => {
  const { values, sliderData } = useSliders(SLIDER_CONFIG);
  const [savings, demandLoss, difficulty] = values;
  const numFirms = Math.round(values[3]);

  const { neData, coData, currentNE, overPct } = useWedgeData(
    savings,
    demandLoss,
    difficulty,
    numFirms,
    NS,
  );

  const polygonPoints = [
    ...neData.map((p) => `${xScale(p.x)},${yScale(p.y)}`),
    ...[...coData].reverse().map((p) => `${xScale(p.x)},${yScale(p.y)}`),
  ].join(" ");

  return (
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
          {overPct === null && (
            <p className="text-sm text-gray-600">
              Coordinating firms wouldn't automate here — but competition drives{" "}
              {Math.round(currentNE * 100)}% automation anyway.
            </p>
          )}
          {overPct === 0 && (
            <p className="text-sm text-gray-600">
              With {numFirms} firm{numFirms === 1 ? "" : "s"}, competition
              delivers the same outcome as full coordination.
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
                With {numFirms} competing firms, the industry automates{" "}
                {overPct}% more jobs than if firms had coordinated.
              </p>
            </>
          )}
        </div>
      </div>
      <div>
        <Legend
          labels={[
            { text: "Market outcome (uncoordinated)", color: COLORS.ORANGE },
            { text: "Coordinated outcome", color: COLORS.GREEN },
          ]}
        />
        <Graph
          graphPadding={GRAPH_PADDING}
          height={HEIGHT}
          width={WIDTH}
          svgId="wedge-explorer"
          xScale={xScale}
          yScale={yScale}
          tickFormatX=","
          tickFormatY=".1f"
          xLabel="Number of competing firms"
          yLabel="Share of jobs automated"
        >
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
            x={numFirms}
            color={COLORS.DARK_GRAY}
            label={`${numFirms}`}
          />
        </Graph>
      </div>
    </ColumnLayout>
  );
};

export default WedgeExplorer;
