import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { max } from "d3-array";
import { scaleLinear } from "d3-scale";
import withCaption from "hocs/withCaption";
import { StackedBarGraph, StyledSelect } from "story_components";
import COLORS from "utils/styles";
import { total } from "utils/mathHelpers";

class PureVotingPollWorkerAge extends Component {
  state = {
    selectedStateOption: this.props.selectOptionsForState[0]
  };

  handleChange = obj => {
    this.setState({
      selectedStateOption: this.props.selectOptionsForState[obj.value]
    });
  };

  render() {
    const {
      label: stateLabel,
      value: stateValue
    } = this.state.selectedStateOption;
    const {
      data,
      graphPadding,
      height,
      selectOptionsForState,
      width
    } = this.props;
    const barData = data
      .filter(d => d.state === stateLabel)
      .map(d => ({ key: d.year, heights: d.ages }));
    const yScale = scaleLinear()
      .domain([0, max(barData, d => total(d.heights))])
      .range([height - graphPadding.bottom, graphPadding.top]);
    return (
      <div>
        <StyledSelect
          value={stateValue}
          onChange={this.handleChange}
          options={selectOptionsForState}
          isSearchable
          placeholder={stateLabel}
        />
        <StackedBarGraph
          svgId='poll-worker-ages'
          width={width}
          height={height}
          padding={graphPadding}
          barData={barData}
          yScale={yScale}
          colors={[
            COLORS.RED,
            COLORS.BLUE,
            COLORS.GREEN,
            COLORS.ORANGE,
            COLORS.PURPLE,
            COLORS.DARK_GREEN
          ]}
          tickStep={100}
          // barLabel={bar => bar.key + 1}
        />
      </div>
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
  graphPadding: PropTypes.shape({
    top: PropTypes.number.isRequired,
    bottom: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    right: PropTypes.number.isRequired
  }).isRequired,
  height: PropTypes.number.isRequired,
  selectOptionsForState: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  width: PropTypes.number.isRequired
};

PureVotingPollWorkerAge.defaultProps = {
  data: [],
  height: 600,
  graphPadding: {
    top: 20,
    bottom: 100,
    left: 100,
    right: 20
  },
  selectOptionsForState: [],
  width: 900
};

const query = graphql`
  query {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          num_jurisdictions
          active_registration
          election_participants
          eligible_voters_estimated
          jurisdictions_with_poll_worker_count
          jurisdictions_with_age_info
          registrants_in_jurisdictions_with_poll_worker_info
          registrants_in_jurisdictions_with_poll_worker_age_info
          participants_in_jurisdictions_with_poll_worker_info
          participants_in_jurisdictions_with_poll_worker_age_info
          poll_workers
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
