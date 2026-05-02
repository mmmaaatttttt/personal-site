import fs from "fs";
import path from "path";
import { calculateWastedVotes } from "@/utils/mathHelpers";
import COLORS from "@/utils/styles";

export interface ElectionRow {
  year: number;
  state: string;
  district: number;
  dem: number;
  rep: number;
  demEst: boolean;
  repEst: boolean;
}

// Pre-computed per-state, per-year efficiency gap and seat gap.
export interface StateSummary {
  state: string;
  efficiencyGaps: Record<number, number>;
  seatGaps: Record<number, number>;
}

export interface SliderConfig {
  title: (val: number) => string;
  min: number;
  max: number;
  initialValue: number;
  step: number;
  color: string;
}

// Signed efficiency gap: positive favors Republicans, negative favors Democrats.
// Computed as the mean over districts of (demWasted - repWasted) / totalVotes.
export function calculateNormalizedEg(values: ElectionRow[]): number {
  if (!values.length) return 0;
  const repAccessor = (d: ElectionRow) => d.rep;
  const demAccessor = (d: ElectionRow) => d.dem;
  const wastedVotes = calculateWastedVotes(values, repAccessor, demAccessor);
  return (
    wastedVotes.reduce((acc, wv, i) => {
      const totalVotes = repAccessor(values[i]) + demAccessor(values[i]);
      return acc + (wv[1] - wv[0]) / totalVotes;
    }, 0) / wastedVotes.length
  );
}

function parseCSV(): ElectionRow[] {
  const csvPath = path.join(
    process.cwd(),
    "data/csv/congressional_election_results_1996_2016.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8");
  const lines = text.trim().split("\n").slice(1);

  return lines
    .filter((line) => {
      const parts = line.split(",");
      const district = parts[2];
      return district !== "Senate" && district !== "President";
    })
    .map((line) => {
      const [Year, State, District, Republican, Democrat] = line.split(",");
      const demEst = Democrat.includes("*");
      const repEst = Republican.includes("*");
      return {
        year: +Year,
        state: State,
        district: +District,
        dem: +Democrat.replace("*", ""),
        rep: +Republican.replace("*", ""),
        demEst,
        repEst,
      };
    });
}

function computeStateSummaries(rows: ElectionRow[]): StateSummary[] {
  const years = Array.from(new Set(rows.map((r) => r.year)));
  const byState = new Map<string, ElectionRow[]>();
  for (const row of rows) {
    const existing = byState.get(row.state) ?? [];
    existing.push(row);
    byState.set(row.state, existing);
  }

  const summaries: StateSummary[] = [];
  for (const [state, stateRows] of byState) {
    const efficiencyGaps: Record<number, number> = {};
    const seatGaps: Record<number, number> = {};
    for (const year of years) {
      const yearRows = stateRows.filter((r) => r.year === year);
      if (!yearRows.length) continue;
      const eg = calculateNormalizedEg(yearRows);
      efficiencyGaps[year] = eg;
      seatGaps[year] = eg * yearRows.length;
    }
    summaries.push({ state, efficiencyGaps, seatGaps });
  }
  return summaries;
}

export const electionData: ElectionRow[] = parseCSV();

export const stateSummaries: StateSummary[] =
  computeStateSummaries(electionData);

export const gerrymanderSliders: SliderConfig[] = [
  {
    title: (val) => `Year: ${val}`,
    min: 1996,
    max: 2016,
    initialValue: 2016,
    step: 2,
    color: COLORS.DARK_GRAY,
  },
  {
    title: (val) => `Minimum Number of Electors: ${val}`,
    min: 2,
    max: 10,
    initialValue: 2,
    step: 1,
    color: COLORS.DARK_GRAY,
  },
];
