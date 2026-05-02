import COLORS from "@/utils/styles";
import type { VotingDataRow } from "../../data";

export interface LineOption {
  value: string;
  label: string;
  accessor: (d: VotingDataRow) => number | null;
  format: string;
  color: string;
}

export const VOTERS_LINE_OPTIONS: LineOption[] = [
  {
    value: "0",
    label: "Active Registered Voters",
    accessor: (d) => d.active_registration || null,
    format: ".3s",
    color: COLORS.ORANGE,
  },
  {
    value: "1",
    label: "Election Participants",
    accessor: (d) => d.election_participants || null,
    format: ".3s",
    color: COLORS.GREEN,
  },
  {
    value: "2",
    label: "Eligible Voters",
    accessor: (d) => d.eligible_voters_estimated || null,
    format: ".3s",
    color: COLORS.DARK_BLUE,
  },
  {
    value: "3",
    label: "Registration Saturation",
    accessor: (d) =>
      d.active_registration && d.eligible_voters_estimated
        ? d.active_registration / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.PURPLE,
  },
  {
    value: "4",
    label: "Election Turnout",
    accessor: (d) =>
      d.election_participants && d.eligible_voters_estimated
        ? d.election_participants / d.eligible_voters_estimated
        : null,
    format: ".0%",
    color: COLORS.MAROON,
  },
];

export const WORKERS_LINE_OPTIONS: LineOption[] = [
  {
    value: "0",
    label: "% of Jurisdictions Reporting",
    accessor: (d) =>
      d.num_jurisdictions > 0
        ? d.jurisdictions_with_poll_worker_count / d.num_jurisdictions
        : null,
    format: ".2%",
    color: COLORS.MAROON,
  },
  {
    value: "1",
    label: "Poll Workers",
    accessor: (d) => d.poll_workers || null,
    format: ",.0f",
    color: COLORS.ORANGE,
  },
  {
    value: "2",
    label: "Polling Places",
    accessor: (d) => d.polling_places || null,
    format: ",.0f",
    color: COLORS.RED,
  },
  {
    value: "3",
    label: "Poll Workers per Polling Place",
    accessor: (d) =>
      d.poll_workers && d.polling_places
        ? d.poll_workers / d.polling_places
        : null,
    format: ".2f",
    color: COLORS.GREEN,
  },
  {
    value: "4",
    label: "Poll Workers per 1,000 Election Participants",
    accessor: (d) =>
      d.poll_workers && d.participants_in_jurisdictions_with_poll_worker_info
        ? (d.poll_workers /
            d.participants_in_jurisdictions_with_poll_worker_info) *
          1000
        : null,
    format: ".2f",
    color: COLORS.DARK_BLUE,
  },
  {
    value: "5",
    label: "Polling Places per 1,000 Election Participants",
    accessor: (d) =>
      d.polling_places &&
      d.participants_in_jurisdictions_with_polling_place_info
        ? (d.polling_places /
            d.participants_in_jurisdictions_with_polling_place_info) *
          1000
        : null,
    format: ".2f",
    color: COLORS.DARK_GREEN,
  },
  {
    value: "6",
    label: "Average Difficulty of Finding Poll Workers",
    accessor: (d) => {
      const {
        difficulty_very_difficult: d5,
        difficulty_somewhat_difficult: d4,
        difficulty_neither_difficult_nor_easy: d3,
        difficulty_somewhat_easy: d2,
        difficulty_very_easy: d1,
      } = d;
      const numCounts = d1 + d2 + d3 + d4 + d5;
      return numCounts > 0
        ? (1 * d1 + 2 * d2 + 3 * d3 + 4 * d4 + 5 * d5) / numCounts
        : null;
    },
    format: ".1f",
    color: COLORS.PURPLE,
  },
];
