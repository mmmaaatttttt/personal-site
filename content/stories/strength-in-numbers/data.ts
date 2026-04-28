import fs from "fs";
import path from "path";

export interface VoterStateRow {
  state: string;
  averageSaturation: number;
  averageTurnout: number;
}

export interface PollWorkerAgeRow {
  year: number;
  state: string;
  ages: number[];
}

interface RawRow {
  year: number;
  state: string;
  active_registration: number;
  election_participants: number;
  eligible_voters_estimated: number;
  worker_age_group_1: number;
  worker_age_group_2: number;
  worker_age_group_3: number;
  worker_age_group_4: number;
  worker_age_group_5: number;
  worker_age_group_6: number;
}

function parseCSV(): RawRow[] {
  const csvPath = path.join(process.cwd(), "data/csv/voting_data_2008_2016.csv");
  const text = fs.readFileSync(csvPath, "utf-8");
  const [headerLine, ...dataLines] = text.trim().split("\n");
  const headers = headerLine.split(",");

  const idx = (name: string) => headers.indexOf(name);
  const yearIdx = idx("year");
  const stateIdx = idx("state");
  const activeRegIdx = idx("active_registration");
  const participantsIdx = idx("election_participants");
  const eligibleIdx = idx("eligible_voters_estimated");
  const age1Idx = idx("worker_age_group_1");

  return dataLines.map((line) => {
    const cols = line.split(",");
    return {
      year: +cols[yearIdx],
      state: cols[stateIdx],
      active_registration: +cols[activeRegIdx],
      election_participants: +cols[participantsIdx],
      eligible_voters_estimated: +cols[eligibleIdx],
      worker_age_group_1: +cols[age1Idx],
      worker_age_group_2: +cols[age1Idx + 1],
      worker_age_group_3: +cols[age1Idx + 2],
      worker_age_group_4: +cols[age1Idx + 3],
      worker_age_group_5: +cols[age1Idx + 4],
      worker_age_group_6: +cols[age1Idx + 5],
    };
  });
}

function computeVoterTableData(rows: RawRow[]): VoterStateRow[] {
  const byState = new Map<string, RawRow[]>();
  for (const row of rows) {
    const existing = byState.get(row.state) ?? [];
    existing.push(row);
    byState.set(row.state, existing);
  }

  return Array.from(byState.entries()).map(([state, stateRows]) => {
    const saturations = stateRows
      .map((d) => d.active_registration / d.eligible_voters_estimated)
      .filter((n) => n !== 0 && isFinite(n));
    const turnouts = stateRows
      .map((d) => d.election_participants / d.eligible_voters_estimated)
      .filter((n) => n !== 0 && isFinite(n));

    const averageSaturation =
      saturations.length > 0 ? saturations.reduce((a, b) => a + b, 0) / saturations.length : 0;
    const averageTurnout =
      turnouts.length > 0 ? turnouts.reduce((a, b) => a + b, 0) / turnouts.length : 0;

    return { state, averageSaturation, averageTurnout };
  });
}

function computePollWorkerAgeData(rows: RawRow[]): PollWorkerAgeRow[] {
  return rows.map((row) => ({
    year: row.year,
    state: row.state,
    ages: [
      row.worker_age_group_1,
      row.worker_age_group_2,
      row.worker_age_group_3,
      row.worker_age_group_4,
      row.worker_age_group_5,
      row.worker_age_group_6,
    ],
  }));
}

const rawRows = parseCSV();

export const voterTableData: VoterStateRow[] = computeVoterTableData(rawRows);

export const pollWorkerAgeData: PollWorkerAgeRow[] = computePollWorkerAgeData(rawRows);

export const allStates: string[] = Array.from(
  new Set(rawRows.map((r) => r.state))
).sort();
