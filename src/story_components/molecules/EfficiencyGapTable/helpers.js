
import { total } from "utils/mathHelpers";

/**
 * Accumulates all wasted votes into one number per party
 * @param {Array} wastedVotes - array of arrays of wasted votes by district
 * @returns {Array} Total number of wasted votes for each party
 */
export function calculateTotalWastedVotes(wastedVotes) {
  return wastedVotes.reduce(
    (totals, cur) => {
      totals[0] += cur[0];
      totals[1] += cur[1];
      return totals;
    },
    [0, 0]
  );
}

/**
 * Given an array of vote objects, calculate the total number of votes.
 * Assumes only two parties can receive votes.
 * @param {Array} votes - array of vote objects
 * @param {Function} party1Accessor - function to access votes for party 1
 * @param {Function} party2Accessor - function to access votes for party 2
 * @returns {Number} Total number of votes cast
 */
export function calculateTotalVotes(votes, party1Accessor, party2Accessor) {
  return total(votes, num => party1Accessor(num) + party2Accessor(num));
};

/**
 * Given a vote count and wasted vote count, calculate the efficiency gap.
 * @param {Number} totalWasted - total wasted vote count
 * @param {Number} totalVotes - total vote count
 * @returns {Number} efficiency gap
 */
export function calculateEfficiencyGap(totalWasted, totalVotes) {
  return (totalWasted[0] - totalWasted[1]) / totalVotes;
};