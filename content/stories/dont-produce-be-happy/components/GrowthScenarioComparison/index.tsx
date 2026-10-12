"use client";

import { useState } from "react";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import Select from "@/components/story/shared/Select";
import type { EurogreenScenarioRow } from "../../data/csvData";
import ScenarioLineChart from "./ScenarioLineChart";
import {
  deriveScenarioSeries,
  SCENARIO_LEGEND,
  type ScenarioVariableOption,
  VARIABLE_OPTIONS,
} from "./utils";

interface GrowthScenarioComparisonProps {
  rows: EurogreenScenarioRow[];
}

export default function GrowthScenarioComparison({
  rows,
}: GrowthScenarioComparisonProps) {
  const [selectedOption, setSelectedOption] = useState<ScenarioVariableOption>(
    VARIABLE_OPTIONS[0],
  );

  const series = deriveScenarioSeries(rows, selectedOption.accessor);

  return (
    <NarrowContainer width="80%" fullWidthAt="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-4">
          <Select
            name="eurogreen-variable"
            value={selectedOption.value}
            onChange={setSelectedOption}
            options={VARIABLE_OPTIONS}
            className="flex-1 max-w-sm"
          />
        </div>
        <Legend labels={SCENARIO_LEGEND} />
        <ScenarioLineChart
          svgId="eurogreen-scenario-chart"
          series={series}
          yDomain={selectedOption.yDomain}
          yAxisLabel={selectedOption.label}
          yTickFormat={selectedOption.yTickFormat}
        />
      </div>
    </NarrowContainer>
  );
}
