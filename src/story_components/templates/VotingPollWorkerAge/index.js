import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import { withCaption } from "providers";
import { LabeledSlider, NarrowContainer, SelectablePieChart } from "story_components";
import COLORS from "utils/styles";
import { total } from "utils/mathHelpers";

class PureVotingPollWorkerAge extends Component {
  state = {
    currentYear: this.props.maxYear
  };

  handleSliderUpdate = val => {
    this.setState({ currentYear: val });
  };

  // need something like this for state options
  // getStateOptions = data => {
  //   const statesSet = new Set(
  //     data.allVotingData20082016Csv.edges.map(({ node }) => node.state)
  //   );
  //   const options = Array.from(statesSet, (s, idx) => ({
  //     label: s,
  //     value: idx
  //   }));
  //   return options;
  // };

  render() {
    const { currentYear } = this.state;
    const { minYear, maxYear, data, selectOptionsForState, step } = this.props;
    const currentYearData = data.filter(d => d.year === currentYear);
    debugger;
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
        {/* <SelectablePieChart
          data={}
          selectOptions={}
          graphOptions={}
        /> */}
        {/* <StyledSelect
          value={stateValue}
          onChange={this.handleChange}
          options={selectOptionsForState}
          isSearchable
          placeholder={stateLabel}
        /> */}
      </NarrowContainer>
    );
  }
}

class VotingPollWorkerAge extends Component {
  cleanQuery = data => {
    return data.allVotingData20082016Csv.edges.map(({ node }) => ({
      year: +node.year,
      state: node.state,
      num_jurisdictions: +node.num_jurisdictions,
      jurisdictions_with_age_info: +node.jurisdictions_with_age_info,
      poll_workers: +node.poll_workers,
      ages: [
        +node.worker_age_group_1,
        +node.worker_age_group_2,
        +node.worker_age_group_3,
        +node.worker_age_group_4,
        +node.worker_age_group_5,
        +node.worker_age_group_6
      ]
    }));
  };

  getStateOptions = data => {
    const statesSet = new Set(
      data.allVotingData20082016Csv.edges.map(({ node }) => node.state)
    );
    const options = Array.from(statesSet, (s, idx) => ({
      label: s,
      value: idx
    }));
    return options;
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <PureVotingPollWorkerAge
            data={this.cleanQuery(data)}
            selectOptionsForState={this.getStateOptions(data)}
          />
        )}
      />
    );
  }
}

PureVotingPollWorkerAge.propTypes = {
  data: PropTypes.array.isRequired,
  maxYear: PropTypes.number.isRequired,
  minYear: PropTypes.number.isRequired,
  selectOptionsForState: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.isRequired,
    label: PropTypes.string.isRequired,
    chartValues: PropTypes.func.isRequired
  })).isRequired,
  step: PropTypes.number.isRequired
  // data: PropTypes.array.isRequired,
  // graphPadding: PropTypes.shape({
  //   top: PropTypes.number.isRequired,
  //   bottom: PropTypes.number.isRequired,
  //   left: PropTypes.number.isRequired,
  //   right: PropTypes.number.isRequired
  // }).isRequired,
  // height: PropTypes.number.isRequired,
  // selectOptionsForState: PropTypes.arrayOf(
  //   PropTypes.shape({
  //     value: PropTypes.number.isRequired,
  //     label: PropTypes.string.isRequired
  //   })
  // ).isRequired,
  // width: PropTypes.number.isRequired
};

PureVotingPollWorkerAge.defaultProps = {
  data: [],
  maxYear: 2016,
  minYear: 2010,
  selectOptionsForState: [],
  step: 2
  // data: [],
  // height: 600,
  // graphPadding: {
  //   top: 20,
  //   bottom: 100,
  //   left: 100,
  //   right: 20
  // },
  // selectOptionsForState: [],
  // width: 900
};

const query = graphql`
  query {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          worker_age_group_1
          worker_age_group_2
          worker_age_group_3
          worker_age_group_4
          worker_age_group_5
          worker_age_group_6
        }
      }
    }
  }
`;

export default withCaption(VotingPollWorkerAge);

export { PureVotingPollWorkerAge };
