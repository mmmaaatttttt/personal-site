"use client";

import { type FC, useMemo, useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import { Button } from "@/components/ui/Button";
import COLORS from "@/utils/styles";
import { characterNames, standees } from "../../data";
import { standeesForCharacterCount } from "../../utils";
import StandeeGrid from "../StandeeGrid";
import {
  DEFAULT_NUM_CHARACTERS,
  DEFAULT_SPEED,
  MAX_SPEED,
  MIN_NUM_CHARACTERS,
  MIN_SPEED,
  SPEED_STEP,
} from "./constants";
import { useStandeeCollector } from "./useStandeeCollector";

const StandeeCollector: FC = () => {
  const [numCharacters, setNumCharacters] = useState(DEFAULT_NUM_CHARACTERS);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const standeeData = useMemo(
    () => standeesForCharacterCount(standees, numCharacters),
    [numCharacters],
  );

  const {
    tallies,
    starterFlags,
    lastDrawnIndex,
    playing,
    isFinished,
    toggle,
    reset,
  } = useStandeeCollector(standeeData, speed);

  const draws = tallies.reduce((sum, tally) => sum + tally, 0);
  const foundCount = tallies.filter(
    (tally, index) => tally > 0 || starterFlags[index],
  ).length;

  const settingsSliderData = [
    {
      value: numCharacters,
      handleValueChange: setNumCharacters,
      min: MIN_NUM_CHARACTERS,
      max: characterNames.length,
      step: 1,
      title: (val: number) => `Number of Characters: ${val}`,
      color: COLORS.ORANGE,
    },
  ];

  const speedSliderData = [
    {
      value: speed,
      handleValueChange: setSpeed,
      min: MIN_SPEED,
      max: MAX_SPEED,
      step: SPEED_STEP,
      title: (val: number) => `Speed: ${val.toFixed(1)}x`,
      color: COLORS.GREEN,
    },
  ];

  return (
    <NarrowContainer width="100%" fullWidthAt="sm">
      <SliderGroup data={playing ? speedSliderData : settingsSliderData} />
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
        Draws: {draws} — Found {foundCount} / {standeeData.length}
      </p>
      <StandeeGrid
        standeeData={standeeData}
        tallies={tallies}
        starterFlags={starterFlags}
        lastDrawnIndex={lastDrawnIndex}
      />
    </NarrowContainer>
  );
};

export default StandeeCollector;
