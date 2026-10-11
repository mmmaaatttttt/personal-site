import fs from "node:fs";
import path from "node:path";

// Kept out of data.ts because other client components import values from
// there directly, and `fs` can't be bundled into a client chunk.
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

export interface SocialShortfallRow {
  country: string;
  region: Region;
  socialThresholdsAchieved: number;
  biophysicalBoundariesTransgressed: number;
  gdpPerCapita: number;
}

export interface WithSocialShortfallByCountry {
  socialShortfallByCountry: SocialShortfallRow[];
}

export type EurogreenScenario = "Baseline" | "Green Growth" | "Degrowth";

export interface EurogreenScenarioRow {
  scenario: EurogreenScenario;
  year: number;
  gdpGrowthRate: number;
  unemploymentRate: number;
  co2PctOf1990: number;
  giniCoefficient: number;
}

export interface WithEurogreenFranceScenarios {
  eurogreenFranceScenarios: EurogreenScenarioRow[];
}

// World Bank SH.XPD.CHEX.PC.CD / SP.DYN.LE00.IN, 52 countries, 2000-2023, nominal USD not PPP (won't match OWID's chart if cited as a source).
function parseHealthOutcomesCSV(): HealthOutcomeByYear[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/data/health_spending_life_expectancy_2000_2023.csv",
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

function parseGdpHappinessCSV(): GdpHappinessRow[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/data/gdp_happiness_by_country_year_2014_2025.csv",
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

// Fanning, O'Neill, Hickel & Roux (2022), "The social shortfall and ecological
// overshoot of nations", Nat Sustain 5:26-36, supplementary data (2015, the
// most recent historical year). Counts are out of 11 social indicators and 6
// biophysical indicators, each normalised so 1.0 = the threshold/boundary;
// restricted to the 81 countries with non-missing data for every indicator.
// GDP per capita is World Bank NY.GDP.PCAP.CD for the same year.
function parseSocialShortfallCSV(): SocialShortfallRow[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/data/social_shortfall_ecological_overshoot_2015.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
  const [, ...dataLines] = text.trim().split("\n");

  return dataLines.map((line) => {
    const [
      country,
      region,
      socialThresholdsAchieved,
      biophysicalBoundariesTransgressed,
      gdpPerCapita,
    ] = line.split(",");
    return {
      country,
      region: region as Region,
      socialThresholdsAchieved: +socialThresholdsAchieved,
      biophysicalBoundariesTransgressed: +biophysicalBoundariesTransgressed,
      gdpPerCapita: +gdpPerCapita,
    };
  });
}

// D'Alessandro, Cieplinski, Distefano & Dittmer (2020), "Feasible
// alternatives to green growth", Nat Sustain 3:329-335 — the Eurogreen
// stock-flow-consistent model for France, 2014-2050. Extracted from the
// authors' own supplementary MATLAB output (mean simulated values across
// 500 Monte Carlo runs), restricted to 3 of the paper's 4 scenarios
// (dropping "Policies for Social Equity").
function parseEurogreenScenariosCSV(): EurogreenScenarioRow[] {
  const csvPath = path.join(
    process.cwd(),
    "content/stories/dont-produce-be-happy/data/eurogreen_france_scenarios_2014_2050.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
  const [, ...dataLines] = text.trim().split("\n");

  return dataLines.map((line) => {
    const [
      scenario,
      year,
      gdpGrowthRate,
      unemploymentRate,
      co2PctOf1990,
      giniCoefficient,
    ] = line.split(",");
    return {
      scenario: scenario as EurogreenScenario,
      year: +year,
      gdpGrowthRate: +gdpGrowthRate,
      unemploymentRate: +unemploymentRate,
      co2PctOf1990: +co2PctOf1990,
      giniCoefficient: +giniCoefficient,
    };
  });
}

export const healthOutcomesByYear: HealthOutcomeByYear[] =
  parseHealthOutcomesCSV();

export const gdpHappinessByCountryYear: GdpHappinessRow[] =
  parseGdpHappinessCSV();

export const socialShortfallByCountry: SocialShortfallRow[] =
  parseSocialShortfallCSV();

export const eurogreenFranceScenarios: EurogreenScenarioRow[] =
  parseEurogreenScenariosCSV();
