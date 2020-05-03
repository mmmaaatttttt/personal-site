import React, { useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import COLORS from "utils/styles";
import { calculateWastedVotes } from "utils/mathHelpers";
import { ColoredSpan, StyledTable } from "story_components";
import {
  calculateTotalWastedVotes,
  calculateTotalVotes,
  calculateEfficiencyGap
} from "./helpers";
import { BlogPostContext } from "contexts";

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

function EfficiencyGapTable() {
  const { postState } = useContext(BlogPostContext);
  const districtCounts = postState && postState["mind-the-gerrymandered-gap"]?.districtCounts;
  if (!districtCounts)
    return (
      <p>
        <b>
          To see a sample calculation of the efficiency gap, please finish
          drawing your districts above.
        </b>
      </p>
    );
  let blueAcc = d => d[0];
  let redAcc = d => d[1];
  let wastedVotes = calculateWastedVotes(districtCounts, blueAcc, redAcc);
  let totalWastedVotes = calculateTotalWastedVotes(wastedVotes);
  let totalVotes = calculateTotalVotes(districtCounts, blueAcc, redAcc);
  let eg = calculateEfficiencyGap(totalWastedVotes, totalVotes);
  let gapCopyEnd = "";
  if (totalWastedVotes[0] !== totalWastedVotes[1]) {
    let favoredColor = eg < 0 ? "blue" : "red";
    gapCopyEnd = ` in favor of ${favoredColor}`;
  }
  let gapCopy = (
    <div>
      (<ColoredSpan color={COLORS.DARK_BLUE}>{totalWastedVotes[0]}</ColoredSpan>{" "}
      &ndash;{" "}
      <ColoredSpan color={COLORS.RED}>{totalWastedVotes[1]}</ColoredSpan>)
      &divide; {totalVotes} = {(Math.abs(eg) * 100).toFixed(2)}%{gapCopyEnd}.
    </div>
  );
  return (
    <div>
      <p>
        Here's a sample efficiency gap calculation based on the districts you
        created above.
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

EfficiencyGapTable.propTypes = {
  districtCounts: PropTypes.array
};

EfficiencyGapTable.defaultProps = {
  districtCounts: null
};

export default EfficiencyGapTable;
