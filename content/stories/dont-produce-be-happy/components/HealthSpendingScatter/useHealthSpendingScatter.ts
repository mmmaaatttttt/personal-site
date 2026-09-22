"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import type { HealthOutcomeByYear } from "../../healthSpendingData";
import { deriveHealthScatterData } from "./utils";

const MIN_YEAR = 2000;
const MAX_YEAR = 2023;

export default function useHealthSpendingScatter(
  healthOutcomesByYear: HealthOutcomeByYear[],
) {
  const { values, sliderData } = useSliders([
    {
      initialValue: MAX_YEAR,
      min: MIN_YEAR,
      max: MAX_YEAR,
      step: 1,
      title: (val) => `Year: ${val}`,
      color: COLORS.DARK_GRAY,
    },
  ]);
  const [year] = values;

  const data = useMemo(() => {
    const yearRows = healthOutcomesByYear.filter((row) => row.year === year);
    return deriveHealthScatterData(yearRows);
  }, [year, healthOutcomesByYear]);

  return { sliderData, year, data };
}
