"use client";

import { type FC, useMemo } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import { Button } from "@/components/ui/Button";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { characterNames, standees } from "../../data";
import {
  DEFAULT_NUM_CHARACTERS,
  MIN_NUM_CHARACTERS,
  NUM_CHARACTERS_KEY,
} from "../../sliderStore";
import { standeesForCharacterCount } from "../../utils";
import StandeeGrid from "../StandeeGrid";
import { useMixedStrategyExplorer } from "./useMixedStrategyExplorer";

const MixedStrategyExplorer: FC = () => {
  const { values, sliderData: numCharactersSliderData } = useSliders([
    {
      key: "numCharacters",
      initialValue: DEFAULT_NUM_CHARACTERS,
      storageKey: NUM_CHARACTERS_KEY,
      min: MIN_NUM_CHARACTERS,
      max: characterNames.length,
      step: 1,
      title: (val: number) => `Number of Characters: ${val}`,
      color: COLORS.ORANGE,
    },
  ]);
  const [numCharacters] = values;

  const standeeData = useMemo(
    () => standeesForCharacterCount(standees, numCharacters),
    [numCharacters],
  );

  const {
    tallies,
    lastDrawnIndex,
    totalCost,
    totalDraws,
    playing,
    isFinished,
    toggle,
    reset,
    settingsSliderData,
    speedSliderData,
  } = useMixedStrategyExplorer(standeeData.length);

  return (
    <NarrowContainer width="100%" fullWidthAt="sm">
      <SliderGroup
        data={
          playing
            ? speedSliderData
            : [...numCharactersSliderData, ...settingsSliderData]
        }
      />
      <div className="my-4 flex justify-center gap-3">
        {!isFinished && (
          <Button size="sm" onClick={toggle}>
            {playing ? "Pause" : "Play"}
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={reset}>
          Reset
        </Button>
      </div>
      <p className="mb-2 text-center text-sm text-gray-600">
        Draws: {totalDraws} — Total Cost: {totalCost.toLocaleString()} coins
      </p>
      <StandeeGrid
        standeeData={standeeData}
        tallies={tallies}
        lastDrawnIndex={lastDrawnIndex}
      />
    </NarrowContainer>
  );
};

export default MixedStrategyExplorer;
