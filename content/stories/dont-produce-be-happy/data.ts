import { diminishingReturns, exponentialGrowth } from "./utils";

export const gdpGpiSeries = Array.from({ length: 15 }, (_, i) => {
  const year = 1950 + i * 5;
  const t = year - 1950;
  return {
    year,
    gdpIndex: Math.round(exponentialGrowth(100, 0.025, t) * 1e6) / 1e6,
    gpiIndex: Math.round((100 + 150 * diminishingReturns(t, 8)) * 1e6) / 1e6,
  };
});

export const TRACKED_COUNTRY = "United States";

export interface UsHappinessYear {
  year: number;
  rank: number;
  score: number;
}

// Real data from the official WHR data file (WHR26_Data_Figure_2.1.xlsx); 2013 is genuinely missing from the source. Starts at 2014 (not 2011) so every row's rank delta is a clean one-year comparison.
export const usHappinessByYear: UsHappinessYear[] = [
  { year: 2014, rank: 15, score: 7.119 },
  { year: 2015, rank: 13, score: 7.104 },
  { year: 2016, rank: 14, score: 6.993 },
  { year: 2017, rank: 18, score: 6.886 },
  { year: 2018, rank: 19, score: 6.892 },
  { year: 2019, rank: 18, score: 6.94 },
  { year: 2020, rank: 19, score: 6.951 },
  { year: 2021, rank: 16, score: 6.977 },
  { year: 2022, rank: 15, score: 6.894 },
  { year: 2023, rank: 23, score: 6.725 },
  { year: 2024, rank: 24, score: 6.724 },
  { year: 2025, rank: 23, score: 6.816 },
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
