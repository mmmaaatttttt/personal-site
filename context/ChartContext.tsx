import type { AxisScale } from "d3-axis";
import { createContext, useContext } from "react";

interface Padding {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface ChartContextValue {
  xScale: AxisScale<number>;
  yScale: AxisScale<number>;
  width: number;
  height: number;
  padding: Padding;
  gridlinesHorizontal: boolean;
  gridlinesVertical: boolean;
}

export const ChartContext = createContext<ChartContextValue | null>(null);

export const useChart = () => useContext(ChartContext);
