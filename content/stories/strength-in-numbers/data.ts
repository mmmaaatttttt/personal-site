import fs from "node:fs";
import path from "node:path";

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

export interface VotingDataRow {
  year: number;
  state: string;
  abbreviation: string;
  num_jurisdictions: number;
  active_registration: number;
  election_participants: number;
  eligible_voters_estimated: number;
  jurisdictions_with_poll_worker_count: number;
  participants_in_jurisdictions_with_poll_worker_info: number;
  participants_in_jurisdictions_with_polling_place_info: number;
  polling_places: number;
  poll_workers: number;
  difficulty_very_difficult: number;
  difficulty_somewhat_difficult: number;
  difficulty_neither_difficult_nor_easy: number;
  difficulty_somewhat_easy: number;
  difficulty_very_easy: number;
  dem_percent: number;
  rep_percent: number;
  ages: number[];
}

interface RawRow {
  year: number;
  state: string;
  abbreviation: string;
  num_jurisdictions: number;
  active_registration: number;
  election_participants: number;
  eligible_voters_estimated: number;
  jurisdictions_with_poll_worker_count: number;
  participants_in_jurisdictions_with_poll_worker_info: number;
  participants_in_jurisdictions_with_polling_place_info: number;
  polling_places: number;
  poll_workers: number;
  worker_age_group_1: number;
  worker_age_group_2: number;
  worker_age_group_3: number;
  worker_age_group_4: number;
  worker_age_group_5: number;
  worker_age_group_6: number;
  difficulty_very_difficult: number;
  difficulty_somewhat_difficult: number;
  difficulty_neither_difficult_nor_easy: number;
  difficulty_somewhat_easy: number;
  difficulty_very_easy: number;
  dem_percent: number;
  rep_percent: number;
}

function parseCSV(): RawRow[] {
  const csvPath = path.join(
    process.cwd(),
    "data/csv/voting_data_2008_2016.csv",
  );
  const text = fs.readFileSync(csvPath, "utf-8").replace(/\r/g, "");
  const [headerLine, ...dataLines] = text.trim().split("\n");
  const headers = headerLine.split(",");

  const idx = (name: string) => headers.indexOf(name);

  const yearIdx = idx("year");
  const stateIdx = idx("state");
  const abbrevIdx = idx("abbreviation");
  const numJurisIdx = idx("num_jurisdictions");
  const activeRegIdx = idx("active_registration");
  const participantsIdx = idx("election_participants");
  const eligibleIdx = idx("eligible_voters_estimated");
  const jurisWorkerCountIdx = idx("jurisdictions_with_poll_worker_count");
  const partWorkerInfoIdx = idx(
    "participants_in_jurisdictions_with_poll_worker_info",
  );
  const partPollingPlaceInfoIdx = idx(
    "participants_in_jurisdictions_with_polling_place_info",
  );
  const pollingPlacesIdx = idx("polling_places");
  const pollWorkersIdx = idx("poll_workers");
  const age1Idx = idx("worker_age_group_1");
  const diffSomewhatDiffIdx = idx("difficulty_somewhat_difficult");
  const diffVeryEasyIdx = idx("difficulty_very_easy");
  const diffVeryDiffIdx = idx("difficulty_very_difficult");
  const diffSomewhatEasyIdx = idx("difficulty_somewhat_easy");
  const diffNeitherIdx = idx("difficulty_neither_difficult_nor_easy");
  const demIdx = idx("dem_percent");
  const repIdx = idx("rep_percent");

  return dataLines.map((line) => {
    const cols = line.split(",");
    return {
      year: +cols[yearIdx],
      state: cols[stateIdx],
      abbreviation: cols[abbrevIdx],
      num_jurisdictions: +cols[numJurisIdx],
      active_registration: +cols[activeRegIdx],
      election_participants: +cols[participantsIdx],
      eligible_voters_estimated: +cols[eligibleIdx],
      jurisdictions_with_poll_worker_count: +cols[jurisWorkerCountIdx],
      participants_in_jurisdictions_with_poll_worker_info:
        +cols[partWorkerInfoIdx],
      participants_in_jurisdictions_with_polling_place_info:
        +cols[partPollingPlaceInfoIdx],
      polling_places: +cols[pollingPlacesIdx],
      poll_workers: +cols[pollWorkersIdx],
      worker_age_group_1: +cols[age1Idx],
      worker_age_group_2: +cols[age1Idx + 1],
      worker_age_group_3: +cols[age1Idx + 2],
      worker_age_group_4: +cols[age1Idx + 3],
      worker_age_group_5: +cols[age1Idx + 4],
      worker_age_group_6: +cols[age1Idx + 5],
      difficulty_somewhat_difficult: +cols[diffSomewhatDiffIdx],
      difficulty_very_easy: +cols[diffVeryEasyIdx],
      difficulty_very_difficult: +cols[diffVeryDiffIdx],
      difficulty_somewhat_easy: +cols[diffSomewhatEasyIdx],
      difficulty_neither_difficult_nor_easy: +cols[diffNeitherIdx],
      dem_percent: +cols[demIdx],
      rep_percent: +cols[repIdx],
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
      .filter((n) => n !== 0 && Number.isFinite(n));
    const turnouts = stateRows
      .map((d) => d.election_participants / d.eligible_voters_estimated)
      .filter((n) => n !== 0 && Number.isFinite(n));

    const averageSaturation =
      saturations.length > 0
        ? saturations.reduce((a, b) => a + b, 0) / saturations.length
        : 0;
    const averageTurnout =
      turnouts.length > 0
        ? turnouts.reduce((a, b) => a + b, 0) / turnouts.length
        : 0;

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

function computeRawVotingData(rows: RawRow[]): VotingDataRow[] {
  return rows.map((row) => ({
    year: row.year,
    state: row.state,
    abbreviation: row.abbreviation,
    num_jurisdictions: row.num_jurisdictions,
    active_registration: row.active_registration,
    election_participants: row.election_participants,
    eligible_voters_estimated: row.eligible_voters_estimated,
    jurisdictions_with_poll_worker_count:
      row.jurisdictions_with_poll_worker_count,
    participants_in_jurisdictions_with_poll_worker_info:
      row.participants_in_jurisdictions_with_poll_worker_info,
    participants_in_jurisdictions_with_polling_place_info:
      row.participants_in_jurisdictions_with_polling_place_info,
    polling_places: row.polling_places,
    poll_workers: row.poll_workers,
    difficulty_very_difficult: row.difficulty_very_difficult,
    difficulty_somewhat_difficult: row.difficulty_somewhat_difficult,
    difficulty_neither_difficult_nor_easy:
      row.difficulty_neither_difficult_nor_easy,
    difficulty_somewhat_easy: row.difficulty_somewhat_easy,
    difficulty_very_easy: row.difficulty_very_easy,
    dem_percent: row.dem_percent,
    rep_percent: row.rep_percent,
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

export const pollWorkerAgeData: PollWorkerAgeRow[] =
  computePollWorkerAgeData(rawRows);

export const rawVotingData: VotingDataRow[] = computeRawVotingData(rawRows);

export const allStates: string[] = Array.from(
  new Set(rawRows.map((r) => r.state)),
).sort();
