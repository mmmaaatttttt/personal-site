import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { format } from "d3-format";
import { withCaption, SliderProvider, SelectProvider } from "providers";
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

  handleSliderUpdate = val => {
    this.setState({ currentYear: val });
  };

  render() {
    const { currentYear } = this.state;
    const { minYear, maxYear, data, selectOptions, step } = this.props;
    const currentYearData = data.filter(d => d.year === currentYear);
    return (
      <NarrowContainer width="60%" fullWidthAt="medium">
        <LabeledSlider
          color={COLORS.DARK_GRAY}
          handleValueChange={this.handleSliderUpdate}
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
          getTooltipBody={(d, { label, format: fm, accessor }) => {
            return d.values && accessor(d) !== null
              ? `${label}: ${format(fm)(accessor(d))}`
              : "No data available."
          }
          }
        />
      </NarrowContainer>
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
        render={data => (
          <PureVotingMap data={this.cleanQuery(data)} {...this.props} />
        )}
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
      value: PropTypes.isRequired,
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
  selectOptions: []
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
