import { lighten } from "polished";
import { total } from "utils/mathHelpers";
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
    format: ".0%",
    colors: [COLORS.PURPLE]
  },
  {
    value: 4,
    label: "Election Turnout",
    accessor: ({ election_participants: ep, eligible_voters_estimated: ev }) =>
      ep && ev ? ep / ev : null,
    format: ".0%",
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
    format: ".1f",
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
  return data.allVotingData20082016Csv.edges.map(({ node }) => ({
    year: +node.year,
    abbreviation: node.abbreviation,
    election_participants: +node.election_participants,
    active_registration: +node.active_registration,
    eligible_voters_estimated: +node.eligible_voters_estimated
  }));
};

const dataCleanerForSecondBarGraph = data => {
  return data.allVotingData20082016Csv.edges.map(({ node }) => ({
    year: +node.year,
    abbreviation: node.abbreviation,
    election_participants: +node.election_participants,
    active_registration: +node.active_registration,
    eligible_voters_estimated: +node.eligible_voters_estimated,
    poll_workers: +node.poll_workers,
    polling_places: +node.polling_places,
    participants_in_jurisdictions_with_poll_worker_info: +node.participants_in_jurisdictions_with_poll_worker_info,
    participants_in_jurisdictions_with_polling_place_info: +node.participants_in_jurisdictions_with_polling_place_info,
    difficulty_very_difficult: +node.difficulty_very_difficult,
    difficulty_somewhat_difficult: +node.difficulty_somewhat_difficult,
    difficulty_neither_difficult_nor_easy: +node.difficulty_neither_difficult_nor_easy,
    difficulty_somewhat_easy: +node.difficulty_somewhat_easy,
    difficulty_very_easy: +node.difficulty_very_easy,
    ages: [
      +node.worker_age_group_1,
      +node.worker_age_group_2,
      +node.worker_age_group_3,
      +node.worker_age_group_4,
      +node.worker_age_group_5,
      +node.worker_age_group_6
    ],
    dem_percent: +node.dem_percent,
    rep_percent: +node.rep_percent
  }));
};

const selectDataForSecondBarGraph = [
  {
    label: "Most Democratic States",
    accessor: d => d.dem_percent,
    format: ".0f"
  },
  {
    label: "Most Republican States",
    accessor: d => d.rep_percent,
    format: ".0f"
  },
  ...lineOptionsForVoters
    .slice(-2)
    .map(d => ({ ...d, format: d.format.replace("2", "0") })),
  ...lineOptionsForWorkers
    .slice(-4)
    .map(d => ({ ...d, format: d.format.replace("2", "0") })),
  {
    label: "Percentage of Reported Poll workers under 18",
    accessor: _ageGroupHelper(0),
    format: ".0%"
  },
  {
    label: "Percentage of Reported Poll workers between 18 and 25",
    accessor: _ageGroupHelper(1),
    format: ".0%"
  },
  {
    label: "Percentage of Reported Poll workers between 26 and 40",
    accessor: _ageGroupHelper(2),
    format: ".0%"
  },
  {
    label: "Percentage of Reported Poll workers between 41 and 60",
    accessor: _ageGroupHelper(3),
    format: ".0%"
  },
  {
    label: "Percentage of Reported Poll workers between 61 and 70",
    accessor: _ageGroupHelper(4),
    format: ".0%"
  },
  {
    label: "Percentage of Reported Poll workers over 70",
    accessor: _ageGroupHelper(5),
    format: ".0%"
  },
  {
    label: "Percentage of voters who don't identify with either party",
    accessor: d => 1 - (d.dem_percent + d.rep_percent) / 100,
    format: ".0%"
  }
].map((obj, idx) => ({ ...obj, value: idx }));

function _ageGroupHelper(idx) {
  return d => d.ages[idx] / total(d.ages);
}

export {
  dataCleanerForFirstBarGraph,
  dataCleanerForSecondBarGraph,
  lineOptionsForVoters,
  lineOptionsForWorkers,
  mapOptionsForVoters,
  mapOptionsForWorkers,
  selectDataForSecondBarGraph
};
