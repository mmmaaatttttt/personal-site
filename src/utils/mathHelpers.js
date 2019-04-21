import * as odex from "odex";

function generateData(
  count,
  min,
  max,
  step,
  initialValues,
  diffEqValues,
  diffEq
) {
  const s = new odex.Solver(count);
  s.denseOutput = true;
  const data = Array.from({ length: count }, () => []);
  s.absoluteTolerance = 1e-10;
  s.relativeTolerance = 1e-10;
  s.solve(
    diffEq(...diffEqValues),
    min,
    initialValues,
    max,
    s.grid(step, (x, y) => {
      data.forEach((arr, i) => {
        if (!Number.isNaN(y[i])) {
          arr.push({ x, y: y[i] });
        }
      });
    })
  );
  return data;
}

function choices(arr, num) {
  return _shuffle(arr.slice()).slice(0, num);
}

/**
 * Interpolates values between inputs x0 and x1.
 * For example, when t = 1/2, calculates the average of x0 and x1.
 *
 * @param {Number} x0 - first point
 * @param {Number} x1 - second point
 * @param {Number} t - fractional distance between x0 and x1. Between 0 and 1.
 */
function interpolate(x0, x1, t) {
  if (t < 0 || t > 1) {
    throw new Error(`Value of t: ${t}. Value must be between 0 and 1.`);
  }
  return x0 * t + x1 * (1 - t);
}

function euclideanDistance(...pts) {
  return pts.reduce((sum, pt) => sum + pt ** 2, 0) ** (1 / 2) || 0;
}

function total(nums, accessor = num => num) {
  let sum = 0;
  for (let num of nums) sum += accessor(num);
  return sum;
}

function average(nums, accessor = num => num) {
  if (!nums.length) return 0;
  return total(nums, accessor) / nums.length;
}

function calculateWastedVotes(votes, party1Accessor, party2Accessor) {
  return votes.map(district => {
    let party1Votes = party1Accessor(district);
    let party2Votes = party2Accessor(district);
    let votesNeededToWin = Math.ceil((party1Votes + party2Votes + 1) / 2);
    return party1Votes > party2Votes
      ? [party1Votes - votesNeededToWin, party2Votes]
      : [party1Votes, party2Votes - votesNeededToWin];
  });
}

function mod(num, base) {
  return ((num % base) + base) % base;
}

function _swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return arr;
}

function _shuffle(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var randomIdx = Math.floor(Math.random() * i);
    _swap(arr, i, randomIdx);
  }
  return arr;
}

export {
  average,
  calculateWastedVotes,
  choices,
  euclideanDistance,
  generateData,
  interpolate,
  mod,
  total
};
