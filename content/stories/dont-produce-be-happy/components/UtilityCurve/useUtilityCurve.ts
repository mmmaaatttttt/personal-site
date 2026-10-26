"use client";

import type { ScaleLinear } from "d3-scale";
import { useMemo, useState } from "react";
import { clamp } from "@/utils/mathHelpers";
import { GDP_PER_CAPITA_DOMAIN } from "../../constants";
import type { GdpHappinessRow } from "../../data/csvData";
import useYearSlider from "../../useYearSlider";
import { linearRegression } from "../../utils";

const MIN_INCOME = 500;
const MAX_INCOME = GDP_PER_CAPITA_DOMAIN[1];
const CURVE_STEPS = 50;
const INITIAL_INCOME = 20000;
const MIN_YEAR = 2014;
const MAX_YEAR = 2025;

export default function useUtilityCurve(
  gdpHappinessByCountryYear: GdpHappinessRow[],
  xScale: ScaleLinear<number, number>,
  xMin: number,
  xMax: number,
) {
  const [income, setIncome] = useState(INITIAL_INCOME);
  const [showTangent, setShowTangent] = useState(false);
  const [showEquation, setShowEquation] = useState(false);

  const { year, sliderData } = useYearSlider(MIN_YEAR, MAX_YEAR, MIN_YEAR);

  const yearRows = useMemo(
    () => gdpHappinessByCountryYear.filter((row) => row.year === year),
    [gdpHappinessByCountryYear, year],
  );

  const { slope, intercept, rSquared } = useMemo(
    () =>
      linearRegression(
        yearRows.map((row) => ({
          x: Math.log(row.gdpPerCapita),
          y: row.lifeLadder,
        })),
      ),
    [yearRows],
  );

  function predictedLifeLadder(incomeValue: number): number {
    return intercept + slope * Math.log(incomeValue);
  }

  const curveData = useMemo(
    () =>
      Array.from({ length: CURVE_STEPS + 1 }, (_, step) => {
        const curveIncome =
          MIN_INCOME + (step / CURVE_STEPS) * (MAX_INCOME - MIN_INCOME);
        return { x: curveIncome, y: intercept + slope * Math.log(curveIncome) };
      }),
    [slope, intercept],
  );

  const scatterPoints = useMemo(
    () =>
      yearRows.map((row) => ({
        x: row.gdpPerCapita,
        y: row.lifeLadder,
        key: row.country,
      })),
    [yearRows],
  );

  function handleDrag(_id: number, { x: pointerX }: { x: number; y: number }) {
    const clamped = clamp(pointerX, xMin, xMax);
    setIncome(clamp(xScale.invert(clamped), MIN_INCOME, MAX_INCOME));
  }

  const currentWellbeing = predictedLifeLadder(income);
  const slopeAtIncome = slope / income;

  const tangentLine = {
    x1: MIN_INCOME,
    y1: currentWellbeing + slopeAtIncome * (MIN_INCOME - income),
    x2: MAX_INCOME,
    y2: currentWellbeing + slopeAtIncome * (MAX_INCOME - income),
  };

  return {
    income,
    handleDrag,
    curveData,
    scatterPoints,
    currentWellbeing,
    showTangent,
    setShowTangent,
    showEquation,
    setShowEquation,
    tangentLine,
    sliderData,
    slope,
    intercept,
    rSquared,
  };
}
