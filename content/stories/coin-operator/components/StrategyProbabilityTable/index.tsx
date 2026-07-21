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
          padding="0.5rem 0.25rem"
          headers={[
            {
              key: "state",
              content: (
                <span className="!text-xs sm:!text-sm whitespace-nowrap">
                  {STATE_LABEL}
                </span>
              ),
            },
            {
              key: "expectedValue",
              content: (
                <span className="!text-[0.7rem] sm:!text-sm">
                  Expected Value
                </span>
              ),
            },
            ...COLUMN_HEADERS.map((header) => ({
              key: header,
              content: (
                <span className="!text-[0.7rem] sm:!text-sm">{header}</span>
              ),
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
