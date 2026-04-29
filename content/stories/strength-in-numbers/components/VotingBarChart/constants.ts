import COLORS from "@/utils/styles";
import { total } from "@/utils/mathHelpers";
import type { VotingDataRow } from "../../data";

export interface BarOption {
  value: string;
  label: string;
  accessor: (d: VotingDataRow) => number | null;
  format: string;
  color: string;
}

export const VOTERS_BAR_OPTIONS: BarOption[] = [
  {
    value: "saturation",
    label: "Registration Saturation",
    accessor: (d) =>
      d.active_registration && d.eligible_voters_estimated
        ? d.active_registration / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.PURPLE,
  },
  {
    value: "turnout",
    label: "Election Turnout",
    accessor: (d) =>
      d.election_participants && d.eligible_voters_estimated
        ? d.election_participants / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.MAROON,
  },
];

const AGE_LABELS = [
  "under 18",
  "between 18 and 25",
  "between 26 and 40",
  "between 41 and 60",
  "between 61 and 70",
  "over 70",
];

export const PARTY_BAR_OPTIONS: BarOption[] = [
  {
    value: "0",
    label: "Most Democratic States",
    accessor: (d) => d.dem_percent,
    format: ".0f",
    color: COLORS.DARK_BLUE,
  },
  {
    value: "1",
    label: "Most Republican States",
    accessor: (d) => d.rep_percent,
    format: ".0f",
    color: COLORS.RED,
  },
  {
    value: "2",
    label: "Registration Saturation",
    accessor: (d) =>
      d.active_registration && d.eligible_voters_estimated
        ? d.active_registration / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.PURPLE,
  },
  {
    value: "3",
    label: "Election Turnout",
    accessor: (d) =>
      d.election_participants && d.eligible_voters_estimated
        ? d.election_participants / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.MAROON,
  },
  {
    value: "4",
    label: "Poll Workers per Polling Place",
    accessor: (d) =>
      d.poll_workers && d.polling_places ? d.poll_workers / d.polling_places : null,
    format: ".0f",
    color: COLORS.GREEN,
  },
  {
    value: "5",
    label: "Poll Workers per 1,000 Election Participants",
    accessor: (d) =>
      d.poll_workers && d.participants_in_jurisdictions_with_poll_worker_info
        ? (d.poll_workers / d.participants_in_jurisdictions_with_poll_worker_info) * 1000
        : null,
    format: ".0f",
    color: COLORS.DARK_BLUE,
  },
  {
    value: "6",
    label: "Polling Places per 1,000 Election Participants",
    accessor: (d) =>
      d.polling_places && d.participants_in_jurisdictions_with_polling_place_info
        ? (d.polling_places / d.participants_in_jurisdictions_with_polling_place_info) * 1000
        : null,
    format: ".0f",
    color: COLORS.DARK_GREEN,
  },
  {
    value: "7",
    label: "Average Difficulty of Finding Poll Workers",
    accessor: (d) => {
      const { difficulty_very_difficult: d5, difficulty_somewhat_difficult: d4, difficulty_neither_difficult_nor_easy: d3, difficulty_somewhat_easy: d2, difficulty_very_easy: d1 } = d;
      const numCounts = d1 + d2 + d3 + d4 + d5;
      return numCounts > 0 ? (1 * d1 + 2 * d2 + 3 * d3 + 4 * d4 + 5 * d5) / numCounts : null;
    },
    format: ".1f",
    color: COLORS.PURPLE,
  },
  ...AGE_LABELS.map((ageLabel, i) => ({
    value: String(8 + i),
    label: `Percentage of Reported Poll Workers ${ageLabel}`,
    accessor: (d: VotingDataRow) => {
      const t = total(d.ages);
      return t > 0 ? d.ages[i] / t : null;
    },
    format: ".0%",
    color: COLORS.ORANGE,
  })),
  {
    value: "14",
    label: "Percentage of Voters Who Don't Identify with Either Party",
    accessor: (d) => 1 - (d.dem_percent + d.rep_percent) / 100,
    format: ".0%",
    color: COLORS.GRAY,
  },
];

export const MIN_YEAR = 2008;
export const MAX_YEAR = 2016;
export const YEAR_STEP = 2;
