import type { AxisScale } from "d3-axis";
import { createContext, useContext } from "react";

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface AxisStyle {
  rotateLabels: boolean;
  textAnchor: "start" | "middle" | "end";
  labelPosition: { x?: string; y?: string; dx?: string; dy?: string };
}

export interface ChartContextValue {
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  height: number;
  padding: Padding;
  gridlinesHorizontal: boolean;
  gridlinesVertical: boolean;
  /** Default styling for a composed x-axis <Axis direction="x"> inside this chart. */
  xAxisStyle?: AxisStyle;
  /** Default styling for a composed y-axis <Axis direction="y"> inside this chart. */
  yAxisStyle?: AxisStyle;
}

export const ChartContext = createContext<ChartContextValue | null>(null);

export const useChart = () => useContext(ChartContext);
