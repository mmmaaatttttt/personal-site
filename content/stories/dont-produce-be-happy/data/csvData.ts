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
  co2EmissionsMt: number;
  giniCoefficient: number;
  governmentDeficitPctGdp: number;
}

export interface WithEurogreenFranceScenarios {
  eurogreenFranceScenarios: EurogreenScenarioRow[];
}

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
      co2EmissionsMt,
      giniCoefficient,
      governmentDeficitPctGdp,
    ] = line.split(",");
    return {
      scenario: scenario as EurogreenScenario,
      year: +year,
      gdpGrowthRate: +gdpGrowthRate,
      unemploymentRate: +unemploymentRate,
      co2EmissionsMt: +co2EmissionsMt,
      giniCoefficient: +giniCoefficient,
      governmentDeficitPctGdp: +governmentDeficitPctGdp,
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
