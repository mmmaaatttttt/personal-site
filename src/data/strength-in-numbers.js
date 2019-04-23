import { lighten } from "polished";
import COLORS from "utils/styles";

const lineOptionsForVoters = [
  {
    value: 0,
    label: "Active Registered Voters",
    accessor: d => d.active_registration || null,
    format: ".3s",
    colors: [COLORS.ORANGE]
  },
  {
    value: 1,
    label: "Election Participants",
    accessor: d => d.election_participants || null,
    format: ".3s",
    colors: [COLORS.GREEN]
  },
  {
    value: 2,
    label: "Eligible Voters",
    accessor: d => d.eligible_voters_estimated || null,
    format: ".3s",
    colors: [COLORS.DARK_BLUE]
  },
  {
    value: 3,
    label: "Registration Saturation",
    accessor: ({ active_registration: ar, eligible_voters_estimated: ev }) =>
      ar && ev ? ar / ev : null,
    format: ".2%",
    colors: [COLORS.PURPLE]
  },
  {
    value: 4,
    label: "Election Turnout",
    accessor: ({ election_participants: ep, eligible_voters_estimated: ev }) =>
      ep && ev ? ep / ev : null,
    format: ".2%",
    colors: [COLORS.MAROON]
  }
];

const mapOptionsForVoters = [
  lineOptionsForVoters.map(opt => ({
    value: opt.value,
    label: opt.label,
    accessor: opt.accessor,
    format: opt.format === ".3s" ? ",.0f" : opt.format,
    colors: [lighten(0.4, opt.colors[0]), opt.colors[0]]
  }))
];

const lineOptionsForWorkers = [
  {
    value: 0,
    label: "% of Jurisdictions Reporting",
    accessor: ({
      num_jurisdictions: n,
      jurisdictions_with_poll_worker_count: j
    }) => j / n,
    format: ".2%",
    colors: [COLORS.MAROON]
  },
  {
    value: 1,
    label: "Poll Workers",
    accessor: d => d.poll_workers || null,
    format: ",.0f",
    colors: [COLORS.ORANGE]
  },
  {
    value: 2,
    label: "Polling Places",
    accessor: d => d.polling_places || null,
    format: ",.0f",
    colors: [COLORS.RED]
  },
  {
    value: 3,
    label: "Poll Workers per Polling Place",
    accessor: ({ poll_workers: pw, polling_places: pp }) =>
      pw && pp ? pw / pp : null,
    format: ".2f",
    colors: [COLORS.GREEN]
  },
  {
    value: 4,
    label: "Poll Workers per 1,000 Election Participants",
    accessor: ({
      poll_workers: pw,
      participants_in_jurisdictions_with_poll_worker_info: pj
    }) => (pw && pj ? (pw / pj) * 1000 : null),
    format: ".2f",
    colors: [COLORS.DARK_BLUE]
  },
  {
    value: 5,
    label: "Polling places per 1,000 Election Participants",
    accessor: ({
      polling_places: pp,
      participants_in_jurisdictions_with_polling_place_info: pj
    }) => (pp && pj ? (pp / pj) * 1000 : null),
    format: ".2f",
    colors: [COLORS.DARK_GREEN]
  },
  {
    value: 6,
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
    colors: [COLORS.PURPLE]
  }
];

const mapOptionsForWorkers = [
  lineOptionsForWorkers.map(opt => ({
    value: opt.value,
    label: opt.label,
    accessor: opt.accessor,
    format: opt.format,
    colors: [lighten(0.4, opt.colors[0]), opt.colors[0]]
  }))
];

const dataCleanerForFirstBarGraph = data => {
  return data.allVotingData20082016Csv.edges.map(({node}) => ({
    year: +node.year,
    abbreviation: node.abbreviation,
    election_participants: +node.election_participants,
    active_registration: +node.active_registration,
    eligible_voters_estimated: +node.eligible_voters_estimated
  }));
}

export {
  dataCleanerForFirstBarGraph,
  lineOptionsForVoters,
  lineOptionsForWorkers,
  mapOptionsForVoters,
  mapOptionsForWorkers
};
