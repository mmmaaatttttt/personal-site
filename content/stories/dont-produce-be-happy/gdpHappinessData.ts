import fs from "node:fs";
import path from "node:path";
import type { Region } from "./healthSpendingData";

export interface GdpHappinessRow {
  country: string;
  region: Region;
  year: number;
  gdpPerCapita: number;
  lifeLadder: number;
}

export interface WithGdpHappinessByCountryYear {
  gdpHappinessByCountryYear: GdpHappinessRow[];
}

function parseGdpHappinessCSV(): GdpHappinessRow[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/gdp_happiness_by_country_year_2014_2025.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
  const [, ...dataLines] = text.trim().split("\n");

  return dataLines.map((line) => {
    const [country, region, year, gdpPerCapita, lifeLadder] = line.split(",");
    return {
      country,
      region: region as Region,
      year: +year,
      gdpPerCapita: +gdpPerCapita,
      lifeLadder: +lifeLadder,
    };
  });
}

export const gdpHappinessByCountryYear: GdpHappinessRow[] =
  parseGdpHappinessCSV();
