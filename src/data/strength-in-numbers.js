import { lighten } from "polished";
import COLORS from "utils/styles";

const lineOptionsForVoters = [
  {
    value: 0,
    label: "Active Registered Voters",
    accessor: d => d.active_registration || null,
    format: ".3s",
    color: COLORS.ORANGE
  },
  {
    value: 1,
    label: "Election Participants",
    accessor: d => d.election_participants || null,
    format: ".3s",
    color: COLORS.GREEN
  },
  {
    value: 2,
    label: "Eligible Voters",
    accessor: d => d.eligible_voters_estimated || null,
    format: ".3s",
    color: COLORS.DARK_BLUE
  },
  {
    value: 3,
    label: "Registration Saturation",
    accessor: ({ active_registration: ar, eligible_voters_estimated: ev }) =>
      ar && ev ? ar / ev : null,
    format: ".2%",
    color: COLORS.PURPLE
  },
  {
    value: 4,
    label: "Election Turnout",
    accessor: ({ election_participants: ep, eligible_voters_estimated: ev }) =>
      ep && ev ? ep / ev : null,
    format: ".2%",
    color: COLORS.MAROON
  }
];

const mapOptionsForVoters = lineOptionsForVoters.map(opt => ({
  value: opt.value,
  label: opt.label,
  accessor: ({ values }) => opt.accessor(values[0]),
  format: opt.format === ".3s" ? ",.0f" : opt.format,
  colors: [lighten(0.4, opt.color), opt.color]
}));

const mapOptionsForWorkers = [
  {
    value: "pollWorkers",
    label: "Poll Workers",
    accessor: ({ values }) => values[0].poll_workers || null,
    format: ",.0f",
    colors: [COLORS.WHITE, COLORS.ORANGE]
  },
  {
    value: "pollingPlaces",
    label: "Polling Places",
    accessor: ({ values }) => values[0].polling_places || null,
    format: ",.0f",
    colors: [COLORS.WHITE, COLORS.RED]
  },
  {
    value: "workersPerPlace",
    label: "Poll Workers per Polling Place",
    accessor: ({ values }) => {
      const { poll_workers: pw, polling_places: pp } = values[0];
      return pw && pp ? pw / pp : null;
    },
    format: ".2f",
    colors: [COLORS.WHITE, COLORS.GREEN]
  },
  {
    value: "workersPerParticipant",
    label: "Poll Workers per 1,000 Election Participants",
    accessor: ({ values }) => {
      const {
        poll_workers: pw,
        participants_in_jurisdictions_with_poll_worker_info: ep
      } = values[0];
      return pw && ep ? (pw / ep) * 1000 : null;
    },
    format: ".2f",
    colors: [COLORS.WHITE, COLORS.DARK_BLUE]
  },
  {
    value: "placesPerParticipant",
    label: "Polling places per 1,000 Election Participants",
    accessor: ({ values }) => {
      const {
        polling_places: pp,
        participants_in_jurisdictions_with_polling_place_info: ep
      } = values[0];
      return pp && ep ? (pp / ep) * 1000 : null;
    },
    format: ".2f",
    colors: [COLORS.WHITE, COLORS.DARK_GREEN]
  },
  {
    value: "difficulty",
    label: "Average Difficulty of Finding Poll Workers",
    accessor: ({ values }) => {
      const {
        difficulty_very_difficult: d5,
        difficulty_somewhat_difficult: d4,
        difficulty_neither_difficult_nor_easy: d3,
        difficulty_somewhat_easy: d2,
        difficulty_very_easy: d1
      } = values[0];
      let numCounts = d1 + d2 + d3 + d4 + d5;
      let totalDifficulty = 1 * d1 + 2 * d2 + 3 * d3 + 4 * d4 + 5 * d5;
      return numCounts > 0 ? totalDifficulty / numCounts : null;
    },
    format: ".2f",
    colors: [COLORS.WHITE, COLORS.PURPLE]
  }
];

const lineOptionsForWorkers = [
  {
    value: 6,
    label: "Poll Workers",
    accessor: d => d.poll_workers || null,
    format: ",.0f",
    color: COLORS.ORANGE
  },
  {
    value: 7,
    label: "Polling Places",
    accessor: d => d.polling_places || null,
    format: ".3s",
    color: COLORS.RED
  },
  {
    value: 8,
    label: "Poll Workers per Polling Place",
    accessor: ({ poll_workers, polling_places }) =>
      poll_workers && polling_places ? poll_workers / polling_places : null,
    format: ".2f",
    color: COLORS.GREEN
  },
  {
    value: 9,
    label: "Poll Workers per 1,000 Election Participants",
    accessor: ({
      poll_workers,
      participants_in_jurisdictions_with_poll_worker_info
    }) =>
      poll_workers && participants_in_jurisdictions_with_poll_worker_info
        ? (poll_workers / participants_in_jurisdictions_with_poll_worker_info) *
          1000
        : null,
    format: ".2f",
    color: COLORS.DARK_BLUE
  },
  {
    value: 10,
    label: "Polling places per 1,000 Election Participants",
    accessor: ({
      polling_places,
      participants_in_jurisdictions_with_polling_place_info
    }) =>
      polling_places && participants_in_jurisdictions_with_polling_place_info
        ? (polling_places /
            participants_in_jurisdictions_with_polling_place_info) *
          1000
        : null,
    format: ".2f",
    color: COLORS.DARK_GREEN
  },
  {
    value: 11,
    label: "Average Difficulty of Finding Poll Workers",
    accessor: d => {
      const {
        difficulty_very_difficult: d5,
        difficulty_somewhat_difficult: d4,
        difficulty_neither_difficult_nor_easy: d3,
        difficulty_somewhat_easy: d2,
        difficulty_very_easy: d1
      } = d;
      let numCounts = d1 + d2 + d3 + d4 + d5;
      let totalDifficulty = 1 * d1 + 2 * d2 + 3 * d3 + 4 * d4 + 5 * d5;
      return numCounts > 0 ? totalDifficulty / numCounts : null;
    },
    format: ".2f",
    color: COLORS.PURPLE
  }
];

export { lineOptionsForVoters, mapOptionsForVoters, mapOptionsForWorkers };
