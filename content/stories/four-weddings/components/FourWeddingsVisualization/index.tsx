"use client";

import type { FC } from "react";
import Figure from "@/components/story/shared/Figure";
import {
  graphOptions,
  selectOptions,
  tooltipHelpers,
} from "../../data/four-weddings-config";
import { fourWeddingsData } from "../../data/four-weddings-data";
import SelectableHistogram from "../SelectableHistogram";
import SelectablePieChart from "../SelectablePieChart";
import SelectableScatterplot from "../SelectableScatterplot";
import SelectableUSMap from "../SelectableUSMap";

interface FourWeddingsVisualizationProps {
  vizIndex: string | number;
  vizType: "map" | "histogram" | "pie" | "scatter";
  caption?: string;
}

const FourWeddingsVisualization: FC<FourWeddingsVisualizationProps> = ({
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

  return <Figure caption={caption}>{renderVisualization()}</Figure>;
};

export default FourWeddingsVisualization;
