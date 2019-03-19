import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { lighten } from "polished";
import { format } from "d3-format";
import withCaption from "hocs/withCaption";
import COLORS from "utils/styles";
import {
  NarrowContainer,
  LabeledSlider,
  SelectableHeatMap
} from "story_components";

class PureVotingMap extends Component {
  state = {
    currentYear: this.props.maxYear
  };

  handleSliderUpdate = (key, val) => {
    this.setState({ [key]: val });
  };

  render() {
    const { currentYear } = this.state;
    const { minYear, maxYear, data, selectOptions, step } = this.props;
    const currentYearData = data.filter(d => d.year === currentYear);
    return (
      <div>
        <LabeledSlider
          color={COLORS.DARK_GRAY}
          handleValueChange={this.handleSliderUpdate.bind(this, "currentYear")}
          max={maxYear}
          min={minYear}
          step={step}
          tickCount={Math.round((maxYear - minYear) / step) + 1}
          title={`Year: ${currentYear}`}
          value={currentYear}
        />
        <SelectableHeatMap
          selectOptions={selectOptions}
          data={currentYearData}
          getTooltipTitle={d => d.name}
          getTooltipBody={(d, { label, format: fm, accessor }) =>
            accessor(d) !== null
              ? `${label}: ${format(fm)(accessor(d))}`
              : "No data available."
          }
        />
      </div>
    );
  }
}

class VotingMap extends Component {
  cleanQuery = data => {
    return data.allVotingData20082016Csv.edges.map(({ node }) => {
      let nodeWithNumberValues = {};
      for (let key in node) {
        nodeWithNumberValues[key] = key === "state" ? node[key] : +node[key];
      }
      return nodeWithNumberValues;
    });
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => <PureVotingMap data={this.cleanQuery(data)} />}
      />
    );
  }
}

PureVotingMap.propTypes = {
  data: PropTypes.array.isRequired,
  maxYear: PropTypes.number.isRequired,
  minYear: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  selectOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.func.isRequired,
      format: PropTypes.string.isRequired,
      colors: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired
};

PureVotingMap.defaultProps = {
  data: [],
  maxYear: 2016,
  minYear: 2008,
  step: 2,
  selectOptions: [
    {
      value: "registrations",
      label: "Active Registered Voters",
      accessor: ({ values }) => values[0].active_registration || null,
      format: ",.0f",
      colors: [COLORS.WHITE, COLORS.ORANGE]
    },
    {
      value: "participants",
      label: "Election Participants",
      accessor: ({ values }) => values[0].election_participants || null,
      format: ",.0f",
      colors: [COLORS.WHITE, COLORS.GREEN]
    },
    {
      value: "eligible",
      label: "Eligble Voters (Estimated)",
      accessor: ({ values }) => values[0].eligible_voters_estimated || null,
      format: ",.0f",
      colors: [COLORS.WHITE, COLORS.DARK_GRAY]
    },
    {
      value: "participantsPerRegistration",
      label: "Participants per 100 Registered Voters",
      accessor: ({ values }) => {
        const {
          election_participants: ep,
          active_registration: ar
        } = values[0];
        return ep && ar ? (ep / ar) * 100 : null;
      },
      format: ".2f",
      colors: [COLORS.WHITE, COLORS.PURPLE]
    },
    {
      value: "registrationsPerEligible",
      label: "Registered Voters per 100 Eligible Voters",
      accessor: ({ values }) => {
        const {
          active_registration: ar,
          eligible_voters_estimated: ev
        } = values[0];
        return ar && ev ? (ar / ev) * 100 : null;
      },
      format: ".2f",
      colors: [COLORS.WHITE, COLORS.DARK_GREEN]
    },
    {
      value: "turnout",
      label: "Participants per 100 Eligible Voters",
      accessor: ({ values }) => {
        const {
          election_participants: ep,
          eligible_voters_estimated: ev
        } = values[0];
        return ep && ev ? (ep / ev) * 100 : null;
      },
      format: ".2f",
      colors: [COLORS.WHITE, COLORS.DARK_BLUE]
    },
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
  ]
};

const query = graphql`
  query VotingQuery {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          num_jurisdictions
          active_registration
          election_participants
          eligible_voters_estimated
          jurisdictions_with_polling_place_info
          jurisdictions_with_poll_worker_count
          jurisdictions_with_age_info
          jurisdictions_with_difficulty_info
          registrants_in_jurisdictions_with_polling_place_info
          registrants_in_jurisdictions_with_poll_worker_info
          registrants_in_jurisdictions_with_poll_worker_age_info
          registrants_in_jurisdictions_with_difficulty_info
          participants_in_jurisdictions_with_polling_place_info
          participants_in_jurisdictions_with_poll_worker_info
          participants_in_jurisdictions_with_poll_worker_age_info
          participants_in_jurisdictions_with_difficulty_info
          polling_places
          poll_workers
          worker_age_group_1
          worker_age_group_2
          worker_age_group_3
          worker_age_group_4
          worker_age_group_5
          worker_age_group_6
          difficulty_very_difficult
          difficulty_somewhat_difficult
          difficulty_somewhat_easy
          difficulty_neither_difficult_nor_easy
          difficulty_not_enough_information_to_answer
          difficulty_very_easy
        }
      }
    }
  }
`;

export default withCaption(VotingMap);

export { PureVotingMap };
