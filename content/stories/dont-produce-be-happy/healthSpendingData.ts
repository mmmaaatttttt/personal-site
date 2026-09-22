import fs from "node:fs";
import path from "node:path";

export type Region =
  | "North America"
  | "South America"
  | "Africa"
  | "Europe"
  | "Asia"
  | "Oceania";

export interface HealthOutcomeByYear {
  country: string;
  region: Region;
  year: number;
  healthSpendingPerCapita: number;
  lifeExpectancy: number;
}

// World Bank SH.XPD.CHEX.PC.CD / SP.DYN.LE00.IN, 52 countries, 2000-2023, nominal USD not PPP (won't match OWID's chart if cited as a source).
// Kept out of data.ts because other client components import values from there directly, and `fs` can't be bundled into a client chunk.
function parseHealthOutcomesCSV(): HealthOutcomeByYear[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/health_spending_life_expectancy_2000_2023.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
  const [, ...dataLines] = text.trim().split("\n");

  return dataLines.map((line) => {
    const [country, region, year, healthSpendingPerCapita, lifeExpectancy] =
      line.split(",");
    return {
      country,
      region: region as Region,
      year: +year,
      healthSpendingPerCapita: +healthSpendingPerCapita,
      lifeExpectancy: +lifeExpectancy,
    };
  });
}

export const healthOutcomesByYear: HealthOutcomeByYear[] =
  parseHealthOutcomesCSV();
