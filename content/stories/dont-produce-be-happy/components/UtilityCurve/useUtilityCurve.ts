"use client";

import type { ScaleLinear } from "d3-scale";
import { useMemo, useState } from "react";
import useSliders from "@/hooks/useSliders";
import { clamp } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";
import type { GdpHappinessRow } from "../../data/csvData";
import { linearRegression } from "../../utils";

const MIN_INCOME = 500;
const MAX_INCOME = 150000;
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

  const { values, sliderData } = useSliders([
    {
      initialValue: MIN_YEAR,
      min: MIN_YEAR,
      max: MAX_YEAR,
      step: 1,
      title: (val) => `Year: ${val}`,
      color: COLORS.BLUE,
    },
  ]);
  const [year] = values;

  const yearRows = useMemo(
    () => gdpHappinessByCountryYear.filter((d) => d.year === year),
    [gdpHappinessByCountryYear, year],
  );

  // Log-utility (Bernoulli 1738); slope/intercept are an OLS fit (R^2~=0.78) on the same countries shown in GdpHappinessDivergence, not the WHR's own multi-factor model.
  const { slope, intercept, rSquared } = useMemo(
    () =>
      linearRegression(
        yearRows.map((d) => ({
          x: Math.log(d.gdpPerCapita),
          y: d.lifeLadder,
        })),
      ),
    [yearRows],
  );

  function predictedLifeLadder(incomeValue: number): number {
    return intercept + slope * Math.log(incomeValue);
  }

  const curveData = useMemo(
    () =>
      Array.from({ length: CURVE_STEPS + 1 }, (_, i) => {
        const x = MIN_INCOME + (i / CURVE_STEPS) * (MAX_INCOME - MIN_INCOME);
        return { x, y: intercept + slope * Math.log(x) };
      }),
    [slope, intercept],
  );

  const scatterPoints = useMemo(
    () =>
      yearRows.map((d) => ({
        x: d.gdpPerCapita,
        y: d.lifeLadder,
        key: d.country,
      })),
    [yearRows],
  );

  function handleDrag(_id: number, { x }: { x: number; y: number }) {
    const clamped = clamp(x, xMin, xMax);
    // The axis domain starts at 0 (to match GdpHappinessDivergence), but
    // Math.log(income) blows up as income approaches 0, so clamp the
    // resulting income separately to the curve's own safe bounds.
    setIncome(clamp(xScale.invert(clamped), MIN_INCOME, MAX_INCOME));
  }

  const currentWellbeing = predictedLifeLadder(income);
  // d/dx [intercept + slope * ln(x)] = slope / x
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
