import COLORS from "@/utils/styles";
import type { Region } from "./csvData";

export const REGION_COLORS: Record<Region, string> = {
  "North America": COLORS.ORANGE,
  "South America": COLORS.MAROON,
  Africa: COLORS.PURPLE,
  Europe: COLORS.DARK_BLUE,
  Asia: COLORS.GREEN,
  Oceania: COLORS.BLUE,
};

export const REGION_LEGEND = Object.entries(REGION_COLORS).map(
  ([text, color]) => ({ text, color }),
);

export const TRACKED_COUNTRY = "United States";

export interface UsHappinessYear {
  year: number;
  rank: number;
  score: number;
}

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
