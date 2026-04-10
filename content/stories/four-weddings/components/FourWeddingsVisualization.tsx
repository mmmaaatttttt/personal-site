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
  vizIndex: string | number;
  vizType: "map" | "histogram" | "pie" | "scatter";
  caption?: string;
}

const FourWeddingsVisualization: React.FC<FourWeddingsVisualizationProps> = ({
  vizType,
  caption,
}) => {
  const renderVisualization = () => {
    switch (vizType) {
      case "map":
        return (
          <SelectableUSMap 
            data={fourWeddingsData} 
            selectOptions={selectOptions.map} 
            getTooltipTitle={tooltipHelpers.map.title}
            getTooltipBody={tooltipHelpers.map.body}
          />
        );
      case "histogram":
        return (
          <SelectableHistogram 
            data={fourWeddingsData} 
            selectOptions={selectOptions.histogram} 
          />
        );
      case "pie":
        return (
          <SelectablePieChart 
            data={fourWeddingsData} 
            selectOptions={selectOptions.pie} 
            graphOptions={graphOptions.pie} 
          />
        );
      case "scatter":
        return (
          <SelectableScatterplot 
            data={fourWeddingsData} 
            selectOptions={selectOptions.scatter} 
            graphOptions={graphOptions.scatter} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="my-12">
      {renderVisualization()}
      {caption && <Caption>{caption}</Caption>}
    </div>
  );
};

export default FourWeddingsVisualization;
