"use client";

import { type FC, useState } from "react";
import NarrowContainer from "@/components/story/shared/NarrowContainer";
import { SliderGroup } from "@/components/story/shared/Slider";
import StyledTable from "@/components/story/shared/StyledTable";
import COLORS from "@/utils/styles";
import type { StandeeInteractiveProps } from "../../types";
import { expectedCost, expectedTotalDraws } from "../../utils";
import {
  DEFAULT_GUARANTEED_MULTIPLIER,
  DEFAULT_NUM_STANDEES,
  DEFAULT_RANDOM_COST,
  MAX_GUARANTEED_MULTIPLIER,
  MAX_NUM_STANDEES,
  MAX_RANDOM_COST,
  MIN_GUARANTEED_MULTIPLIER,
  MIN_NUM_STANDEES,
  MIN_RANDOM_COST,
} from "./constants";

const NUMERIC_CELL_CLASS = "inline-block w-24 text-center";

const PureStrategyComparison: FC<StandeeInteractiveProps> = ({
  numStandees: initialNumStandees = DEFAULT_NUM_STANDEES,
}) => {
  const [numStandees, setNumStandees] = useState(initialNumStandees);
  const [randomCost, setRandomCost] = useState(DEFAULT_RANDOM_COST);
  const [guaranteedMultiplier, setGuaranteedMultiplier] = useState(
    DEFAULT_GUARANTEED_MULTIPLIER,
  );
  const guaranteedCost = randomCost * guaranteedMultiplier;

  const randomDraws = expectedTotalDraws(numStandees, numStandees);
  const randomTotalCost = expectedCost(
    numStandees,
    numStandees,
    randomCost,
    guaranteedCost,
  );
  const guaranteedDraws = expectedTotalDraws(numStandees, 0);
  const guaranteedTotalCost = expectedCost(
    numStandees,
    0,
    randomCost,
    guaranteedCost,
  );

  const randomRowClass =
    randomTotalCost === guaranteedTotalCost
      ? undefined
      : randomTotalCost < guaranteedTotalCost
        ? "text-green-700"
        : "text-red-700";
  const guaranteedRowClass =
    randomTotalCost === guaranteedTotalCost
      ? undefined
      : guaranteedTotalCost < randomTotalCost
        ? "text-green-700"
        : "text-red-700";

  const sliderData = [
    {
      key: "numStandees",
      value: numStandees,
      handleValueChange: setNumStandees,
      min: MIN_NUM_STANDEES,
      max: MAX_NUM_STANDEES,
      step: 1,
      title: (val: number) => `Number of Standees: ${val}`,
      color: COLORS.ORANGE,
    },
    {
      key: "randomCost",
      value: randomCost,
      handleValueChange: setRandomCost,
      min: MIN_RANDOM_COST,
      max: MAX_RANDOM_COST,
      step: 1,
      title: (val: number) =>
        `Random Cost per Standee: ${val} coin${val !== 1 ? "s" : ""}`,
      color: COLORS.BLUE,
    },
    {
      key: "guaranteedMultiplier",
      value: guaranteedMultiplier,
      handleValueChange: setGuaranteedMultiplier,
      min: MIN_GUARANTEED_MULTIPLIER,
      max: MAX_GUARANTEED_MULTIPLIER,
      step: 1,
      title: (val: number) =>
        `Guaranteed Cost Per Standee: ${val}x Random Cost`,
      color: COLORS.MAROON,
    },
  ];

  return (
    <NarrowContainer width="85%" fullWidthAt="sm">
      <SliderGroup data={sliderData} />
      <StyledTable
        headers={[
          { key: "strategy", content: "Strategy" },
          { key: "draws", content: "Expected Number of Standees" },
          { key: "cost", content: "Expected Total Coin Cost" },
        ]}
        rows={[
          {
            key: "random",
            className: randomRowClass,
            cells: [
              { key: "strategy", content: "Random" },
              {
                key: "draws",
                content: (
                  <span className={NUMERIC_CELL_CLASS}>
                    {randomDraws.toFixed(1)}
                  </span>
                ),
              },
              {
                key: "cost",
                content: (
                  <span className={NUMERIC_CELL_CLASS}>
                    {randomTotalCost.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                ),
              },
            ],
          },
          {
            key: "guaranteed",
            className: guaranteedRowClass,
            cells: [
              { key: "strategy", content: "Guaranteed" },
              {
                key: "draws",
                content: (
                  <span className={NUMERIC_CELL_CLASS}>
                    {guaranteedDraws.toLocaleString()}
                  </span>
                ),
              },
              {
                key: "cost",
                content: (
                  <span className={NUMERIC_CELL_CLASS}>
                    {guaranteedTotalCost.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                ),
              },
            ],
          },
        ]}
      />
    </NarrowContainer>
  );
};

export default PureStrategyComparison;
