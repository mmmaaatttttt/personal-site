"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import { buildCobwebPath, findFixedPoints } from "../../mathUtils";
import { symmetricMap, symmetricMapPrime } from "./utils";

const STEPS = 20;

export default function useSymmetricCobweb() {
  const { values, sliderData } = useSliders([
    {
      initialValue: 2.5,
      min: 0,
      max: 10,
      title: (v) => `Curviness: ${(v / 10).toFixed(2)}`,
      step: 0.1,
      color: COLORS.BLUE,
    },
    {
      initialValue: 0.25,
      min: 0,
      max: 1,
      step: 0.01,
      title: (v) => `Initial contract price: $${v.toFixed(2)}`,
      color: COLORS.ORANGE,
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

  return { sliderData, map, cobwebPath, fixedPoints };
}
