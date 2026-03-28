"use client";

import React from "react";
import { fourWeddingsData } from "../data/four-weddings-data";
import { selectOptions, tooltipHelpers, graphOptions } from "../data/four-weddings-config";
import SelectableUSMap from "./SelectableUSMap";
import SelectableHistogram from "./SelectableHistogram";
import SelectablePieChart from "./SelectablePieChart";
import SelectableScatterplot from "./SelectableScatterplot";
import Caption from "@/components/story/shared/Caption";

interface FourWeddingsVisualizationProps {
  vizIndex: string | number; // Consistent with the new prop naming convention
  vizType: "map" | "histogram" | "pie" | "scatter";
  caption?: string;
}

const FourWeddingsVisualization: React.FC<FourWeddingsVisualizationProps> = ({
  vizIndex,
  vizType,
  caption,
}) => {
  const components: any = {
    map: SelectableUSMap,
    histogram: SelectableHistogram,
    pie: SelectablePieChart,
    scatter: SelectableScatterplot,
  };

  const Component = components[vizType];
  if (!Component) return null;

  const props: any = {
    data: fourWeddingsData,
    selectOptions: selectOptions[vizType],
    graphOptions: graphOptions[vizType],
  };

  const tooltip = tooltipHelpers[vizType];
  if (tooltip) {
    props.getTooltipTitle = tooltip.title;
    props.getTooltipBody = tooltip.body;
  }

  return (
    <div className="my-12">
      <Component {...props} />
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
};

export default FourWeddingsVisualization;
