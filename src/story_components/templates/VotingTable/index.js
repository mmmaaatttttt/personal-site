import React, { Component } from "react";
import PropTypes from "prop-types";
import { StaticQuery, graphql } from "gatsby";
import { groupBy } from "lodash";
import { format } from "d3-format";
import { Icon, StyledTable } from "story_components";
import { SliderProvider, withCaption } from "providers";
import { average } from "utils/mathHelpers";
import { sliderType } from "utils/types";
import COLORS from "utils/styles";

class PureVotingTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "averageTurnout",
      ascending: true
    };
    this.renderSortIcon = this.renderSortIcon.bind(this);
    this.handleSortClick = this.handleSortClick.bind(this);
  }

  renderSortIcon(key) {
    const { sortKey, ascending } = this.state;
    let color = COLORS.LIGHT_GRAY;
    let name = "sort-up";
    if (sortKey === key) {
      color = COLORS.GREEN;
      if (!ascending) {
        name = "sort-down";
      }
    }
    return (
      <Icon name={name} color={color} onClick={() => this.handleSortClick(key)} hover />
    );
  }

  handleSortClick(newKey) {
    return this.setState(({ sortKey, ascending }) => {
      let newState = { sortKey: newKey, ascending: true };
      if (newKey === sortKey) {
        newState.ascending = !ascending;
      }
      return newState;
    });
  }

  render() {
    const { sortKey, ascending } = this.state;
    const { tableData, initialSliderData } = this.props;
    const sortedData = [...tableData].sort((state1, state2) => {
      const val1 = state1[sortKey];
      const val2 = state2[sortKey];
      const positiveIfAscending = +ascending - 0.5;
      if (val1 > val2) return positiveIfAscending;
      if (val1 < val2) return -positiveIfAscending;
      return 0;
    });
    return (
      <SliderProvider
        initialData={initialSliderData}
        render={([numRows]) => {
          return (
            <StyledTable>
              <thead>
                <tr>
                  <th>
                    State {this.renderSortIcon("state")}
                  </th>
                  <th>
                    Average Saturation {this.renderSortIcon("averageSaturation")}
                  </th>
                  <th>
                    Average Turnout {this.renderSortIcon("averageTurnout")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.slice(0, numRows).map(d => (
                  <tr key={d.state}>
                    <td>{d.state}</td>
                    <td>{format(".2%")(d.averageSaturation)}</td>
                    <td>{format(".2%")(d.averageTurnout)}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          );
        }}
      />
    );
  }
}

class VotingTable extends Component {
  aggregate(data) {
    const cleanedData = data.allVotingData20082016Csv.edges.map(({ node }) => ({
      year: +node.year,
      state: node.state,
      active_registration: +node.active_registration,
      election_participants: +node.election_participants,
      eligible_voters_estimated: +node.eligible_voters_estimated
    }));
    const dataByState = groupBy(cleanedData, d => d.state);
    return Object.keys(dataByState).map(state => {
      const stateData = dataByState[state];
      const saturationPerElection = stateData
        .map(d => d.active_registration / d.eligible_voters_estimated)
        .filter(num => num !== 0);
      const turnoutPerElection = stateData
        .map(d => d.election_participants / d.eligible_voters_estimated)
        .filter(num => num !== 0);
      return {
        state,
        averageSaturation: average(saturationPerElection),
        averageTurnout: average(turnoutPerElection)
      };
    });
  }

  render() {
    return (
      <StaticQuery
        query={query}
        render={data => {
          const tableData = this.aggregate(data);
          const initialSliderData = [
            {
              min: 5,
              max: tableData.length,
              initialValue: 5,
              step: 1,
              title: val => `Showing data on ${val} states.`,
              color: COLORS.DARK_GRAY
            }
          ];
          return (
            <PureVotingTable
              tableData={this.aggregate(data)}
              initialSliderData={initialSliderData}
            />
          );
        }}
      />
    );
  }
}

const query = graphql`
  query {
    allVotingData20082016Csv {
      edges {
        node {
          year
          state
          active_registration
          election_participants
          eligible_voters_estimated
        }
      }
    }
  }
`;

PureVotingTable.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      state: PropTypes.string.isRequired,
      averageSaturation: PropTypes.number.isRequired,
      averageTurnout: PropTypes.number.isRequired
    })
  ).isRequired,
  initialSliderData: sliderType
};

PureVotingTable.defaultProps = {
  tableData: [],
  initialSliderData: []
};

export default withCaption(VotingTable);
