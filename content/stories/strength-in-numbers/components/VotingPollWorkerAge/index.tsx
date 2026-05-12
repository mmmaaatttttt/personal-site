"use client";

import { scaleOrdinal } from "d3-scale";
import { type FC, useState } from "react";
import Caption from "@/components/story/shared/Caption";
import Legend from "@/components/story/shared/Legend";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import PieChart from "@/components/story/shared/PieChart";
import Select from "@/components/story/shared/Select";
import SliderProvider from "@/components/story/shared/Slider/SliderProvider";
import COLORS from "@/utils/styles";
import type { PollWorkerAgeRow } from "../../data";

const AGE_LABELS = ["<18", "18-25", "26-40", "41-60", "61-70", ">70"];
const AGE_COLORS = [
  COLORS.RED,
  COLORS.ORANGE,
  COLORS.YELLOW,
  COLORS.GREEN,
  COLORS.BLUE,
  COLORS.PURPLE,
];

const colorScale = scaleOrdinal<number, string>()
  .domain([0, 1, 2, 3, 4, 5])
  .range(AGE_COLORS);

const MIN_YEAR = 2010;
const MAX_YEAR = 2016;
const YEAR_STEP = 2;

interface VotingPollWorkerAgeProps {
  data: PollWorkerAgeRow[];
  states: string[];
  caption?: string;
}

const VotingPollWorkerAge: FC<VotingPollWorkerAgeProps> = ({
  data,
  states,
  caption,
}) => {
  const initialState = states[2] ?? states[0] ?? "";
  const [selectedState, setSelectedState] = useState(initialState);

  const stateOptions = states.map((s, i) => ({ value: String(i), label: s }));

  const sliderData = [
    {
      min: MIN_YEAR,
      max: MAX_YEAR,
      step: YEAR_STEP,
      initialValue: MIN_YEAR,
      color: COLORS.DARK_GRAY,
      tickCount: Math.round((MAX_YEAR - MIN_YEAR) / YEAR_STEP) + 1,
      title: (year: number) => `Year: ${year}`,
    },
  ];

  return (
    <Caption caption={caption}>
      <SliderProvider
        initialData={sliderData}
        width="46%"
        fullWidthAt="md"
        render={([curYear]) => {
          const match = data.find(
            (d) => d.year === curYear && d.state === selectedState,
          );
          const ages = match?.ages ?? [0, 0, 0, 0, 0, 0];
          const hasData = ages.some((a) => a > 0);
          const selectedOption =
            stateOptions.find((o) => o.label === selectedState) ??
            stateOptions[0];

          return (
            <div className="mt-4 space-y-3">
              <Select
                name="state"
                value={selectedOption?.value ?? ""}
                onChange={(opt) => setSelectedState(opt.label)}
                options={stateOptions}
              />
              {hasData ? (
                <>
                  <Legend
                    title="Poll worker ages (years)"
                    labels={AGE_COLORS.map((color, i) => ({
                      color,
                      text: AGE_LABELS[i],
                    }))}
                  />
                  <NarrowContainer width="100%" fullWidthAt="md">
                    <PieChart
                      colorScale={(i) => colorScale(i)}
                      values={ages}
                      textFill={COLORS.BLACK}
                      percentFormat=".1%"
                    />
                  </NarrowContainer>
                </>
              ) : (
                <>
                  <h4>
                    No data available for {selectedState} in {curYear}.
                  </h4>
                  <p>Please make another selection.</p>
                </>
              )}
            </div>
          );
        }}
      />
    </Caption>
  );
};

export default VotingPollWorkerAge;
