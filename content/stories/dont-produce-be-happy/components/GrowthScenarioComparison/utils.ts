import COLORS from "@/utils/styles";
import type {
  EurogreenScenario,
  EurogreenScenarioRow,
} from "../../data/csvData";

export const SCENARIO_COLORS: Record<EurogreenScenario, string> = {
  Baseline: COLORS.DARK_GRAY,
  "Green Growth": COLORS.GREEN,
  Degrowth: COLORS.BLUE,
};

export const SCENARIO_LEGEND = Object.entries(SCENARIO_COLORS).map(
  ([text, color]) => ({ text, color }),
);

export function deriveScenarioSeries(
  rows: EurogreenScenarioRow[],
  accessor: (row: EurogreenScenarioRow) => number,
) {
  const scenarios = Object.keys(SCENARIO_COLORS) as EurogreenScenario[];
  return scenarios.map((scenario) => ({
    scenario,
    color: SCENARIO_COLORS[scenario],
    data: rows
      .filter((row) => row.scenario === scenario)
      .sort((first, second) => first.year - second.year)
      .map((row) => ({ x: row.year, y: accessor(row) })),
  }));
}

export interface ScenarioVariableOption {
  value: string;
  label: string;
  accessor: (row: EurogreenScenarioRow) => number;
  yDomain: [number, number];
  yTickFormat: string;
}

export const VARIABLE_OPTIONS: ScenarioVariableOption[] = [
  {
    value: "gdp-growth",
    label: "GDP growth rate",
    accessor: (row) => row.gdpGrowthRate / 100,
    yDomain: [-0.01, 0.02],
    yTickFormat: "+.1%",
  },
  {
    value: "unemployment",
    label: "Unemployment rate",
    accessor: (row) => row.unemploymentRate / 100,
    yDomain: [0, 0.15],
    yTickFormat: ".0%",
  },
  {
    value: "co2",
    label: "CO2 emissions (Mt)",
    accessor: (row) => row.co2EmissionsMt,
    yDomain: [0, 450],
    yTickFormat: ",",
  },
  {
    value: "gini",
    label: "Gini coefficient",
    accessor: (row) => row.giniCoefficient,
    yDomain: [0.22, 0.38],
    yTickFormat: ",",
  },
  {
    value: "deficit",
    label: "Government deficit (% of GDP)",
    accessor: (row) => row.governmentDeficitPctGdp / 100,
    yDomain: [0, 0.08],
    yTickFormat: ".1%",
  },
];
