"use client";

import { useMemo } from "react";
import type { GdpHappinessRow, HealthOutcomeByYear } from "../../data/csvData";
import useYearSlider from "../../useYearSlider";
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

  const { year, sliderData } = useYearSlider(minYear, maxYear, initialYear);

  const data = useMemo(() => {
    const yearRows = props.rows.filter((row) => row.year === year);
    if (props.variant === "gdp-happiness") {
      return deriveGdpHappinessScatterData(yearRows as GdpHappinessRow[]);
    }
    return deriveHealthScatterData(yearRows as HealthOutcomeByYear[]);
  }, [props.rows, props.variant, year]);

  return { sliderData, data };
}
