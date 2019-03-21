import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import withCaption from "hocs/withCaption";
import { Graph, LinePlot, StyledSelect } from "story_components";
import COLORS from "utils/styles";

class PureVotingLineChart extends Component {
  state = {
    selectedStateOption: this.props.selectOptionsForState[0],
    selectedStatisticOption: this.props.selectOptionsForStatistic[0]
  };

  handleChange(stateKey, propsKey, idx) {
    this.setState({ [stateKey]: this.props[propsKey][idx] });
  }

  render() {
    const { value: stateValue, label: stateLabel } = this.state.selectedStateOption;
    const { accessor } = this.state.selectedStatisticOption;
    const {
      data,
      height,
      selectOptionsForState,
      selectOptionsForStatistic,
      width
    } = this.props;
    const dataForStatAndState = data
      .filter(d => d.state === stateLabel && accessor(d) !== null)
      .map(d => ({ x: d.year, y: accessor(d) }));
    const xScale = scaleLinear()
      .domain(extent(dataForStatAndState, d => d.x))
      .range([0, width]);
    const yScale = scaleLinear()
      .domain(extent(dataForStatAndState, d => d.y))
      .range([height, 0]);
    console.log("D+S", data, stateValue, dataForStatAndState);
    return (
      <div>
        <h1>PureVotingLineChart</h1>
        {/* <StyledSelect
          value={value}
          onChange={this.handleChange}
          options={selectOptions}
          isSearchable={false}
          placeholder={label}
        /> */}
        <StyledSelect
          value={stateValue}
          onChange={obj => this.handleChange("selectedStateOption", "selectOptionsForState", obj.value)}
          options={selectOptionsForState}
          isSearchable
          placeholder={stateLabel}
        />
        <Graph
          width={width}
          height={height}
          svgPadding={0}
          // graphPadding={graphPadding}
          // svgId="bayesian-graph"
          xLabel="Coin flip distribution"
          xScale={xScale}
          yScale={yScale}
          // tickStep={() => 0.1}
          // tickFormatX=".0%"
        >
          <LinePlot
            graphData={dataForStatAndState}
            // stroke={color}
            xScale={xScale}
            yScale={yScale}
            curve="curveLinear"
          />
        </Graph>
      </div>
    );
  }
}

class VotingLineChart extends Component {
  cleanQuery = data => {
    return data.allVotingData20082016Csv.edges.map(({ node }) => {
      let nodeWithNumberValues = {};
      for (let key in node) {
        nodeWithNumberValues[key] = key === "state" ? node[key] : +node[key];
      }
      return nodeWithNumberValues;
    });
  };

  getStateOptions = data => {
    const statesSet = new Set(
      data.allVotingData20082016Csv.edges.map(({ node }) => node.state)
    );
    const options = Array.from(statesSet, (s, idx) => ({ label: s, value: idx }));
    return options;
  };

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => (
          <PureVotingLineChart
            data={this.cleanQuery(data)}
            selectOptionsForState={this.getStateOptions(data)}
          />
        )}
      />
    );
  }
}

PureVotingLineChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  selectOptionsForState: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.number.isRequired
    })
  ).isRequired,
  selectOptionsForStatistic: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      accessor: PropTypes.func.isRequired,
      format: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired
    })
  ).isRequired,
  width: PropTypes.number.isRequired
};

PureVotingLineChart.defaultProps = {
  data: [],
  height: 600,
  selectOptionsForState: [],
  selectOptionsForStatistic: [
    {
      value: "registrations",
      label: "Active Registered Voters",
      accessor: d => d.active_registration || null,
      format: ",.0f",
      color: COLORS.ORANGE
    }
  ],
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

export default withCaption(VotingLineChart);

export { PureVotingLineChart };
