"use client";

import { useMemo } from "react";
import useSliders from "@/hooks/useSliders";
import COLORS from "@/utils/styles";
import type { GdpHappinessRow, HealthOutcomeByYear } from "../../data/csvData";
import {
  deriveGdpHappinessScatterData,
  deriveHealthScatterData,
} from "./utils";

const GDP_MIN_YEAR = 2014;
const GDP_MAX_YEAR = 2025;
const HEALTH_MIN_YEAR = 2000;
const HEALTH_MAX_YEAR = 2023;

export type RegionScatterPlotContainerProps =
  | { variant: "gdp-happiness"; rows: GdpHappinessRow[] }
  | { variant: "health-spending"; rows: HealthOutcomeByYear[] };

export default function useRegionScatterData(
  props: RegionScatterPlotContainerProps,
) {
  const isGdpHappiness = props.variant === "gdp-happiness";
  const minYear = isGdpHappiness ? GDP_MIN_YEAR : HEALTH_MIN_YEAR;
  const maxYear = isGdpHappiness ? GDP_MAX_YEAR : HEALTH_MAX_YEAR;
  const initialYear = isGdpHappiness ? GDP_MIN_YEAR : HEALTH_MAX_YEAR;
  const sliderColor = isGdpHappiness ? COLORS.GREEN : COLORS.DARK_GRAY;

  const { values, sliderData } = useSliders([
    {
      initialValue: initialYear,
      min: minYear,
      max: maxYear,
      step: 1,
      title: (val) => `Year: ${val}`,
      color: sliderColor,
    },
  ]);
  const [year] = values;

  const data = useMemo(() => {
    const yearRows = props.rows.filter((row) => row.year === year);
    if (props.variant === "gdp-happiness") {
      return deriveGdpHappinessScatterData(yearRows as GdpHappinessRow[]);
    }
    return deriveHealthScatterData(yearRows as HealthOutcomeByYear[]);
  }, [props.rows, props.variant, year]);

  return { sliderData, data };
}
