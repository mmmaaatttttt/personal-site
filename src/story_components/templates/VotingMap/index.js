import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { format } from "d3-format";
import { extent } from "d3-array";
import { withCaption, SliderProvider, SelectProvider } from "providers";
import COLORS from "utils/styles";
import { USMap } from "story_components";
import { selectType, sliderDataType } from "utils/types";
class PureVotingMap extends Component {
  getTooltipBody(option, year) {
    const { label, format: fm, accessor } = option;
    return properties => {
      if (properties.values) {
        const dataObj = this.getObjFromYear(properties, year);
        const val = accessor(dataObj);
        if (val !== null) return `${label}: ${format(fm)(val)}`
      }
      return "No data available";
    }
  }

  getTooltipTitle(d) {
    return d.name;
  }

  getObjFromYear(dataByYear, year) {
    return dataByYear.values.find(obj => obj.year === year) || {}
  }

  render() {
    const { data, initialSliderData, selectOptions } = this.props;
    return (
      <SliderProvider
        fullWidthAt="medium"
        initialData={initialSliderData}
        render={sliderVals => (
          <SelectProvider
            width="100%"
            options={selectOptions}
            render={currentOptions => {
              const currentYear = sliderVals[0];
              const { colors, accessor } = currentOptions[0];
              const domain = extent(data, accessor);
              const fillAccessor = stateArr => {
                return accessor(this.getObjFromYear(stateArr, currentYear));
              }
              return (
                <USMap
                  colors={colors}
                  data={data}
                  domain={domain}
                  fillAccessor={fillAccessor}
                  getTooltipTitle={this.getTooltipTitle}
                  getTooltipBody={this.getTooltipBody(currentOptions[0], currentYear)}
                />
              );
            }}
          />
        )}
      />
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
  initialSliderData: sliderDataType,
  selectOptions: selectType
};

const MIN_YEAR = 2008;
const MAX_YEAR = 2016;
const STEP = 2;

PureVotingMap.defaultProps = {
  data: [],
  initialSliderData: [
    {
      min: MIN_YEAR,
      max: MAX_YEAR,
      step: STEP,
      initialValue: MAX_YEAR,
      color: COLORS.DARK_GRAY,
      tickCount: Math.round((MAX_YEAR - MIN_YEAR) / STEP) + 1,
      title: year => `Year: ${year}`
    }
  ],
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
