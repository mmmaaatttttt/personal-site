"use client";

import { FC, useState } from "react";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import Select from "@/components/story/shared/Select";
import COLORS from "@/utils/styles";
import orchardData from "@/data/json/orchard-game.json";
import { selectOptions, sliderData, type OrchardDataPoint } from "../../data";
import HeatChart from "./HeatChart";

const data = orchardData as OrchardDataPoint[];

const OrchardGameHeatData: FC<{ caption?: string }> = () => {
  const [selectedOption, setSelectedOption] = useState(selectOptions[0]);

  const getTooltipBody = (d: OrchardDataPoint): string[] => {
    const { label, accessor, value } = selectedOption;
    const percentage = (accessor(d) * 100).toFixed(3);
    return [
      `Fruits per color: ${d.fruits}`,
      `Raven count: ${d.ravenCount}`,
      value === "diff"
        ? `${label}: ${percentage} points`
        : `Win probability with ${label.toLowerCase()}: ${percentage}%`,
    ];
  };

  return (
    <SliderProvider
      initialData={sliderData}
      width="50%"
      render={(sliderVals) => {
        const [colorCount, wildCardCount] = sliderVals;
        const { value, accessor } = selectedOption;

        const colorDomain = value === "diff" ? [0.05, 0.25] : [0, 0.2, 0.4, 0.6, 0.8, 1];
        const colorRange =
          value === "diff"
            ? [COLORS.BLUE, COLORS.DARK_BLUE]
            : [COLORS.BLACK, COLORS.RED, COLORS.ORANGE, COLORS.YELLOW, COLORS.GREEN, COLORS.DARK_GREEN];

        const heatData = data
          .filter((d) => d.colors === colorCount && d.wildCardCount === wildCardCount)
          .reduce<(OrchardDataPoint | null)[][]>((matrix, obj) => {
            const x = obj.ravenCount - 1;
            const y = obj.fruits - 1;
            if (!matrix[x]) matrix[x] = [];
            matrix[x][y] = obj;
            return matrix;
          }, []);

        return (
          <div className="mt-4 space-y-3">
            <Select
              name="strategy"
              value={selectedOption.value}
              onChange={(opt) =>
                setSelectedOption(
                  selectOptions.find((o) => o.value === opt.value) ?? selectOptions[0]
                )
              }
              options={selectOptions.map(({ value, label }) => ({ value, label }))}
            />
            <HeatChart
              data={heatData}
              accessor={accessor}
              getTooltipBody={getTooltipBody}
              colorDomain={colorDomain}
              colorRange={colorRange}
              xAxisLabel="Raven Count"
              yAxisLabel="Fruits per Color"
            />
          </div>
        );
      }}
    />
  );
};

export default OrchardGameHeatData;
