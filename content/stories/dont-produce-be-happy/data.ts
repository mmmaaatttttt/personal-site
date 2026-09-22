import { diminishingReturns, exponentialGrowth } from "./utils";

export const gdpGpiSeries = Array.from({ length: 15 }, (_, i) => {
  const year = 1950 + i * 5;
  const t = year - 1950;
  return {
    year,
    gdpIndex: exponentialGrowth(100, 0.025, t),
    gpiIndex: 100 + 150 * diminishingReturns(t, 8),
  };
});

export interface HappinessDataPoint {
  country: string;
  gdpPerCapita: number;
  lifeLadder: number;
  year?: number;
}

// Real WHR/Gallup Life Ladder data, hand-entered Sept 2026; the US time series uses a different GDP basis (chained 2012 $) than the cross-section (nominal), so don't compare GDP across panels.
export const crossSectionCountries: HappinessDataPoint[] = [
  { country: "Finland", gdpPerCapita: 44855, lifeLadder: 7.764 },
  { country: "Denmark", gdpPerCapita: 63230, lifeLadder: 7.539 },
  { country: "Iceland", gdpPerCapita: 57955, lifeLadder: 7.54 },
  { country: "Germany", gdpPerCapita: 56087, lifeLadder: 6.882 },
  { country: "Mexico", gdpPerCapita: 13988, lifeLadder: 6.972 },
  { country: "United States", gdpPerCapita: 85810, lifeLadder: 6.816 },
  { country: "Brazil", gdpPerCapita: 9565, lifeLadder: 6.634 },
  { country: "Japan", gdpPerCapita: 37145, lifeLadder: 6.13 },
  { country: "China", gdpPerCapita: 13122, lifeLadder: 6.074 },
  { country: "Nigeria", gdpPerCapita: 2448, lifeLadder: 4.788 },
  { country: "Kenya", gdpPerCapita: 1853, lifeLadder: 4.674 },
  { country: "India", gdpPerCapita: 2397, lifeLadder: 4.536 },
];

export const TRACKED_COUNTRY = "United States";

// Real data from the official WHR data file; 2013 is genuinely missing from the source, not an omission here.
export const usHappinessRankTable: string[][] = [
  ["Year", "US world rank"],
  ["2011", "11th"],
  ["2012", "17th"],
  ["2014", "15th"],
  ["2015", "13th"],
  ["2016", "14th"],
  ["2017", "18th"],
  ["2018", "19th"],
  ["2019", "18th"],
  ["2020", "19th"],
  ["2021", "16th"],
  ["2022", "15th"],
  ["2023", "23rd"],
  ["2024", "24th"],
  ["2025", "23rd"],
];

export const timeSeriesCountry: HappinessDataPoint[] = [
  {
    country: "United States",
    year: 2011,
    gdpPerCapita: 55097,
    lifeLadder: 7.27,
  },
  {
    country: "United States",
    year: 2014,
    gdpPerCapita: 57919,
    lifeLadder: 7.119,
  },
  {
    country: "United States",
    year: 2017,
    gdpPerCapita: 61026,
    lifeLadder: 6.886,
  },
  {
    country: "United States",
    year: 2020,
    gdpPerCapita: 62647,
    lifeLadder: 6.951,
  },
  {
    country: "United States",
    year: 2023,
    gdpPerCapita: 68095,
    lifeLadder: 6.725,
  },
];

export interface CountryOutcome {
  country: string;
  hdi: number;
  ecologicalFootprint: number;
  gdpPerCapita: number;
}

// Real data (UNDP HDI, Global Footprint Network, World Bank GDP), hand-entered Sept 2026.
export const socialEcologicalData: CountryOutcome[] = [
  {
    country: "United States",
    hdi: 0.938,
    ecologicalFootprint: 7.9,
    gdpPerCapita: 85810,
  },
  {
    country: "Canada",
    hdi: 0.939,
    ecologicalFootprint: 8.4,
    gdpPerCapita: 44402,
  },
  {
    country: "Germany",
    hdi: 0.959,
    ecologicalFootprint: 4.6,
    gdpPerCapita: 56087,
  },
  {
    country: "Japan",
    hdi: 0.925,
    ecologicalFootprint: 4.3,
    gdpPerCapita: 37145,
  },
  {
    country: "Russia",
    hdi: 0.832,
    ecologicalFootprint: 6.1,
    gdpPerCapita: 11043,
  },
  {
    country: "Mexico",
    hdi: 0.789,
    ecologicalFootprint: 2.6,
    gdpPerCapita: 13988,
  },
  {
    country: "China",
    hdi: 0.797,
    ecologicalFootprint: 3.6,
    gdpPerCapita: 13122,
  },
  {
    country: "Brazil",
    hdi: 0.786,
    ecologicalFootprint: 2.4,
    gdpPerCapita: 9565,
  },
  {
    country: "Indonesia",
    hdi: 0.728,
    ecologicalFootprint: 1.8,
    gdpPerCapita: 4368,
  },
  {
    country: "India",
    hdi: 0.685,
    ecologicalFootprint: 1.1,
    gdpPerCapita: 2397,
  },
  {
    country: "Bangladesh",
    hdi: 0.685,
    ecologicalFootprint: 0.8,
    gdpPerCapita: 1941,
  },
  {
    country: "Kenya",
    hdi: 0.628,
    ecologicalFootprint: 0.9,
    gdpPerCapita: 1853,
  },
  {
    country: "Pakistan",
    hdi: 0.544,
    ecologicalFootprint: 0.8,
    gdpPerCapita: 1644,
  },
  {
    country: "Nigeria",
    hdi: 0.56,
    ecologicalFootprint: 0.8,
    gdpPerCapita: 2448,
  },
  {
    country: "Ethiopia",
    hdi: 0.497,
    ecologicalFootprint: 0.9,
    gdpPerCapita: 916,
  },
];
