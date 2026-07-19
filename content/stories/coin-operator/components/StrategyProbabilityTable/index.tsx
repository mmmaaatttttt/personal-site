"use client";

import type { FC } from "react";
import { SliderGroup } from "@/components/story/shared/Slider";
import StyledTable from "@/components/story/shared/StyledTable";
import { SYMBOL_EMOJI } from "../../data";
import { COLUMN_HEADERS, EXAMPLE_STATE } from "./constants";
import { useStrategyProbabilityTable } from "./useStrategyProbabilityTable";

function formatProbability(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

const STATE_LABEL = EXAMPLE_STATE.map((symbol) => SYMBOL_EMOJI[symbol]).join(
  "",
);

const StrategyProbabilityTable: FC = () => {
  const { sliderData, rows, isRecalculating } = useStrategyProbabilityTable();

  return (
    <div>
      <SliderGroup data={sliderData} />
      <div
        className="transition-opacity duration-300"
        style={{ opacity: isRecalculating ? 0.4 : 1 }}
      >
        <StyledTable
          headers={[
            { key: "state", content: STATE_LABEL },
            { key: "expectedValue", content: "Expected Value" },
            ...COLUMN_HEADERS.map((header) => ({
              key: header,
              content: header,
            })),
          ]}
          rows={rows.map((row) => ({
            key: row.key,
            className: row.isOptimal ? "bg-green-100" : undefined,
            cells: [
              { key: "label", content: row.label },
              { key: "expectedValue", content: row.expectedValue.toFixed(3) },
              { key: "random", content: formatProbability(row.random) },
              { key: "current", content: formatProbability(row.current) },
              { key: "optimized", content: formatProbability(row.optimized) },
            ],
          }))}
        />
      </div>
    </div>
  );
};

export default StrategyProbabilityTable;
