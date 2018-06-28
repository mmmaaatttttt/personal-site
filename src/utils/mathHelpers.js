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
  s.solve(
    diffEq(...diffEqValues),
    min,
    initialValues,
    max,
    s.grid(step, (x, y) => {
      data.forEach((arr, i) => {
        arr.push({ x, y: y[i] });
      });
    })
  );
  return data;
}

function choices(arr, num) {
  return _shuffle(arr.slice()).slice(0, num);
}

function euclideanDistance(...pts) {
  return pts.reduce((sum, pt) => sum + pt ** 2, 0) ** (1 / 2) || 0;
}

function total(nums, accessor = num => num) {
  return nums.reduce((sum, cur) => sum + accessor(cur), 0);
}

function average(nums, accessor = num => num) {
  if (!nums.length) return 0;
  return total(nums, accessor) / nums.length;
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

export { generateData, choices, euclideanDistance, average, total };
