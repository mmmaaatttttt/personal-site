import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import { withCaption } from "containers";
import { Graph, LinePlot, NarrowContainer, StyledSelect } from "story_components";

class PureVotingLineChart extends Component {
  state = {
    selectedStateOption: this.props.selectOptionsForState[0],
    selectedStatisticOption: this.props.selectOptionsForStatistic[0]
  };

  handleChange(stateKey, propsKey, idx) {
    this.setState({ [stateKey]: this.props[propsKey][idx] });
  }

  render() {
    const {
      label: stateLabel,
      value: stateValue
    } = this.state.selectedStateOption;
    const {
      accessor,
      color,
      format,
      label: statisticLabel,
      value: statisticValue
    } = this.state.selectedStatisticOption;
    const {
      data,
      graphPadding,
      height,
      selectOptionsForState,
      selectOptionsForStatistic,
      width
    } = this.props;
    debugger;
    const dataForStatAndState = data
      .filter(d => d.state === stateLabel && accessor(d) !== null)
      .map(d => ({ x: d.year, y: accessor(d) }));
    const xScale = scaleLinear()
      .domain(extent(dataForStatAndState, d => d.x))
      .range([graphPadding.left, width - graphPadding.right]);
    const yScale = scaleLinear()
      .domain(extent(dataForStatAndState, d => d.y))
      .range([height - graphPadding.bottom, graphPadding.top]);
    return (
      <NarrowContainer width="60%" fullWidthAt="medium">
        <StyledSelect
          value={statisticValue}
          onChange={obj =>
            this.handleChange(
              "selectedStatisticOption",
              "selectOptionsForStatistic",
              obj.value
            )
          }
          options={selectOptionsForStatistic}
          isSearchable
          placeholder={statisticLabel}
        />
        <StyledSelect
          value={stateValue}
          onChange={obj =>
            this.handleChange(
              "selectedStateOption",
              "selectOptionsForState",
              obj.value
            )
          }
          options={selectOptionsForState}
          isSearchable
          placeholder={stateLabel}
        />
        <Graph
          width={width}
          height={height}
          svgPadding={0}
          graphPadding={graphPadding}
          svgId="state-line-graph"
          xLabel="Year"
          xScale={xScale}
          yScale={yScale}
          yLabel={statisticLabel}
          yLabelOffset={40}
          tickFormatX=".0f"
          tickFormatY={format}
        >
          <LinePlot
            graphData={dataForStatAndState}
            stroke={color}
            xScale={xScale}
            yScale={yScale}
            curve="curveLinear"
          />
        </Graph>
      </NarrowContainer>
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
          <PureVotingLineChart
            data={this.cleanQuery(data)}
            selectOptionsForState={this.getStateOptions(data)}
            {...this.props}
          />
        )}
      />
    );
  }
}

PureVotingLineChart.propTypes = {
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
  selectOptionsForStatistic: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number.isRequired,
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
  graphPadding: {
    top: 20,
    bottom: 100,
    left: 100,
    right: 20
  },
  selectOptionsForState: [],
  selectOptionsForStatistic: [],
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
