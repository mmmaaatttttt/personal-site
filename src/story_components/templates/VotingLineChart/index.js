import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { extent } from "d3-array";
import { scaleLinear } from "d3-scale";
import Animate from "react-move/Animate";
import { withCaption } from "providers";
import { Graph, LinePlot } from "story_components";
import { SelectProvider } from "providers";
import { selectType } from "utils/types";
import COLORS from "utils/styles";

class PureVotingLineChart extends Component {
  render() {
    const {
      data,
      graphPadding,
      height,
      selectOptions,
      svgId,
      width
    } = this.props;
    const years = Array.from(new Set(data.map(d => d.year))).sort(
      (a, b) => a - b
    );
    return (
      <SelectProvider
        fullWidthAt="medium"
        options={selectOptions}
        render={([statisticOption, stateOption]) => {
          const { label: stateLabel } = stateOption;
          const {
            accessor,
            colors,
            format,
            label: statisticLabel
          } = statisticOption;
          const dataForStatAndState = data
            .filter(d => d.state === stateLabel && accessor(d) !== null)
            .map(d => ({ x: d.year, y: accessor(d) }))
            .filter(d => d.y);
          const color = colors[0];
          if (dataForStatAndState.length === 0) return (
            <React.Fragment>
              <p/>
              <h4>{statisticLabel} data not available in {stateLabel}.</h4>
              <p>Please explore a different option.</p>
            </React.Fragment>
          )
          return (
            <Animate
              start={{
                color: COLORS.BLACK,
                yearData: years.map(year => ({ x: year, y: 0 }))
              }}
              enter={{ yearData: [dataForStatAndState], color }}
              update={{ yearData: [dataForStatAndState], color }}
            >
              {({ yearData, color }) => {
                const xScale = scaleLinear()
                  .domain(extent(years))
                  .range([graphPadding.left, width - graphPadding.right]);
                const yScale = scaleLinear()
                  .domain(extent(yearData, d => d.y))
                  .range([height - graphPadding.bottom, graphPadding.top]);
                return (
                  <Graph
                    width={width}
                    height={height}
                    svgPadding={0}
                    graphPadding={graphPadding}
                    svgId={svgId}
                    xLabel="Year"
                    xScale={xScale}
                    yScale={yScale}
                    yLabel={statisticLabel}
                    yLabelOffset={40}
                    tickFormatX=".0f"
                    tickFormatY={format}
                  >
                    <LinePlot
                      graphData={yearData}
                      stroke={color}
                      xScale={xScale}
                      yScale={yScale}
                      curve="curveLinear"
                    />
                    {yearData.map(d => (
                      <circle cx={xScale(d.x)} cy={yScale(d.y)} r={10} fill={color} key={d.x} />
                    ))}
                  </Graph>
                );
              }}
            </Animate>
          );
        }}
      />
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
        render={data => {
          const { selectOptionsForStatistic, ...otherProps } = this.props;
          return (
            <PureVotingLineChart
              data={this.cleanQuery(data)}
              selectOptions={[
                selectOptionsForStatistic,
                this.getStateOptions(data)
              ]}
              {...otherProps}
            />
          );
        }}
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
  selectOptions: selectType,
  svgId: PropTypes.string.isRequired,
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
  selectOptions: [],
  svgId: "state-line-graph",
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
