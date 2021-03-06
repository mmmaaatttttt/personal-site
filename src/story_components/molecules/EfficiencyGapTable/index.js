import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import COLORS from "utils/styles";
import { total, calculateWastedVotes } from "utils/mathHelpers";
import { ColoredSpan, StyledTable } from "story_components";

const StyledBaseTable = styled(StyledTable)`
  td:first-child {
    font-weight: bold;
  }

  td:nth-child(2),
  th:nth-child(2) {
    color: ${COLORS.DARK_BLUE};
  }

  td:last-child,
  th:last-child {
    color: ${COLORS.RED};
  }

  tr:last-child td {
    color: ${COLORS.BLACK};
  }
`;

class EfficiencyGapTable extends Component {
  calculateTotalWastedVotes = wastedVotes => {
    return wastedVotes.reduce(
      (totals, cur) => {
        totals[0] += cur[0];
        totals[1] += cur[1];
        return totals;
      },
      [0, 0]
    );
  };

  calculateTotalVotes = (votes, party1Accessor, party2Accessor) => {
    return total(votes, num => party1Accessor(num) + party2Accessor(num));
  };

  calculateEfficiencyGap = (totalWasted, totalVotes) => {
    return (totalWasted[0] - totalWasted[1]) / totalVotes;
  };

  render() {
    const { districtCounts } = this.props;
    let tableArea = (
      <p>
        <b>
          To see a sample calculation of the efficiency gap, please finish
          drawing your districts above.
        </b>
      </p>
    );
    if (districtCounts) {
      let blueAcc = d => d[0];
      let redAcc = d => d[1];
      let wastedVotes = calculateWastedVotes(
        districtCounts,
        blueAcc,
        redAcc
      );
      let totalWastedVotes = this.calculateTotalWastedVotes(wastedVotes);
      let totalVotes = this.calculateTotalVotes(
        districtCounts,
        blueAcc,
        redAcc
      );
      let eg = this.calculateEfficiencyGap(totalWastedVotes, totalVotes);
      let gapCopyEnd = "";
      if (totalWastedVotes[0] !== totalWastedVotes[1]) {
        let favoredColor = eg < 0 ? "blue" : "red";
        gapCopyEnd = ` in favor of ${favoredColor}`;
      }
      let gapCopy = (
        <div>
          (
          <ColoredSpan color={COLORS.DARK_BLUE}>
            {totalWastedVotes[0]}
          </ColoredSpan>{" "}
          &ndash;{" "}
          <ColoredSpan color={COLORS.RED}>{totalWastedVotes[1]}</ColoredSpan>)
          &divide; {totalVotes} = {(Math.abs(eg) * 100).toFixed(2)}%{gapCopyEnd}
          .
        </div>
      );
      tableArea = (
        <div>
          <p>
            Here's a sample efficiency gap calculation based on the districts
            you created above.
          </p>
          <StyledBaseTable>
            <thead>
              <tr>
                <th>District</th>
                <th>Wasted Votes</th>
                <th>Wasted Votes</th>
              </tr>
            </thead>
            <tbody>
              {wastedVotes.map((overvotes, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{overvotes[0]}</td>
                  <td>{overvotes[1]}</td>
                </tr>
              ))}
              <tr>
                <td>Total</td>
                <td>{totalWastedVotes[0]}</td>
                <td>{totalWastedVotes[1]}</td>
              </tr>
              <tr>
                <td>Efficiency Gap</td>
                <td colSpan="2">{gapCopy}</td>
              </tr>
            </tbody>
          </StyledBaseTable>
        </div>
      );
    }
    return tableArea;
  }
}

function mapStateToProps(state) {
  return {
    districtCounts: state["mind-the-gerrymandered-gap"].districtCounts
  };
}

EfficiencyGapTable.propTypes = {
  districtCounts: PropTypes.array
};

EfficiencyGapTable.defaultProps = {
  districtCounts: null
};

export default connect(mapStateToProps)(EfficiencyGapTable);

export { EfficiencyGapTable };
