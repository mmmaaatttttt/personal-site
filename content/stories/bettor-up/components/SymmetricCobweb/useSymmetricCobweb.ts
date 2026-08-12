"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import {
  buildCobwebPath,
  findFixedPoints,
  symmetricMap,
  symmetricMapPrime,
} from "../../mathUtils";

const STEPS = 20;
const RESPONSE_STRENGTH_MIN = 0;
const RESPONSE_STRENGTH_MAX = 12;
const RESPONSE_STRENGTH_INITIAL = 3;
const STARTING_PROBABILITY_INITIAL = 0.25;

export default function useSymmetricCobweb() {
  const { values, sliderData } = useSliders([
    {
      initialValue: RESPONSE_STRENGTH_INITIAL,
      min: RESPONSE_STRENGTH_MIN,
      max: RESPONSE_STRENGTH_MAX,
      title: (v) => `Probability curve concavity: ${v}`,
      step: 0.1,
      color: COLORS.ORANGE,
    },
    {
      initialValue: STARTING_PROBABILITY_INITIAL,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) => `Initial contract price: $${v.toFixed(2)}`,
      color: COLORS.BLUE,
    },
  ]);
  const [responseStrength, startingProbability] = values;

  const map = useMemo(
    () => (probability: number) => symmetricMap(probability, responseStrength),
    [responseStrength],
  );
  const mapDerivative = useMemo(
    () => (probability: number) =>
      symmetricMapPrime(probability, responseStrength),
    [responseStrength],
  );
  const cobwebPath = useMemo(
    () => buildCobwebPath(map, startingProbability, STEPS),
    [map, startingProbability],
  );
  const fixedPoints = useMemo(
    () => findFixedPoints(map, mapDerivative),
    [map, mapDerivative],
  );
  const gain = responseStrength / 4;

  return { sliderData, map, cobwebPath, fixedPoints, gain };
}
