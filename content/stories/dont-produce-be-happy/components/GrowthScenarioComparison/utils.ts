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
      .sort((a, b) => a.year - b.year)
      .map((row) => ({ x: row.year, y: accessor(row) })),
  }));
}
